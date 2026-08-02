import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Skin Profile — LoveSkin",
  description:
    "How LoveSkin maps your quiz answers into a skin type and concern profile that shapes your personalized AM/PM routine.",
};

const skinTypes = [
  {
    label: "Skin type",
    title: "Oily",
    body: "Shiny most of the day and prone to enlarged pores. Routines lean on lightweight, oil-free formulas that won't clog pores.",
  },
  {
    label: "Skin type",
    title: "Dry",
    body: "Feels tight, flaky, or rough. Routines focus on rich, barrier-supporting hydration to ease tightness.",
  },
  {
    label: "Skin type",
    title: "Combination",
    body: "An oily T-zone with drier cheeks. Routines balance oil control with hydration across different areas.",
  },
  {
    label: "Skin type",
    title: "Normal",
    body: "Fairly balanced and rarely irritated. Routines keep things simple and consistent.",
  },
  {
    label: "Skin type",
    title: "Sensitive",
    body: "Reacts easily, with redness or stinging. Routines prioritize fragrance-free, barrier-supporting products.",
  },
];

const concerns = [
  {
    label: "Concern",
    title: "Acne & breakouts",
    body: "Treatments focus on regulating oil and clearing pores, without over-drying the skin.",
  },
  {
    label: "Concern",
    title: "Dullness & uneven texture",
    body: "Treatments brighten tone and gently resurface skin to smooth texture over time.",
  },
  {
    label: "Concern",
    title: "Fine lines & aging",
    body: "Treatments support cell turnover and firmness, paired with antioxidant protection.",
  },
  {
    label: "Concern",
    title: "Dark spots & hyperpigmentation",
    body: "Treatments target existing spots and help prevent new ones from environmental exposure.",
  },
  {
    label: "Concern",
    title: "Redness & sensitivity",
    body: "Treatments soothe and strengthen skin's resilience without harsh irritation.",
  },
];

export default function SkinProfilePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">skin profile</span>
          <h1 className={styles.heroTitle}>We map your skin profile</h1>
          <p className={styles.heroSubtitle}>
            Your quiz answers run through a rules-based engine that matches your skin type with
            your main concern. Together, they form your skin profile — the foundation your
            AM/PM routine is built from.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <h2>Skin types</h2>
            <p>The five skin types LoveSkin recognizes, and how each shapes your routine.</p>
          </div>
          <ol className={styles.profileGrid}>
            {skinTypes.map((item) => (
              <li key={item.title} className={styles.profileCard}>
                <span className={styles.profileLabel}>{item.label}</span>
                <h3 className={styles.profileTitle}>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <h2>Skin concerns</h2>
            <p>The main concern you pick steers which treatment steps get added to your routine.</p>
          </div>
          <ol className={styles.profileGrid}>
            {concerns.map((item) => (
              <li key={item.title} className={styles.profileCard}>
                <span className={styles.profileLabel}>{item.label}</span>
                <h3 className={styles.profileTitle}>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to find your profile?</h2>
          <p>Take the quiz and we&apos;ll match your skin type and concern for you.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </section>
    </>
  );
}
