import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
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
    href: "/skin-profile",
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
    body: "Five questions, under a minute — get your routine right away.",
  },
  {
    title: "No account required",
    body: "Take the quiz and get your full routine without signing up. Create an account later if you'd like to save your profile.",
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
            <h1 className={styles.heroTitle}>
              Skincare,
              <br />
              understood for you.
            </h1>
            <p className={styles.heroSubtitle}>
              LoveSkin asks a few smart questions about your skin, then builds a
              personalized morning and evening routine on the spot — no
              account required, no fuss.
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

          <div className={styles.heroVisual}>
            <div className={styles.heroPanel}>
              <Image
                src="/hero-skincare.webp"
                alt="Skincare ingredients and lab glassware arranged on a lilac surface"
                fill
                sizes="(min-width: 640px) 360px, 220px"
                className={styles.heroImage}
                priority
              />
            </div>
            <div className={styles.heroCaption} aria-hidden="true">
              <span>AM / PM</span>
              <span>Routine, generated</span>
            </div>
          </div>
        </div>
      </section>

      <FadeIn id="how-it-works" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className="mono-tag">How it works</span>
            <h2>Three steps to your routine</h2>
          </div>
          <ol className={styles.stepsGrid}>
            {steps.map((step) =>
              step.href ? (
                <li key={step.number} className={styles.stepItem}>
                  <Link href={step.href} className={styles.stepCard}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p>{step.body}</p>
                    <span className={styles.stepLink}>Learn more</span>
                  </Link>
                </li>
              ) : (
                <li key={step.number} className={`${styles.stepItem} ${styles.stepCard}`}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              )
            )}
          </ol>
        </div>
      </FadeIn>

      <FadeIn id="about" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className="mono-tag">Why LoveSkin</span>
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
      </FadeIn>

      <FadeIn className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to meet your skin?</h2>
          <p>It takes less than a minute and you don&apos;t need an account to get started.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </FadeIn>
    </>
  );
}
