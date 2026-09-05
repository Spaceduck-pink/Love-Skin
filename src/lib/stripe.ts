import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY. Add it to .env.local.");
}

// Server-only — never import this from a "use client" file.
export const stripe = new Stripe(secretKey);
