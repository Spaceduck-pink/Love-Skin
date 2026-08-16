"use client";

import { useActionState, useId } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/actions";
import FadeIn from "./FadeIn";
import styles from "./NewsletterForm.module.css";

const initialState: NewsletterState = { status: "idle" };

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);
  const firstNameId = useId();
  const emailId = useId();

  return (
    <FadeIn id="newsletter" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        {state.status === "success" ? (
          <div className={styles.success} role="status">
            <h2>You&apos;re on the list</h2>
            <p>Thanks for subscribing — keep an eye on your inbox.</p>
          </div>
        ) : (
          <>
            <div className={styles.heading}>
              <h2>Stay in the loop</h2>
              <p>Skincare tips and routine updates, straight to your inbox. No spam.</p>
            </div>
            <form className={styles.form} action={formAction}>
              <div className={styles.field}>
                <label htmlFor={firstNameId}>First name</label>
                <input
                  id={firstNameId}
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor={emailId}>Email address</label>
                <input id={emailId} name="email" type="email" autoComplete="email" required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Subscribing…" : "Subscribe"}
              </button>
              {state.status === "error" && (
                <p className={styles.error} role="alert">
                  {state.message}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </FadeIn>
  );
}
