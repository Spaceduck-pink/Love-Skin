import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import { supabase } from "@/lib/supabase";
import {
  concernDrivenProducts,
  productContent,
  productImageAlt,
  skinTypeDrivenProducts,
} from "@/lib/product-content";
import { concernContent, concernOrder, skinTypeContent, skinTypeOrder } from "@/lib/skin-profile-content";
import { siteUrl } from "@/lib/site";
import styles from "@/styles/detail-page.module.css";

interface ProductRow {
  step: number;
  slug: string;
  title: string;
  description: string;
}

async function getProduct(slug: string): Promise<ProductRow | null> {
  const { data, error } = await supabase
    .from("skincare_products")
    .select("step, slug, title, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load product:", error.message);
    return null;
  }

  return data;
}

async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("skincare_products").select("slug");
  if (error) {
    console.error("Failed to load product slugs:", error.message);
    return [];
  }
  return data.map((row) => row.slug);
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.title} — How & When to Use Them — LoveSkin`,
    description: `What ${product.title.toLowerCase()} do, how and when to use them in your routine, and the mistakes to avoid.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const extra = productContent[product.slug];
  const isSkinTypeDriven = skinTypeDrivenProducts.includes(product.slug);
  const isConcernDriven = concernDrivenProducts.includes(product.slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Products", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 2, name: product.title, item: `${siteUrl}/products/${product.slug}` },
    ],
  };

  const faqJsonLd = extra
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: extra.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <nav className={`container ${styles.breadcrumb}`} aria-label="Breadcrumb">
        <Link href="/products">Products</Link>
        <span aria-hidden="true">/</span>
        <span>{product.title}</span>
      </nav>

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">Step {String(product.step).padStart(2, "0")}</span>
          <h1 className={styles.heroTitle}>{product.title}</h1>
          <p className={styles.heroTagline}>{product.description}</p>
        </div>
        <div className={`container ${styles.heroImageWrap}`}>
          <Image
            src={`/images/products/${product.slug}.jpg`}
            alt={productImageAlt[product.slug] ?? product.title}
            fill
            sizes="(min-width: 700px) 1180px, 100vw"
            className={styles.heroImg}
            priority
          />
        </div>
      </section>

      {extra && (
        <>
          <FadeIn className={styles.section}>
            <div className="container">
              <h2 className={styles.sectionTitle}>How &amp; when to use it</h2>
              <p>{extra.howToUse}</p>
            </div>
          </FadeIn>

          <FadeIn className={styles.section}>
            <div className="container">
              <h2 className={styles.sectionTitle}>By skin type</h2>
              <p>{extra.skinTypeNotes}</p>
            </div>
          </FadeIn>

          {isSkinTypeDriven && (
            <FadeIn className={styles.section}>
              <div className="container">
                <h2 className={styles.sectionTitle}>Find your formula by skin type</h2>
                <div className={styles.relatedGrid}>
                  {skinTypeOrder.map((typeSlug) => (
                    <Link
                      key={typeSlug}
                      href={`/skin-profile/${typeSlug}`}
                      className={styles.relatedPill}
                    >
                      {skinTypeContent[typeSlug].title}
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {isConcernDriven && (
            <FadeIn className={styles.section}>
              <div className="container">
                <h2 className={styles.sectionTitle}>Choose based on your main concern</h2>
                <div className={styles.relatedGrid}>
                  {concernOrder.map((concernSlug) => (
                    <Link
                      key={concernSlug}
                      href={`/skin-profile/concerns/${concernSlug}`}
                      className={styles.relatedPill}
                    >
                      {concernContent[concernSlug].title}
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          <FadeIn className={styles.section}>
            <div className="container">
              <h2 className={styles.sectionTitle}>Common mistakes</h2>
              <ul className={`${styles.list} ${styles.mistakeList}`}>
                {extra.mistakes.map((mistake) => (
                  <li key={mistake}>{mistake}</li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn className={styles.section}>
            <div className="container">
              <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
              <div className={styles.faqList}>
                {extra.faqs.map((faq) => (
                  <div key={faq.q} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.q}</h3>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </>
      )}

      <FadeIn className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to find your routine?</h2>
          <p>Take the quiz and we&apos;ll tell you if {product.title.toLowerCase()} belong in yours.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </FadeIn>
    </>
  );
}
