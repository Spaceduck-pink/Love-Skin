import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
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
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.heading}>
          <h1>Account settings</h1>
          <p>Update your name and email address.</p>
        </div>
        <SettingsForm
          firstName={profile?.first_name ?? ""}
          lastName={profile?.last_name ?? ""}
          email={user.email ?? ""}
        />
      </div>
    </section>
  );
}
