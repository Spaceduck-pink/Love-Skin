import { stripe } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase-server";
import { PRO_PRICE_GBP_PENCE, PRO_PRICE_INTERVAL, PRO_PRODUCT_NAME } from "@/lib/pro-product";

// Plain form POST (no client JS needed) — creates a Stripe Checkout Session
// for the Pro subscription and redirects the browser straight to it. The
// actual plan flip happens later, via the webhook, once Stripe confirms
// payment (see src/app/api/webhooks/stripe/route.ts).
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.redirect(`${siteUrl}/pricing`, 303);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ...(profile?.stripe_customer_id
      ? { customer: profile.stripe_customer_id }
      : { customer_email: user.email ?? undefined }),
    // Ties the session (and the subscription it creates) back to a Supabase
    // user id, since Stripe has no idea what a "profile" is.
    client_reference_id: user.id,
    subscription_data: { metadata: { supabase_user_id: user.id } },
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: PRO_PRICE_GBP_PENCE,
          recurring: { interval: PRO_PRICE_INTERVAL },
          product_data: { name: PRO_PRODUCT_NAME },
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/pricing?upgraded=1`,
    cancel_url: `${siteUrl}/pricing`,
    // This account has Stripe's Managed Payments (merchant-of-record tax
    // handling) on by default, which requires a tax_code on every product.
    // Skip it, matching the existing PDF guide checkout.
    managed_payments: { enabled: false },
  });

  if (!session.url) {
    return Response.json({ error: "Could not start checkout." }, { status: 502 });
  }

  return Response.redirect(session.url, 303);
}
