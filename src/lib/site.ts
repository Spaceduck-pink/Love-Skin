// Falls back to localhost in dev. Set NEXT_PUBLIC_SITE_URL in Vercel project
// env vars (your *.vercel.app URL, or a custom domain later) for production.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
