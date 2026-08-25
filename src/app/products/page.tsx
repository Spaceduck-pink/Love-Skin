import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";
import detailStyles from "@/styles/detail-page.module.css";

export const metadata: Metadata = {
  title: "Products — LoveSkin",
  description:
    "A guide to the different skincare product types LoveSkin routines are built from — cleansers, toners, serums, moisturizers, and more.",
};

async function getProductTypes() {
  const { data, error } = await supabase
    .from("skincare_products")
    .select("step, slug, title, description")
    .order("step");

  if (error) {
    console.error("Failed to load skincare products:", error.message);
    return [];
  }

  return data;
}

export default async function ProductsPage() {
  const productTypes = await getProductTypes();

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
        <div className={`container ${detailStyles.heroImageWrap}`}>
          <Image
            src="/images/products-hero.jpg"
            alt="A skincare bottle styled with scientific glassware against a pink background."
            fill
            sizes="(min-width: 700px) 1180px, 100vw"
            className={detailStyles.heroImg}
            priority
          />
        </div>
      </section>

      <FadeIn className={styles.section}>
        <div className="container">
          <ol className={styles.productList}>
            {productTypes.map((product) => (
              <li key={product.slug} id={product.slug} className={styles.productRow}>
                <div className={styles.productHead}>
                  <span className={styles.productStep}>{String(product.step).padStart(2, "0")}</span>
                  <h3 className={styles.productTitle}>
                    <Link href={`/products/${product.slug}`}>{product.title}</Link>
                  </h3>
                </div>
                <p className={styles.productBody}>
                  {product.description}{" "}
                  <Link href={`/products/${product.slug}`}>Learn more →</Link>
                </p>
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
