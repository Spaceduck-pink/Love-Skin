"use client";

import { useTransition } from "react";
import { deleteFeedback } from "@/lib/admin-data-actions";
import styles from "../table.module.css";

interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function FeedbackRow({ feedback }: { feedback: Feedback }) {
  const [isDeleting, startDeleteTransition] = useTransition();

  const formattedDate = new Date(feedback.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  function handleDelete() {
    if (!confirm(`Delete this feedback from ${feedback.name}? This can't be undone.`)) return;
    startDeleteTransition(() => {
      deleteFeedback(feedback.id);
    });
  }

  return (
    <tr>
      <td>{feedback.name}</td>
      <td>{feedback.email}</td>
      <td className={styles.wrapCell}>{feedback.message}</td>
      <td className={styles.muted}>{formattedDate}</td>
      <td>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
