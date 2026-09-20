import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { siteUrl } from "@/lib/site";
import { getConcerns, getSkinTypes } from "@/lib/skin-profile-data";
import { blogPosts } from "@/lib/blog-content";

// Regenerate hourly so new products and public profiles show up without a
// redeploy — Next.js otherwise treats this route as static.
export const revalidate = 3600;

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/quiz", changeFrequency: "monthly", priority: 0.9 },
  { path: "/skin-profile", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
];

async function getProductUrls(): Promise<MetadataRoute.Sitemap> {
  const { data, error } = await supabaseAdmin
    .from("skincare_products")
    .select("slug, created_at");

  if (error) {
    console.error("Failed to load products for sitemap:", error.message);
    return [];
  }

  return data.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(product.created_at as string),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}

async function getSkinProfileDetailUrls(): Promise<MetadataRoute.Sitemap> {
  const [skinTypes, concerns] = await Promise.all([getSkinTypes(), getConcerns()]);

  return [
    ...skinTypes.map((row) => ({
      url: `${siteUrl}/skin-profile/${row.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...concerns.map((row) => ({
      url: `${siteUrl}/skin-profile/concerns/${row.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

async function getProfileUrls(): Promise<MetadataRoute.Sitemap> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("username, created_at")
    .not("username", "is", null);

  if (error) {
    console.error("Failed to load profiles for sitemap:", error.message);
    return [];
  }

  return data.map((profile) => ({
    url: `${siteUrl}/u/${profile.username}`,
    lastModified: new Date(profile.created_at as string),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
}

function getBlogUrls(): MetadataRoute.Sitemap {
  return blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profileUrls, productUrls, skinProfileUrls] = await Promise.all([
    getProfileUrls(),
    getProductUrls(),
    getSkinProfileDetailUrls(),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...skinProfileUrls,
    ...getBlogUrls(),
    ...productUrls,
    ...profileUrls,
  ];
}
