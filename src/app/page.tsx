import Link from "next/link";
import styles from "./page.module.css";

const steps = [
  {
    number: "01",
    title: "Answer 5 quick questions",
    body: "Tell us about your skin type, main concern, and how your skin behaves day to day.",
    href: "/quiz",
  },
  {
    number: "02",
    title: "We map your skin profile",
    body: "Your answers run through a rules-based engine that matches patterns dermatology guides use.",
  },
  {
    number: "03",
    title: "Get your AM/PM routine",
    body: "A clear, step-by-step morning and evening routine — ready to follow immediately.",
  },
];

const features = [
  {
    title: "Fast",
    body: "Five questions, under a minute. No lengthy forms or account setup required.",
  },
  {
    title: "Private by default",
    body: "Nothing is saved to a server or database — your answers live only in your browser tab.",
  },
  {
    title: "Actually personalized",
    body: "Routines change based on skin type, concern, sensitivity, and how much you want to do.",
  },
  {
    title: "Built to revisit",
    body: "Skin changes with seasons and life — retake the quiz any time for a fresh routine.",
  },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className="mono-tag">no sign-up · no database · just your routine</span>
            <h1 className={styles.heroTitle}>
              Your skin routine,
              <br />
              <span className={styles.heroTitleAccent}>generated in 60 seconds.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              LoveSkin asks a few smart questions about your skin, then builds a
              personalized morning and evening routine on the spot — no
              account, no data collection, no fuss.
            </p>
            <div className={styles.heroActions}>
              <Link href="/quiz" className="btn btn-primary">
                Start the Quiz
              </Link>
              <a href="#how-it-works" className="btn btn-ghost">
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className="mono-tag">how it works</span>
            <h2>Three steps to your routine</h2>
          </div>
          <ol className={styles.stepsGrid}>
            {steps.map((step) =>
              step.href ? (
                <li key={step.number}>
                  <Link href={step.href} className={styles.stepCard}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p>{step.body}</p>
                  </Link>
                </li>
              ) : (
                <li key={step.number} className={styles.stepCard}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              )
            )}
          </ol>
        </div>
      </section>

      <section id="about" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className="mono-tag">why loveskin</span>
            <h2>Built simple, on purpose</h2>
          </div>
          <ul className={styles.featureGrid}>
            {features.map((feature) => (
              <li key={feature.title} className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p>{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to meet your skin?</h2>
          <p>It takes less than a minute and there&apos;s nothing to sign up for.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </section>
    </>
  );
}
