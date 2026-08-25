import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AvatarUploader from "@/components/AvatarUploader";
import SettingsForm from "./SettingsForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Account settings — LoveSkin",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "first_name, last_name, username, bio, website_url, instagram_url, tiktok_url, avatar_url",
    )
    .eq("id", user.id)
    .single();

  const googleAvatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.heading}>
          <h1>Account settings</h1>
          <p>Update your profile, name, and email address.</p>
          {profile?.username && (
            <Link href={`/u/${profile.username}`} className={styles.viewProfile}>
              View your public profile →
            </Link>
          )}
        </div>
        <AvatarUploader
          firstName={profile?.first_name ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
          googleAvatarUrl={googleAvatarUrl}
        />
        <SettingsForm
          firstName={profile?.first_name ?? ""}
          lastName={profile?.last_name ?? ""}
          email={user.email ?? ""}
          username={profile?.username ?? ""}
          bio={profile?.bio ?? ""}
          websiteUrl={profile?.website_url ?? ""}
          instagramUrl={profile?.instagram_url ?? ""}
          tiktokUrl={profile?.tiktok_url ?? ""}
        />
      </div>
    </section>
  );
}
