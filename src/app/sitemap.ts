import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { siteUrl } from "@/lib/site";
import { concernOrder, skinTypeOrder } from "@/lib/skin-profile-content";

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/quiz", changeFrequency: "monthly", priority: 0.9 },
  { path: "/skin-profile", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products", changeFrequency: "monthly", priority: 0.8 },
];

async function getProductUrls(): Promise<MetadataRoute.Sitemap> {
  const { data, error } = await supabaseAdmin.from("skincare_products").select("slug");

  if (error) {
    console.error("Failed to load products for sitemap:", error.message);
    return [];
  }

  return data.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}

function getSkinProfileDetailUrls(): MetadataRoute.Sitemap {
  return [
    ...skinTypeOrder.map((slug) => ({
      url: `${siteUrl}/skin-profile/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...concernOrder.map((slug) => ({
      url: `${siteUrl}/skin-profile/concerns/${slug}`,
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profileUrls, productUrls] = await Promise.all([getProfileUrls(), getProductUrls()]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...getSkinProfileDetailUrls(),
    ...productUrls,
    ...profileUrls,
  ];
}
