import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import SkinTypeForm from "./SkinTypeForm";

export const metadata: Metadata = {
  title: "Edit Skin Type — Admin",
  robots: { index: false, follow: false },
};

interface SkinTypeRecord {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  signs: string[];
  causes: string;
  look_for: string[];
  avoid: string[];
  mistakes: string[];
  faqs: { q: string; a: string }[];
  image_alt: string;
}

async function getSkinType(id: string): Promise<SkinTypeRecord | null> {
  const { data, error } = await supabaseAdmin
    .from("skin_types")
    .select(
      "id, slug, title, tagline, summary, signs, causes, look_for, avoid, mistakes, faqs, image_alt",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load skin type:", error.message);
    return null;
  }

  return data;
}

export default async function EditSkinTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skinType = await getSkinType(id);
  if (!skinType) notFound();

  return <SkinTypeForm skinType={skinType} />;
}
