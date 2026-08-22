"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { updateUserProfile, type FormState } from "@/lib/admin-data-actions";
import styles from "../table.module.css";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  created_at: string;
}

const initialState: FormState = {};

export default function UserRow({ user, isSelf }: { user: UserProfile; isSelf: boolean }) {
  const [editing, setEditing] = useState(false);
  const formId = useId();

  const boundUpdate = updateUserProfile.bind(null, user.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      setEditing(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  const formattedDate = new Date(user.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";

  if (editing) {
    return (
      <tr>
        <td>
          <input
            form={formId}
            name="firstName"
            defaultValue={user.first_name ?? ""}
            className={styles.input}
            placeholder="First name"
          />
          <input
            form={formId}
            name="lastName"
            defaultValue={user.last_name ?? ""}
            className={styles.input}
            placeholder="Last name"
            style={{ marginTop: "0.4rem" }}
          />
        </td>
        <td className={styles.muted}>{user.email}</td>
        <td>
          <select form={formId} name="role" defaultValue={user.role} className={styles.input}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
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
      <td>
        {fullName}
        {isSelf && <span className={styles.muted}> (you)</span>}
      </td>
      <td>{user.email}</td>
      <td style={{ textTransform: "capitalize" }}>{user.role}</td>
      <td className={styles.muted}>{formattedDate}</td>
      <td>
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} onClick={() => setEditing(true)}>
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
}
