"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateConcern, type FormState } from "@/lib/admin-skin-profile-actions";
import { arrayToLines, serializeFaqs, serializeWhatHelps } from "@/lib/admin-skin-profile-format";
import styles from "../../form.module.css";

interface ConcernRecord {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  causes: string;
  what_helps: { title: string; description: string }[];
  mistakes: string[];
  tip: string;
  faqs: { q: string; a: string }[];
  image_alt: string;
}

const initialState: FormState = {};

export default function ConcernForm({ concern }: { concern: ConcernRecord }) {
  const boundUpdate = updateConcern.bind(null, concern.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit {concern.title}</h1>
        <Link href="/admin/skin-profile" className={styles.backLink}>
          ← Back to skin profile
        </Link>
      </div>

      <form action={formAction} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={concern.slug}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={concern.title}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="tagline">
            Tagline
          </label>
          <input
            id="tagline"
            name="tagline"
            defaultValue={concern.tagline}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="causes">
            What causes it
          </label>
          <textarea
            id="causes"
            name="causes"
            defaultValue={concern.causes}
            className={styles.textareaLg}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="whatHelps">
            What helps
          </label>
          <span className={styles.hint}>
            One per block, separated by a blank line, formatted as “Title: …” then “Description:
            …”.
          </span>
          <textarea
            id="whatHelps"
            name="whatHelps"
            defaultValue={serializeWhatHelps(concern.what_helps)}
            className={styles.textareaLg}
            style={{ minHeight: "10rem" }}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="mistakes">
            Common mistakes
          </label>
          <span className={styles.hint}>One mistake per line.</span>
          <textarea
            id="mistakes"
            name="mistakes"
            defaultValue={arrayToLines(concern.mistakes)}
            className={styles.textareaLg}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="tip">
            Tip
          </label>
          <textarea id="tip" name="tip" defaultValue={concern.tip} className={styles.textarea} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="faqs">
            FAQs
          </label>
          <span className={styles.hint}>
            One per block, separated by a blank line, formatted as “Q: …” then “A: …”.
          </span>
          <textarea
            id="faqs"
            name="faqs"
            defaultValue={serializeFaqs(concern.faqs)}
            className={styles.textareaLg}
            style={{ minHeight: "14rem" }}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="imageAlt">
            Hero image alt text
          </label>
          <input
            id="imageAlt"
            name="imageAlt"
            defaultValue={concern.image_alt}
            className={styles.input}
            required
          />
        </div>

        {state.error && <p className={styles.error}>{state.error}</p>}

        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </button>
          <Link href="/admin/skin-profile" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
