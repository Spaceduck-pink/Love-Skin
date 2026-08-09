"use client";

import { useId, useState, type FormEvent } from "react";
import FadeIn from "./FadeIn";
import styles from "./NewsletterForm.module.css";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const firstNameId = useId();
  const emailId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <FadeIn id="newsletter" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        {submitted ? (
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
            <form className={styles.form} onSubmit={handleSubmit}>
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
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </>
        )}
      </div>
    </FadeIn>
  );
}
