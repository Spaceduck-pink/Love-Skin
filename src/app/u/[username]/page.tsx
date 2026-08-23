import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import styles from "./page.module.css";

interface PublicProfile {
  id: string;
  first_name: string | null;
  username: string;
  bio: string | null;
  website_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  avatar_url: string | null;
  created_at: string;
}

// Deliberately uses the service-role client (bypasses RLS) but only ever
// selects this whitelisted, non-sensitive set of columns — never email or
// role — so this route stays safe to expose publicly and unauthenticated.
const getProfile = cache(async (username: string): Promise<PublicProfile | null> => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, first_name, username, bio, website_url, instagram_url, tiktok_url, avatar_url, created_at",
    )
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("Failed to load public profile:", error.message);
  }

  return data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    return { title: "Profile not found — LoveSkin" };
  }

  const displayName = profile.first_name || `@${profile.username}`;
  return {
    title: `${displayName} (@${profile.username}) — LoveSkin`,
    description: profile.bio || `${displayName}'s LoveSkin profile.`,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  const joined = new Date(profile.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  const links = [
    profile.website_url && { label: "Website", href: profile.website_url },
    profile.instagram_url && { label: "Instagram", href: profile.instagram_url },
    profile.tiktok_url && { label: "TikTok", href: profile.tiktok_url },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.card}>
          <Avatar avatarUrl={profile.avatar_url} name={profile.first_name} size={96} />

          <div className={styles.identity}>
            <h1 className={styles.name}>{profile.first_name || `@${profile.username}`}</h1>
            <p className={styles.handle}>@{profile.username}</p>
          </div>

          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

          {links.length > 0 && (
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer nofollow">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className={styles.joined}>Member since {joined}</p>

          {isOwnProfile && (
            <Link href="/settings" className={styles.editLink}>
              Edit your profile →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
