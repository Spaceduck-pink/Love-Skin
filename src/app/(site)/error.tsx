"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/state-page.module.css";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <span className="mono-tag">Something went wrong</span>
        <h1 className={styles.title}>That didn&apos;t load right</h1>
        <p className={styles.message}>
          An unexpected error interrupted this page. You can try again, or head back home.
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
