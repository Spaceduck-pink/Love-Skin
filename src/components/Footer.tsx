import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.brand}>
          <svg
            className={styles.brandMark}
            viewBox="0 0 24 24"
            fill="#CD98D8"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 21s-7.5-4.6-10-9.3C.4 8.1 2.2 4 6.1 4c2.1 0 3.6 1.1 4.4 2.4l1.5 2.3 1.5-2.3C14.3 5.1 15.8 4 17.9 4c3.9 0 5.7 4.1 4.1 7.7C19.5 16.4 12 21 12 21Z" />
          </svg>
          Love<span className={styles.brandAccent}>Skin</span>
        </p>
        <p className={styles.disclaimer}>
          Routines are generated from your answers for general guidance only and
          aren&apos;t a substitute for advice from a dermatologist.
        </p>
        <nav aria-label="Footer" className={styles.links}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/quiz" className={styles.link}>
            Take the Quiz
          </Link>
        </nav>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} LoveSkin. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
