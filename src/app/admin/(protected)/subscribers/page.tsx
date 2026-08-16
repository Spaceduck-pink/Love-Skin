import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import SubscriberRow from "./SubscriberRow";
import styles from "../table.module.css";

export const metadata: Metadata = {
  title: "Subscribers — Admin",
  robots: { index: false, follow: false },
};

async function getSubscribers() {
  const { data, error } = await supabaseAdmin
    .from("subscribers")
    .select("id, first_name, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load subscribers:", error.message);
    return [];
  }

  return data;
}

export default async function AdminSubscribersPage() {
  const subscribers = await getSubscribers();

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Subscribers</h1>
        <span className={styles.count}>
          {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}
        </span>
      </div>

      {subscribers.length === 0 ? (
        <p className={styles.empty}>No newsletter subscribers yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>First name</th>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <SubscriberRow key={subscriber.id} subscriber={subscriber} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
