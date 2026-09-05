import { stripe } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase-server";

// Plain form POST — sends a signed-in Pro user to Stripe's hosted Customer
// Portal to cancel, change card, or view invoices. Any resulting change
// comes back through the webhook, which is the only thing that ever writes
// profiles.plan.
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

  if (!profile?.stripe_customer_id) {
    return Response.redirect(`${siteUrl}/pricing`, 303);
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${siteUrl}/pricing`,
  });

  return Response.redirect(portalSession.url, 303);
}
