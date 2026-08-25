import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import {
  concernContent,
  concernOrder,
  skinTypeContent,
  skinTypeImageAlt,
  skinTypeOrder,
} from "@/lib/skin-profile-content";
import type { SkinType } from "@/lib/types";
import { siteUrl } from "@/lib/site";
import styles from "@/styles/detail-page.module.css";

export function generateStaticParams() {
  return skinTypeOrder.map((slug) => ({ slug }));
}

function getContent(slug: string) {
  return skinTypeOrder.includes(slug as SkinType) ? skinTypeContent[slug as SkinType] : null;
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
    title: `${content.title} Skin — Signs, Causes & Routine Tips — LoveSkin`,
    description: `How to tell if you have ${content.title.toLowerCase()} skin, what causes it, ingredients to look for and avoid, and common routine mistakes.`,
  };
}

export default async function SkinTypePage({
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
        name: `${content.title} skin`,
        item: `${siteUrl}/skin-profile/${content.slug}`,
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
          <span className="mono-tag">Skin type</span>
          <h1 className={styles.heroTitle}>{content.title} skin</h1>
          <p className={styles.heroTagline}>{content.tagline}</p>
          <p className={styles.heroSummary}>{content.summary}</p>
        </div>
        <div className={`container ${styles.heroImageWrap}`}>
          <Image
            src={`/images/skin-types/${content.slug}.jpg`}
            alt={skinTypeImageAlt[content.slug]}
            fill
            sizes="(min-width: 700px) 1180px, 100vw"
            className={styles.heroImg}
            priority
          />
        </div>
      </section>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How to tell</h2>
          <ul className={styles.list}>
            {content.signs.map((sign) => (
              <li key={sign}>{sign}</li>
            ))}
          </ul>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What causes it</h2>
          <p>{content.causes}</p>
        </div>
      </FadeIn>

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Ingredients & formulas</h2>
          <div className={styles.twoCol}>
            <div>
              <span className={styles.colHeading}>Look for</span>
              <ul className={styles.list}>
                {content.lookFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className={styles.colHeading}>Avoid</span>
              <ul className={styles.list}>
                {content.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
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
          <h2 className={styles.sectionTitle}>Skin concerns</h2>
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

      <FadeIn className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to find your routine?</h2>
          <p>Take the quiz and we&apos;ll match your routine to your {content.title.toLowerCase()} skin.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </FadeIn>
    </>
  );
}
