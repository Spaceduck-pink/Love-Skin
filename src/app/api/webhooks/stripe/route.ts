import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Only place that ever writes profiles.plan for real subscriptions — the
// self-serve toggle this replaced is gone, so this webhook is the single
// source of truth. Runs with the service role since Stripe has no Supabase
// session to authenticate as.
async function syncSubscription(customerId: string, subscription: Stripe.Subscription | null) {
  const isActive = subscription?.status === "active" || subscription?.status === "trialing";

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: isActive ? "pro" : "free",
      stripe_subscription_id: isActive ? subscription!.id : null,
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error(`Failed to sync plan for Stripe customer ${customerId}:`, error.message);
  }
}

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET.");
    return Response.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    // First confirmation that checkout succeeded — grants Pro immediately
    // rather than waiting on the subscription events below.
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.client_reference_id && session.customer) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", session.client_reference_id);
        if (error) {
          console.error("Failed to activate Pro after checkout:", error.message);
        }
      }
      break;
    }

    // Ongoing lifecycle: renewals, cancellations, payment failures, etc.
    // Keeps profiles.plan in sync with whatever Stripe now says is true.
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription.customer as string, subscription);
      break;
    }

    default:
      break;
  }

  return Response.json({ received: true });
}
