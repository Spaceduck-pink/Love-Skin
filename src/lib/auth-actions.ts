"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "./supabase-server";

async function getOrigin() {
  const headerList = await headers();
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  return `${protocol}://${host}`;
}

export async function signInWithGoogle(redirectPath: string = "/") {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
    },
  });

  if (error || !data.url) {
    redirect("/");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
