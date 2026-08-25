import Link from "next/link";
import styles from "@/styles/state-page.module.css";

export default function SiteNotFound() {
  return (
    <div className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <span className="mono-tag">404</span>
        <h1 className={styles.title}>We couldn&apos;t find that page</h1>
        <p className={styles.message}>
          The page you&apos;re looking for may have moved or no longer exists.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/quiz" className="btn btn-ghost">
            Take the quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
