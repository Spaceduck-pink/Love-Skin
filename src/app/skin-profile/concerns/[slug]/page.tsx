import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import {
  concernContent,
  concernImageAlt,
  concernOrder,
  skinTypeContent,
  skinTypeOrder,
} from "@/lib/skin-profile-content";
import { concernDrivenProducts, productTitles } from "@/lib/product-content";
import type { Concern } from "@/lib/types";
import { siteUrl } from "@/lib/site";
import styles from "@/styles/detail-page.module.css";

export function generateStaticParams() {
  return concernOrder.map((slug) => ({ slug }));
}

function getContent(slug: string) {
  return concernOrder.includes(slug as Concern) ? concernContent[slug as Concern] : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getContent(slug);
  if (!content) return {};

  return {
    title: `${content.title} — Causes, Treatments & Routine Tips — LoveSkin`,
    description: `What causes ${content.title.toLowerCase()}, which ingredients actually help, and the routine mistakes that slow progress down.`,
  };
}

export default async function ConcernPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getContent(slug);
  if (!content) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Skin profile", item: `${siteUrl}/skin-profile` },
      {
        "@type": "ListItem",
        position: 2,
        name: content.title,
        item: `${siteUrl}/skin-profile/concerns/${content.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className={`container ${styles.breadcrumb}`} aria-label="Breadcrumb">
        <Link href="/skin-profile">Skin profile</Link>
        <span aria-hidden="true">/</span>
        <span>{content.title}</span>
      </nav>

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">Concern</span>
          <h1 className={styles.heroTitle}>{content.title}</h1>
          <p className={styles.heroTagline}>{content.tagline}</p>
        </div>
        <div className={`container ${styles.heroImageWrap}`}>
          <Image
            src={`/images/concerns/${content.slug}.jpg`}
            alt={concernImageAlt[content.slug]}
            fill
            sizes="(min-width: 700px) 1180px, 100vw"
            className={styles.heroImg}
            priority
          />
        </div>
      </section>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What causes it</h2>
          <p>{content.causes}</p>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What helps</h2>
          <div className={styles.treatmentGrid}>
            {content.whatHelps.map((item) => (
              <div key={item.title} className={styles.treatmentCard}>
                <h3 className={styles.treatmentTitle}>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Common mistakes</h2>
          <ul className={`${styles.list} ${styles.mistakeList}`}>
            {content.mistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <div className={styles.tipBox}>
            <span className={styles.tipLabel}>Tip</span>
            <p>{content.tip}</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {content.faqs.map((faq) => (
              <div key={faq.q} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Products for {content.title.toLowerCase()}</h2>
          <div className={styles.relatedGrid}>
            {concernDrivenProducts.map((productSlug) => (
              <Link key={productSlug} href={`/products/${productSlug}`} className={styles.relatedPill}>
                {productTitles[productSlug]}
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Skin types</h2>
          <div className={styles.relatedGrid}>
            {skinTypeOrder.map((typeSlug) => (
              <Link key={typeSlug} href={`/skin-profile/${typeSlug}`} className={styles.relatedPill}>
                {skinTypeContent[typeSlug].title}
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to find your routine?</h2>
          <p>Take the quiz and we&apos;ll target your routine at {content.title.toLowerCase()}.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </FadeIn>
    </>
  );
}
