import { cache } from "react";
import { createClient } from "@/lib/supabase-server";

export interface HeaderAuth {
  isSignedIn: boolean;
  isAdmin: boolean;
  firstName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

// Deduped per-request: both HeaderAuthDesktop and HeaderAuthMobile call this,
// but the actual Supabase round trips only happen once per request.
export const getHeaderAuth = cache(async (): Promise<HeaderAuth> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isSignedIn: false, isAdmin: false, firstName: null, username: null, avatarUrl: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, username, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    isSignedIn: true,
    isAdmin: profile?.role === "admin",
    firstName: profile?.first_name ?? null,
    username: profile?.username ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };
});
