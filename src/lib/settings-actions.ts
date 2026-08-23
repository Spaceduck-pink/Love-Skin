"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase-server";

export interface SettingsState {
  error?: string;
  saved?: boolean;
  emailConfirmationSent?: boolean;
}

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const BIO_MAX_LENGTH = 280;

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
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
  const usernameRaw = String(formData.get("username") ?? "").trim().toLowerCase();
  const bio = String(formData.get("bio") ?? "").trim();
  const websiteRaw = String(formData.get("websiteUrl") ?? "").trim();
  const instagramRaw = String(formData.get("instagramUrl") ?? "").trim();
  const tiktokRaw = String(formData.get("tiktokUrl") ?? "").trim();

  if (!firstName || !email || !email.includes("@")) {
    return { error: "Enter a valid name and email." };
  }

  if (usernameRaw && !USERNAME_PATTERN.test(usernameRaw)) {
    return {
      error: "Username must be 3-20 characters: lowercase letters, numbers, and underscores only.",
    };
  }

  if (bio.length > BIO_MAX_LENGTH) {
    return { error: `Bio must be ${BIO_MAX_LENGTH} characters or fewer.` };
  }

  const websiteUrl = websiteRaw ? normalizeUrl(websiteRaw) : null;
  if (websiteRaw && !websiteUrl) {
    return { error: "Enter a valid website URL." };
  }

  const instagramUrl = instagramRaw ? normalizeUrl(instagramRaw) : null;
  if (instagramRaw && !instagramUrl) {
    return { error: "Enter a valid Instagram URL." };
  }

  const tiktokUrl = tiktokRaw ? normalizeUrl(tiktokRaw) : null;
  if (tiktokRaw && !tiktokUrl) {
    return { error: "Enter a valid TikTok URL." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName || null,
      username: usernameRaw || null,
      bio: bio || null,
      website_url: websiteUrl,
      instagram_url: instagramUrl,
      tiktok_url: tiktokUrl,
    })
    .eq("id", user.id);

  if (profileError) {
    if (profileError.code === "23505") {
      return { error: "That username is already taken." };
    }
    return { error: "Failed to save your profile." };
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
  if (usernameRaw) {
    revalidatePath(`/u/${usernameRaw}`);
  }
  return { saved: true, emailConfirmationSent };
}

export interface AvatarState {
  error?: string;
  avatarUrl?: string;
}

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadAvatar(
  _prevState: AvatarState,
  formData: FormData,
): Promise<AvatarState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }

  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    return { error: "Avatar must be a PNG, JPEG, WebP, or GIF image." };
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return { error: "Avatar must be 2MB or smaller." };
  }

  const extension = EXTENSION_BY_TYPE[file.type];
  const path = `${user.id}/avatar-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return { error: "Failed to upload avatar." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Failed to save your new avatar." };
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { avatarUrl: publicUrl };
}

/* eslint-disable @typescript-eslint/no-unused-vars -- signature must match useActionState's (state, payload) shape */
export async function resetAvatarToGoogle(
  _prevState: AvatarState,
  _formData: FormData,
): Promise<AvatarState> {
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const googleAvatar =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: googleAvatar })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Failed to reset avatar." };
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { avatarUrl: googleAvatar ?? undefined };
}
