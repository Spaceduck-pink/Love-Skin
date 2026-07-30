import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.brand}>
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
