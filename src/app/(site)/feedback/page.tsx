import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import FeedbackForm from "@/components/FeedbackForm";
import styles from "@/styles/legal-page.module.css";

export const metadata: Metadata = {
  title: "Feedback — LoveSkin",
  description: "Tell us what's working, what's not, and what you'd like to see next on LoveSkin.",
};

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let defaultName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();
    defaultName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">feedback</span>
          <h1 className={styles.heroTitle}>We&apos;d love to hear from you</h1>
          <p className={styles.updated}>
            Good, bad, or somewhere in between — your feedback helps us make LoveSkin better.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.content}`}>
          <FeedbackForm defaultName={defaultName} defaultEmail={user?.email ?? ""} />
        </div>
      </section>
    </>
  );
}
