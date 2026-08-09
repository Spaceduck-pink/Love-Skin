import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Products — LoveSkin",
  description:
    "A guide to the different skincare product types LoveSkin routines are built from — cleansers, toners, serums, moisturizers, and more.",
};

const productTypes = [
  {
    step: "01",
    title: "Cleansers",
    body: "Wash away dirt, oil, and sunscreen without stripping your skin. The first step in every routine, morning and night.",
  },
  {
    step: "02",
    title: "Oil cleansers",
    body: "A first-cleanse step that melts away sunscreen and makeup before your regular cleanser goes to work.",
  },
  {
    step: "03",
    title: "Toners",
    body: "A light, alcohol-free liquid that removes residue and preps skin to absorb the treatments that follow.",
  },
  {
    step: "04",
    title: "Serums & treatments",
    body: "Concentrated formulas — vitamin C, retinol, niacinamide, and more — targeted at specific concerns like acne, dullness, or aging.",
  },
  {
    step: "05",
    title: "Eye creams",
    body: "Lightweight, targeted hydration for the delicate skin around the eyes.",
  },
  {
    step: "06",
    title: "Moisturizers",
    body: "Lock in hydration and support your skin barrier. Formulated lighter for oily skin, richer for dry skin.",
  },
  {
    step: "07",
    title: "Facial oils",
    body: "An optional finishing layer that seals in moisturizer and softens skin overnight.",
  },
  {
    step: "08",
    title: "SPF",
    body: "Broad-spectrum sun protection — the single most impactful step for keeping your skin healthy long-term.",
  },
];

export default function ProductsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">products</span>
          <h1 className={styles.heroTitle}>The building blocks of your routine</h1>
          <p className={styles.heroSubtitle}>
            LoveSkin doesn&apos;t sell products — instead, we match your skin to the right
            categories of skincare and explain what each one does. Here&apos;s a quick guide to
            what goes into an AM/PM routine.
          </p>
        </div>
      </section>

      <FadeIn className={styles.section}>
        <div className="container">
          <ol className={styles.productList}>
            {productTypes.map((product) => (
              <li key={product.step} className={styles.productRow}>
                <div className={styles.productHead}>
                  <span className={styles.productStep}>{product.step}</span>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                </div>
                <p className={styles.productBody}>{product.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </FadeIn>

      <FadeIn className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to find your routine?</h2>
          <p>Take the quiz and we&apos;ll match these product types to your skin.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </FadeIn>
    </>
  );
}
