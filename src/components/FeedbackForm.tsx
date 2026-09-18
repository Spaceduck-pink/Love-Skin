"use client";

import { useActionState, useId } from "react";
import { submitFeedback, type FeedbackState } from "@/lib/actions";
import styles from "./FeedbackForm.module.css";

const initialState: FeedbackState = { status: "idle" };

export default function FeedbackForm({
  defaultName = "",
  defaultEmail = "",
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [state, formAction, pending] = useActionState(submitFeedback, initialState);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  if (state.status === "success") {
    return (
      <div className={styles.card}>
        <div className={styles.success} role="status">
          <h2>Thanks for the feedback</h2>
          <p>We read every message — we appreciate you taking the time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <form className={styles.form} action={formAction}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor={nameId}>Name</label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              defaultValue={defaultName}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={emailId}>Email address</label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={defaultEmail}
              required
            />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor={messageId}>Your feedback</label>
          <textarea
            id={messageId}
            name="message"
            required
            maxLength={2000}
            placeholder="What's working, what's not, what would you like to see?"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Send feedback"}
        </button>
        {state.status === "error" && (
          <p className={styles.error} role="alert">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
