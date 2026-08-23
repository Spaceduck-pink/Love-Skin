import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import type { RoutineResult } from "@/lib/types";
import RoutineEditor from "@/components/routine/RoutineEditor";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "My Routine — LoveSkin",
  robots: { index: false, follow: false },
};

export default async function MyRoutinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("skin_profiles")
    .select("routine")
    .eq("user_id", user.id)
    .maybeSingle();

  const routine = profile?.routine as RoutineResult | undefined;

  if (!routine) {
    return (
      <section className={styles.section}>
        <div className={`container ${styles.empty}`}>
          <span className="mono-tag">my routine</span>
          <h1>Take the quiz to get started</h1>
          <p>
            Answer a few quick questions and we&apos;ll build you a personalized AM/PM routine
            that you can then fine-tune here.
          </p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.heading}>
          <span className="mono-tag">my routine</span>
          <h1>{routine.headline}</h1>
          <p>{routine.summary}</p>
          <Link href="/quiz" className={styles.retake}>
            Retake the quiz →
          </Link>
        </div>

        <RoutineEditor am={routine.am} pm={routine.pm} />
      </div>
    </section>
  );
}
