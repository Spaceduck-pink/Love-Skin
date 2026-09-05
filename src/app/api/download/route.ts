import { readFile } from "node:fs/promises";
import path from "node:path";
import { stripe } from "@/lib/stripe";
import {
  GUIDE_PRODUCT_ID,
  GUIDE_PDF_PATH,
  GUIDE_DOWNLOAD_FILENAME,
} from "@/lib/guide-product";

// Gate the actual PDF bytes behind a live Stripe check, rather than trusting
// anything the client sends — this route is the only place the file is
// readable from, since it lives outside /public.
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return Response.json({ error: "Missing session_id." }, { status: 400 });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return Response.json({ error: "Invalid session." }, { status: 404 });
  }

  if (
    session.payment_status !== "paid" ||
    session.metadata?.product !== GUIDE_PRODUCT_ID
  ) {
    return Response.json({ error: "Payment not confirmed." }, { status: 402 });
  }

  const filePath = path.join(process.cwd(), GUIDE_PDF_PATH);
  const file = await readFile(filePath);

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${GUIDE_DOWNLOAD_FILENAME}"`,
      "Content-Length": String(file.byteLength),
    },
  });
}
