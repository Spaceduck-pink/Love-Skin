"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase-server";

// Self-serve plan toggle standing in for real billing — the only write path
// to profiles.plan, same convention as role never being settable from a form.
export async function setPlan(plan: "free" | "pro") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/pricing");
  }

  await supabase.from("profiles").update({ plan }).eq("id", user.id);

  redirect("/pricing");
}
