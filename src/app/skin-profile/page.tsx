import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { concernContent, concernOrder, skinTypeContent, skinTypeOrder } from "@/lib/skin-profile-content";
import styles from "./page.module.css";
import detailStyles from "@/styles/detail-page.module.css";

export const metadata: Metadata = {
  title: "Skin Profile — LoveSkin",
  description:
    "How LoveSkin maps your quiz answers into a skin type and concern profile that shapes your personalized AM/PM routine.",
};

const skinTypes = skinTypeOrder.map((slug) => ({
  label: "Skin type",
  title: skinTypeContent[slug].title,
  body: skinTypeContent[slug].tagline,
  href: `/skin-profile/${slug}`,
}));

const concerns = concernOrder.map((slug) => ({
  label: "Concern",
  title: concernContent[slug].title,
  body: concernContent[slug].tagline,
  href: `/skin-profile/concerns/${slug}`,
}));

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
        <div className={`container ${detailStyles.heroImageWrap}`}>
          <Image
            src="/images/skin-profile-hero.jpg"
            alt="Skincare cream styled with laboratory glassware on a pink background."
            fill
            sizes="(min-width: 700px) 1180px, 100vw"
            className={detailStyles.heroImg}
            priority
          />
        </div>
      </section>

      <FadeIn className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <h2>Skin types</h2>
            <p>The five skin types LoveSkin recognizes, and how each shapes your routine.</p>
          </div>
          <ol className={styles.profileList}>
            {skinTypes.map((item) => (
              <li key={item.title} className={styles.profileRow}>
                <div className={styles.profileHead}>
                  <span className={styles.profileLabel}>{item.label}</span>
                  <h3 className={styles.profileTitle}>
                    <Link href={item.href}>{item.title}</Link>
                  </h3>
                </div>
                <p className={styles.profileBody}>
                  {item.body} <Link href={item.href}>Learn more →</Link>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <h2>Skin concerns</h2>
            <p>The main concern you pick steers which treatment steps get added to your routine.</p>
          </div>
          <ol className={styles.profileList}>
            {concerns.map((item) => (
              <li key={item.title} className={styles.profileRow}>
                <div className={styles.profileHead}>
                  <span className={styles.profileLabel}>{item.label}</span>
                  <h3 className={styles.profileTitle}>
                    <Link href={item.href}>{item.title}</Link>
                  </h3>
                </div>
                <p className={styles.profileBody}>
                  {item.body} <Link href={item.href}>Learn more →</Link>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </FadeIn>

      <FadeIn className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to find your profile?</h2>
          <p>Take the quiz and we&apos;ll match your skin type and concern for you.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </FadeIn>
    </>
  );
}
