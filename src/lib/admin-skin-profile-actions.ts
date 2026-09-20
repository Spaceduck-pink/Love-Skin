"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase-admin";
import { createClient } from "./supabase-server";
import { linesToArray, parseFaqs, parseWhatHelps } from "./admin-skin-profile-format";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    redirect("/");
  }
}

export interface FormState {
  error?: string;
}

// --- Skin types ---

export async function deleteSkinType(id: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin.from("skin_types").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/skin-profile");
  revalidatePath("/skin-profile");
}

export async function updateSkinType(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const causes = String(formData.get("causes") ?? "").trim();
  const imageAlt = String(formData.get("imageAlt") ?? "").trim();
  const signs = linesToArray(String(formData.get("signs") ?? ""));
  const lookFor = linesToArray(String(formData.get("lookFor") ?? ""));
  const avoid = linesToArray(String(formData.get("avoid") ?? ""));
  const mistakes = linesToArray(String(formData.get("mistakes") ?? ""));
  const faqs = parseFaqs(String(formData.get("faqs") ?? ""));

  if (!slug || !title || !tagline || !summary || !causes || !imageAlt) {
    return { error: "Fill in all required fields." };
  }
  if (signs.length === 0 || lookFor.length === 0 || avoid.length === 0 || mistakes.length === 0) {
    return { error: "Signs, look for, avoid, and mistakes each need at least one line." };
  }
  if (faqs.length === 0) {
    return { error: "Add at least one FAQ in the \"Q: … / A: …\" format." };
  }

  const { error } = await supabaseAdmin
    .from("skin_types")
    .update({
      slug,
      title,
      tagline,
      summary,
      causes,
      image_alt: imageAlt,
      signs,
      look_for: lookFor,
      avoid,
      mistakes,
      faqs,
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "That slug is already in use." : "Failed to save.",
    };
  }

  revalidatePath("/admin/skin-profile");
  revalidatePath("/skin-profile");
  revalidatePath(`/skin-profile/${slug}`);
  return {};
}

// --- Skin concerns ---

export async function deleteConcern(id: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin.from("skin_concerns").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/skin-profile");
  revalidatePath("/skin-profile");
}

export async function updateConcern(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const causes = String(formData.get("causes") ?? "").trim();
  const tip = String(formData.get("tip") ?? "").trim();
  const imageAlt = String(formData.get("imageAlt") ?? "").trim();
  const mistakes = linesToArray(String(formData.get("mistakes") ?? ""));
  const whatHelps = parseWhatHelps(String(formData.get("whatHelps") ?? ""));
  const faqs = parseFaqs(String(formData.get("faqs") ?? ""));

  if (!slug || !title || !tagline || !causes || !tip || !imageAlt) {
    return { error: "Fill in all required fields." };
  }
  if (mistakes.length === 0) {
    return { error: "Mistakes needs at least one line." };
  }
  if (whatHelps.length === 0) {
    return { error: "Add at least one \"What helps\" entry in the \"Title: … / Description: …\" format." };
  }
  if (faqs.length === 0) {
    return { error: "Add at least one FAQ in the \"Q: … / A: …\" format." };
  }

  const { error } = await supabaseAdmin
    .from("skin_concerns")
    .update({
      slug,
      title,
      tagline,
      causes,
      tip,
      image_alt: imageAlt,
      mistakes,
      what_helps: whatHelps,
      faqs,
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "That slug is already in use." : "Failed to save.",
    };
  }

  revalidatePath("/admin/skin-profile");
  revalidatePath("/skin-profile");
  revalidatePath(`/skin-profile/concerns/${slug}`);
  return {};
}
