import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Admin login — LoveSkin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin login</h1>
        <p className={styles.subtitle}>Sign in to manage subscribers and skincare products.</p>
        <LoginForm />
      </div>
    </section>
  );
}
