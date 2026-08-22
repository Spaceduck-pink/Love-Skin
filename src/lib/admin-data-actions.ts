"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase-admin";
import { createClient } from "./supabase-server";

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

// --- Subscribers ---

export async function deleteSubscriber(id: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin.from("subscribers").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/subscribers");
}

export async function updateSubscriber(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!firstName || !email || !email.includes("@")) {
    return { error: "Enter a valid name and email." };
  }

  const { error } = await supabaseAdmin
    .from("subscribers")
    .update({ first_name: firstName, email })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "That email is already subscribed." : "Failed to save.",
    };
  }

  revalidatePath("/admin/subscribers");
  return {};
}

// --- Skincare products ---

export async function deleteProduct(id: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin.from("skincare_products").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateProduct(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const step = Number(formData.get("step"));
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!Number.isInteger(step) || step < 1 || !slug || !title || !description) {
    return { error: "Fill in all fields with a valid step number." };
  }

  const { error } = await supabaseAdmin
    .from("skincare_products")
    .update({ step, slug, title, description })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "That slug is already in use." : "Failed to save.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return {};
}
