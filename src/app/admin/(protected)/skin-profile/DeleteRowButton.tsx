"use client";

import { useTransition } from "react";
import styles from "../table.module.css";

export default function DeleteRowButton({
  id,
  label,
  action,
}: {
  id: string;
  label: string;
  action: (id: string) => Promise<void>;
}) {
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${label}"? This can't be undone.`)) return;
    startDeleteTransition(() => {
      action(id);
    });
  }

  return (
    <button type="button" className={styles.deleteBtn} onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  );
}
