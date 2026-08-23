"use client";

import { useActionState, useId, useState } from "react";
import { updateSettings, type SettingsState } from "@/lib/settings-actions";
import styles from "./SettingsForm.module.css";

const initialState: SettingsState = {};
const BIO_MAX_LENGTH = 280;

interface SettingsFormProps {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
  websiteUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export default function SettingsForm({
  firstName,
  lastName,
  email,
  username,
  bio,
  websiteUrl,
  instagramUrl,
  tiktokUrl,
}: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);
  const [bioLength, setBioLength] = useState(bio.length);
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const usernameId = useId();
  const bioId = useId();
  const websiteId = useId();
  const instagramId = useId();
  const tiktokId = useId();

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

      <div className={styles.divider} />

      <div className={styles.field}>
        <label htmlFor={usernameId}>Username</label>
        <div className={styles.usernameWrap}>
          <span className={styles.usernamePrefix}>/u/</span>
          <input
            id={usernameId}
            name="username"
            type="text"
            autoComplete="off"
            placeholder="janedoe"
            pattern="[a-z0-9_]{3,20}"
            maxLength={20}
            defaultValue={username}
          />
        </div>
        <p className={styles.helper}>
          3-20 characters: lowercase letters, numbers, and underscores. Leave blank to keep your
          profile private (no public page).
        </p>
      </div>
      <div className={styles.field}>
        <label htmlFor={bioId}>Bio</label>
        <textarea
          id={bioId}
          name="bio"
          rows={3}
          maxLength={BIO_MAX_LENGTH}
          defaultValue={bio}
          placeholder="Tell people a little about you"
          onChange={(event) => setBioLength(event.target.value.length)}
        />
        <p className={styles.helper}>
          {bioLength}/{BIO_MAX_LENGTH}
        </p>
      </div>
      <div className={styles.field}>
        <label htmlFor={websiteId}>Website</label>
        <input
          id={websiteId}
          name="websiteUrl"
          type="text"
          inputMode="url"
          placeholder="yoursite.com"
          defaultValue={websiteUrl}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={instagramId}>Instagram</label>
        <input
          id={instagramId}
          name="instagramUrl"
          type="text"
          inputMode="url"
          placeholder="instagram.com/yourhandle"
          defaultValue={instagramUrl}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={tiktokId}>TikTok</label>
        <input
          id={tiktokId}
          name="tiktokUrl"
          type="text"
          inputMode="url"
          placeholder="tiktok.com/@yourhandle"
          defaultValue={tiktokUrl}
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
      {state.saved && !state.emailConfirmationSent && (
        <p className={styles.notice} role="status">
          Saved.
        </p>
      )}
    </form>
  );
}
