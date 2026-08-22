"use client";

import { useActionState, useId } from "react";
import { updateSettings, type SettingsState } from "@/lib/settings-actions";
import styles from "./SettingsForm.module.css";

const initialState: SettingsState = {};

interface SettingsFormProps {
  firstName: string;
  lastName: string;
  email: string;
}

export default function SettingsForm({ firstName, lastName, email }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.field}>
        <label htmlFor={firstNameId}>First name</label>
        <input
          id={firstNameId}
          name="firstName"
          type="text"
          autoComplete="given-name"
          defaultValue={firstName}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={lastNameId}>Last name</label>
        <input
          id={lastNameId}
          name="lastName"
          type="text"
          autoComplete="family-name"
          defaultValue={lastName}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={emailId}>Email address</label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={email}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </button>
      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
      {state.emailConfirmationSent && (
        <p className={styles.notice} role="status">
          Check your new email address for a confirmation link — your email won&apos;t change
          until you confirm it.
        </p>
      )}
    </form>
  );
}
