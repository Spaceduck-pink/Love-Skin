import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { blogPosts } from "@/lib/blog-content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog — LoveSkin",
  description:
    "Skincare guides on routine building, ingredients, and what to actually expect — grounded in what dermatology guides recommend, not trends.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">blog</span>
          <h1 className={styles.heroTitle}>Skincare, explained clearly</h1>
          <p className={styles.heroSubtitle}>
            Practical guides on building a routine, understanding your skin, and knowing what to
            actually expect — no trends, no ten-step routines you don&apos;t need.
          </p>
        </div>
      </section>

      <FadeIn className={styles.section}>
        <div className="container">
          <ol className={styles.postList}>
            {blogPosts.map((post) => (
              <li key={post.slug} className={styles.postRow}>
                <div className={styles.postMeta}>
                  <span>{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h2 className={styles.postTitle}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className={styles.postBody}>
                  {post.description} <Link href={`/blog/${post.slug}`}>Read more →</Link>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </FadeIn>

      <FadeIn className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to find your routine?</h2>
          <p>Take the quiz and we&apos;ll put what you just read into practice.</p>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>
        </div>
      </FadeIn>
    </>
  );
}
