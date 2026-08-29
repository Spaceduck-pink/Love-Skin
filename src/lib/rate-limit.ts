import { supabaseAdmin } from "@/lib/supabase-admin";

export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export async function checkRateLimit(
  route: string,
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  const { count, error } = await supabaseAdmin
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("route", route)
    .eq("identifier", identifier)
    .gte("created_at", windowStart);

  if (error) {
    // Fail open — log and let the request through, matching this codebase's
    // existing pattern of degrading gracefully on Supabase errors rather
    // than hard-failing a user-facing request over an infra hiccup.
    console.error(`Rate limit check failed for ${route}:`, error.message);
    return { allowed: true };
  }

  if ((count ?? 0) >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  const { error: insertError } = await supabaseAdmin
    .from("rate_limit_events")
    .insert({ route, identifier });
  if (insertError) {
    console.error(`Rate limit event insert failed for ${route}:`, insertError.message);
  }

  // Opportunistic cleanup — no cron/scheduled job in this project, so sweep
  // old rows on a small fraction of requests instead. 1 day of retention is
  // comfortably longer than the longest window used below (1 hour).
  if (Math.random() < 0.01) {
    void supabaseAdmin
      .from("rate_limit_events")
      .delete()
      .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  }

  return { allowed: true };
}

export const CHAT_LIMIT = 30; // messages per hour per identifier
export const CHAT_WINDOW_MS = 60 * 60 * 1000;
export const CHAT_BURST_LIMIT = 6; // messages per minute per identifier
export const CHAT_BURST_WINDOW_MS = 60 * 1000;

export const GENERATE_ROUTINE_LIMIT = 10; // Gemini routine generations per hour per identifier
export const GENERATE_ROUTINE_WINDOW_MS = 60 * 60 * 1000;
