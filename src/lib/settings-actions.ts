"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase-server";

export interface SettingsState {
  error?: string;
  saved?: boolean;
  emailConfirmationSent?: boolean;
}

export async function updateSettings(
  _prevState: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!firstName || !email || !email.includes("@")) {
    return { error: "Enter a valid name and email." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName || null })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Failed to save your name." };
  }

  let emailConfirmationSent = false;
  if (email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) {
      return { error: "Failed to update email. Try again." };
    }
    emailConfirmationSent = true;
  }

  revalidatePath("/settings");
  return { saved: true, emailConfirmationSent };
}
