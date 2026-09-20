"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateSkinType, type FormState } from "@/lib/admin-skin-profile-actions";
import { arrayToLines, serializeFaqs } from "@/lib/admin-skin-profile-format";
import styles from "../../form.module.css";

interface SkinTypeRecord {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  signs: string[];
  causes: string;
  look_for: string[];
  avoid: string[];
  mistakes: string[];
  faqs: { q: string; a: string }[];
  image_alt: string;
}

const initialState: FormState = {};

export default function SkinTypeForm({ skinType }: { skinType: SkinTypeRecord }) {
  const boundUpdate = updateSkinType.bind(null, skinType.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit {skinType.title} skin</h1>
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
              defaultValue={skinType.slug}
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
              defaultValue={skinType.title}
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
            defaultValue={skinType.tagline}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            defaultValue={skinType.summary}
            className={styles.textareaLg}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="signs">
            How to tell (signs)
          </label>
          <span className={styles.hint}>One sign per line.</span>
          <textarea
            id="signs"
            name="signs"
            defaultValue={arrayToLines(skinType.signs)}
            className={styles.textareaLg}
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
            defaultValue={skinType.causes}
            className={styles.textareaLg}
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lookFor">
              Look for
            </label>
            <span className={styles.hint}>One ingredient/product per line.</span>
            <textarea
              id="lookFor"
              name="lookFor"
              defaultValue={arrayToLines(skinType.look_for)}
              className={styles.textareaLg}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="avoid">
              Avoid
            </label>
            <span className={styles.hint}>One item per line.</span>
            <textarea
              id="avoid"
              name="avoid"
              defaultValue={arrayToLines(skinType.avoid)}
              className={styles.textareaLg}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="mistakes">
            Common mistakes
          </label>
          <span className={styles.hint}>One mistake per line.</span>
          <textarea
            id="mistakes"
            name="mistakes"
            defaultValue={arrayToLines(skinType.mistakes)}
            className={styles.textareaLg}
            required
          />
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
            defaultValue={serializeFaqs(skinType.faqs)}
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
            defaultValue={skinType.image_alt}
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
