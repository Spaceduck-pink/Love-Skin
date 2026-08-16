"use client";

import { useActionState, useEffect, useId, useRef, useState, useTransition } from "react";
import { deleteProduct, updateProduct, type FormState } from "@/lib/admin-data-actions";
import styles from "../table.module.css";

interface Product {
  id: string;
  step: number;
  slug: string;
  title: string;
  description: string;
}

const initialState: FormState = {};

export default function ProductRow({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const formId = useId();

  const boundUpdate = updateProduct.bind(null, product.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      setEditing(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  function handleDelete() {
    if (!confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    startDeleteTransition(() => {
      deleteProduct(product.id);
    });
  }

  if (editing) {
    return (
      <tr>
        <td>
          <input
            form={formId}
            name="step"
            type="number"
            min={1}
            defaultValue={product.step}
            className={styles.input}
            style={{ width: "4.5rem" }}
            required
          />
        </td>
        <td>
          <input form={formId} name="slug" defaultValue={product.slug} className={styles.input} required />
        </td>
        <td>
          <input form={formId} name="title" defaultValue={product.title} className={styles.input} required />
        </td>
        <td>
          <textarea
            form={formId}
            name="description"
            defaultValue={product.description}
            className={styles.textarea}
            required
          />
          {state.error && <p className={styles.error}>{state.error}</p>}
        </td>
        <td>
          <form id={formId} action={formAction} className={styles.actions}>
            <button type="submit" className={styles.actionBtn} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setEditing(false)}
              disabled={pending}
            >
              Cancel
            </button>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{String(product.step).padStart(2, "0")}</td>
      <td className={styles.muted}>{product.slug}</td>
      <td>{product.title}</td>
      <td className={styles.muted}>{product.description}</td>
      <td>
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} onClick={() => setEditing(true)}>
            Edit
          </button>
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
