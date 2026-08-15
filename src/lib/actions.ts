"use server";

import { supabase } from "./supabase";
import type { QuizAnswers, RoutineResult } from "./types";

export async function saveSkinProfile(answers: QuizAnswers, routine: RoutineResult) {
  const { error } = await supabase.from("skin_profiles").insert({
    skin_type: answers.skinType,
    concern: answers.concern,
    midday_feel: answers.middayFeel,
    spf_usage: answers.spfUsage,
    complexity: answers.complexity,
    routine,
  });

  if (error) {
    console.error("Failed to save skin profile:", error.message);
  }
}
