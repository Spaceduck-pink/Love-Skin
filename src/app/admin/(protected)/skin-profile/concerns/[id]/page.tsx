import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ConcernForm from "./ConcernForm";

export const metadata: Metadata = {
  title: "Edit Skin Concern — Admin",
  robots: { index: false, follow: false },
};

interface ConcernRecord {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  causes: string;
  what_helps: { title: string; description: string }[];
  mistakes: string[];
  tip: string;
  faqs: { q: string; a: string }[];
  image_alt: string;
}

async function getConcern(id: string): Promise<ConcernRecord | null> {
  const { data, error } = await supabaseAdmin
    .from("skin_concerns")
    .select("id, slug, title, tagline, causes, what_helps, mistakes, tip, faqs, image_alt")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load skin concern:", error.message);
    return null;
  }

  return data;
}

export default async function EditConcernPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concern = await getConcern(id);
  if (!concern) notFound();

  return <ConcernForm concern={concern} />;
}
