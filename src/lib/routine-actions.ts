"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase-server";
import type { RoutineResult, RoutineStep } from "./types";

export interface RoutineState {
  error?: string;
  saved?: boolean;
}

const MAX_STEPS = 12;
const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 280;

function parseSteps(formData: FormData, period: "am" | "pm"): RoutineStep[] | null {
  const titles = formData.getAll(`${period}Title`);
  const descriptions = formData.getAll(`${period}Description`);

  const steps: RoutineStep[] = [];
  for (let i = 0; i < titles.length; i++) {
    const title = String(titles[i] ?? "").trim();
    const description = String(descriptions[i] ?? "").trim();
    if (!title) continue;
    if (title.length > MAX_TITLE_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
      return null;
    }
    steps.push({ title, description });
  }
  return steps;
}

export async function updateRoutine(
  _prevState: RoutineState,
  formData: FormData,
): Promise<RoutineState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const am = parseSteps(formData, "am");
  const pm = parseSteps(formData, "pm");

  if (!am || !pm) {
    return {
      error: `Each step's title must be ${MAX_TITLE_LENGTH} characters or fewer, and its notes ${MAX_DESCRIPTION_LENGTH} or fewer.`,
    };
  }

  if (am.length === 0 || pm.length === 0) {
    return { error: "Your morning and evening routines need at least one step." };
  }

  if (am.length > MAX_STEPS || pm.length > MAX_STEPS) {
    return { error: `Routines can have up to ${MAX_STEPS} steps each.` };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("skin_profiles")
    .select("routine")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !existing) {
    return { error: "Take the quiz first to start your routine." };
  }

  const routine = existing.routine as RoutineResult;
  const { error } = await supabase
    .from("skin_profiles")
    .update({ routine: { ...routine, am, pm } })
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to save your routine." };
  }

  revalidatePath("/my-routine");
  return { saved: true };
}
