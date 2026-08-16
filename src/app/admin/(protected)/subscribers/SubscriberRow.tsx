"use client";

import { useActionState, useEffect, useId, useRef, useState, useTransition } from "react";
import { deleteSubscriber, updateSubscriber, type FormState } from "@/lib/admin-data-actions";
import styles from "../table.module.css";

interface Subscriber {
  id: string;
  first_name: string;
  email: string;
  created_at: string;
}

const initialState: FormState = {};

export default function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const [editing, setEditing] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const formId = useId();

  const boundUpdate = updateSubscriber.bind(null, subscriber.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      setEditing(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  const formattedDate = new Date(subscriber.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  function handleDelete() {
    if (!confirm(`Delete ${subscriber.email}? This can't be undone.`)) return;
    startDeleteTransition(() => {
      deleteSubscriber(subscriber.id);
    });
  }

  if (editing) {
    return (
      <tr>
        <td>
          <input
            form={formId}
            name="firstName"
            defaultValue={subscriber.first_name}
            className={styles.input}
            required
          />
        </td>
        <td>
          <input
            form={formId}
            name="email"
            type="email"
            defaultValue={subscriber.email}
            className={styles.input}
            required
          />
          {state.error && <p className={styles.error}>{state.error}</p>}
        </td>
        <td className={styles.muted}>{formattedDate}</td>
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
      <td>{subscriber.first_name}</td>
      <td>{subscriber.email}</td>
      <td className={styles.muted}>{formattedDate}</td>
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
