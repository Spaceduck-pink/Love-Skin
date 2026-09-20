import { supabase } from "./supabase";
import type { Concern, SkinType } from "./types";

export interface Faq {
  q: string;
  a: string;
}

export interface WhatHelpsItem {
  title: string;
  description: string;
}

export interface SkinTypeRow {
  id: string;
  slug: SkinType;
  title: string;
  tagline: string;
  summary: string;
  signs: string[];
  causes: string;
  look_for: string[];
  avoid: string[];
  mistakes: string[];
  faqs: Faq[];
  image_alt: string;
  sort_order: number;
}

export interface ConcernRow {
  id: string;
  slug: Concern;
  title: string;
  tagline: string;
  causes: string;
  what_helps: WhatHelpsItem[];
  mistakes: string[];
  tip: string;
  faqs: Faq[];
  image_alt: string;
  sort_order: number;
}

const skinTypeColumns =
  "id, sort_order, slug, title, tagline, summary, signs, causes, look_for, avoid, mistakes, faqs, image_alt";

const concernColumns =
  "id, sort_order, slug, title, tagline, causes, what_helps, mistakes, tip, faqs, image_alt";

export async function getSkinTypes(): Promise<SkinTypeRow[]> {
  const { data, error } = await supabase
    .from("skin_types")
    .select(skinTypeColumns)
    .order("sort_order");

  if (error) {
    console.error("Failed to load skin types:", error.message);
    return [];
  }

  return data as unknown as SkinTypeRow[];
}

export async function getSkinType(slug: string): Promise<SkinTypeRow | null> {
  const { data, error } = await supabase
    .from("skin_types")
    .select(skinTypeColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load skin type:", error.message);
    return null;
  }

  return data as unknown as SkinTypeRow | null;
}

export async function getConcerns(): Promise<ConcernRow[]> {
  const { data, error } = await supabase
    .from("skin_concerns")
    .select(concernColumns)
    .order("sort_order");

  if (error) {
    console.error("Failed to load skin concerns:", error.message);
    return [];
  }

  return data as unknown as ConcernRow[];
}

export async function getConcern(slug: string): Promise<ConcernRow | null> {
  const { data, error } = await supabase
    .from("skin_concerns")
    .select(concernColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load skin concern:", error.message);
    return null;
  }

  return data as unknown as ConcernRow | null;
}
