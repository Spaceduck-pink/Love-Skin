import { stripe } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";
import {
  GUIDE_PRODUCT_ID,
  GUIDE_PRICE_GBP_PENCE,
  GUIDE_NAME,
} from "@/lib/guide-product";

// Plain form POST (no client JS needed) — creates a Stripe Checkout Session
// for the one-off PDF purchase and redirects the browser straight to it.
export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: GUIDE_PRICE_GBP_PENCE,
          product_data: { name: GUIDE_NAME },
        },
        quantity: 1,
      },
    ],
    metadata: { product: GUIDE_PRODUCT_ID },
    success_url: `${siteUrl}/guide/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/#guide`,
    // This account has Stripe's Managed Payments (merchant-of-record tax
    // handling) on by default, which requires a tax_code on every product.
    // Skip it for this simple one-off digital sale.
    managed_payments: { enabled: false },
  });

  if (!session.url) {
    return Response.json({ error: "Could not start checkout." }, { status: 502 });
  }

  return Response.redirect(session.url, 303);
}
