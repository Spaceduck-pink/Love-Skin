import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import ShareButtons from "@/components/ShareButtons";
import { blogPosts, getBlogPost } from "@/lib/blog-content";
import { jsonLdScript } from "@/lib/json-ld";
import { getConcerns, getSkinTypes } from "@/lib/skin-profile-data";
import { siteUrl } from "@/lib/site";
import styles from "@/styles/detail-page.module.css";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — LoveSkin`,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const [skinTypes, concerns] = await Promise.all([getSkinTypes(), getConcerns()]);
  const skinTypeTitleBySlug = new Map(skinTypes.map((type) => [type.slug, type.title]));
  const concernTitleBySlug = new Map(concerns.map((concern) => [concern.slug, concern.title]));

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: "LoveSkin" },
    publisher: { "@type": "Organization", name: "LoveSkin" },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }} />

      <nav className={`container ${styles.breadcrumb}`} aria-label="Breadcrumb">
        <Link href="/blog">Blog</Link>
        <span aria-hidden="true">/</span>
        <span>{post.title}</span>
      </nav>

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">{post.category}</span>
          <h1 className={styles.heroTitle}>{post.title}</h1>
          <p className={styles.heroTagline}>{post.tagline}</p>
          <time dateTime={post.publishedAt} className={styles.heroDate}>
            {publishedDate}
          </time>
        </div>
      </section>

      <div className={`container ${styles.shareBar}`}>
        <ShareButtons url={`${siteUrl}/blog/${post.slug}`} title={post.title} text={post.description} />
      </div>

      <FadeIn className={styles.section}>
        <div className="container">
          <p>{post.intro}</p>
        </div>
      </FadeIn>

      {post.sections.map((section) => (
        <FadeIn key={section.heading} className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>{section.heading}</h2>
            <p>{section.body}</p>
            {section.list && (
              <ul className={`${styles.list} ${styles.inlineList}`}>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </FadeIn>
      ))}

      <FadeIn className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {post.faqs.map((faq) => (
              <div key={faq.q} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {post.relatedProducts && post.relatedProducts.length > 0 && (
        <FadeIn className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Related products</h2>
            <div className={styles.relatedGrid}>
              {post.relatedProducts.map((product) => (
                <Link key={product.slug} href={`/products/${product.slug}`} className={styles.relatedPill}>
                  {product.label}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {post.relatedSkinTypes && post.relatedSkinTypes.length > 0 && (
        <FadeIn className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>By skin type</h2>
            <div className={styles.relatedGrid}>
              {post.relatedSkinTypes.map((typeSlug) => (
                <Link key={typeSlug} href={`/skin-profile/${typeSlug}`} className={styles.relatedPill}>
                  {skinTypeTitleBySlug.get(typeSlug) ?? typeSlug}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {post.relatedConcerns && post.relatedConcerns.length > 0 && (
        <FadeIn className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>By concern</h2>
            <div className={styles.relatedGrid}>
              {post.relatedConcerns.map((concernSlug) => (
                <Link
                  key={concernSlug}
                  href={`/skin-profile/concerns/${concernSlug}`}
                  className={styles.relatedPill}
                >
                  {concernTitleBySlug.get(concernSlug) ?? concernSlug}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {otherPosts.length > 0 && (
        <FadeIn className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>More from the blog</h2>
            <div className={styles.relatedGrid}>
              {otherPosts.map((other) => (
                <Link key={other.slug} href={`/blog/${other.slug}`} className={styles.relatedPill}>
                  {other.title}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      <FadeIn className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to find your routine?</h2>
          <p>Take the quiz and we&apos;ll turn this into a routine built for your skin.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </FadeIn>
    </>
  );
}
