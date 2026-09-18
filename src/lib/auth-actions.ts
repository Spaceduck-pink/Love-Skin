"use server";

import { cookies, headers } from "next/headers";
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

  // "next" travels via a short-lived cookie instead of a query string, so
  // redirectTo below stays an exact, plain URL — Supabase's non-wildcard
  // allow-list entries require an exact match including the query string,
  // and juggling wildcard entries in the dashboard for every "next" value
  // isn't worth it.
  const cookieStore = await cookies();
  cookieStore.set("auth_next", redirectPath, {
    maxAge: 60 * 10,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
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
