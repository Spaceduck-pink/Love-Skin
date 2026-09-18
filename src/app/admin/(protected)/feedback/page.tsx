import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import FeedbackRow from "./FeedbackRow";
import styles from "../table.module.css";

export const metadata: Metadata = {
  title: "Feedback — Admin",
  robots: { index: false, follow: false },
};

async function getFeedback() {
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load feedback:", error.message);
    return [];
  }

  return data;
}

export default async function AdminFeedbackPage() {
  const feedback = await getFeedback();

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Feedback</h1>
        <span className={styles.count}>
          {feedback.length} {feedback.length === 1 ? "message" : "messages"}
        </span>
      </div>

      {feedback.length === 0 ? (
        <p className={styles.empty}>No feedback yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <FeedbackRow key={item.id} feedback={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
