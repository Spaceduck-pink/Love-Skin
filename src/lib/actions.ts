"use server";

import { supabase } from "./supabase";
import { createClient } from "./supabase-server";
import type { QuizAnswers, RoutineResult } from "./types";

export async function saveSkinProfile(answers: QuizAnswers, routine: RoutineResult) {
  const payload = {
    skin_type: answers.skinType,
    concern: answers.concern,
    midday_feel: answers.middayFeel,
    spf_usage: answers.spfUsage,
    complexity: answers.complexity,
    routine,
  };

  const authedClient = await createClient();
  const {
    data: { user },
  } = await authedClient.auth.getUser();

  // Signed-in users get their result upserted onto a single row (keyed by
  // user_id) so it shows up on their account and retaking the quiz updates
  // it in place. Signed-out visitors fall back to the anon client, which
  // can only insert (existing RLS policy) — matches prior anonymous-only
  // behavior.
  const { error } = user
    ? await authedClient
        .from("skin_profiles")
        .upsert({ ...payload, user_id: user.id }, { onConflict: "user_id" })
    : await supabase.from("skin_profiles").insert(payload);

  if (error) {
    console.error("Failed to save skin profile:", error.message);
  }
}

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!firstName || !email || !email.includes("@")) {
    return { status: "error", message: "Please enter a valid name and email." };
  }

  const { error } = await supabase.from("subscribers").insert({
    first_name: firstName,
    email,
  });

  if (error) {
    // Unique violation just means they're already subscribed — treat as success.
    if (error.code === "23505") {
      return { status: "success" };
    }
    console.error("Failed to save subscriber:", error.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success" };
}
