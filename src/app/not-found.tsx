import Link from "next/link";
import styles from "@/styles/state-page.module.css";

export default function RootNotFound() {
  return (
    <div className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.wordmark}>
          Love<span className={styles.wordmarkAccent}>Skin</span>
        </Link>
        <span className="mono-tag">404</span>
        <h1 className={styles.title}>We couldn&apos;t find that page</h1>
        <p className={styles.message}>
          The page you&apos;re looking for may have moved or no longer exists.
        </p>
        <Link href="/" className="btn btn-primary">
          Back home
        </Link>
      </div>
    </div>
  );
}
