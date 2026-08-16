import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET. Add it to .env.local.");
  }
  return secret;
}

function hash(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

// Constant-time string comparison, used for the admin password so a
// mistyped guess can't be brute-forced via timing. Hashing both sides first
// normalizes them to equal-length buffers, which timingSafeEqual requires.
export function safeCompare(a: string, b: string) {
  const aHash = Buffer.from(hash(a));
  const bHash = Buffer.from(hash(b));
  return timingSafeEqual(aHash, bHash);
}

export async function createAdminSession() {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  const signature = hash(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expected = hash(payload);
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
