import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/styles/legal-page.module.css";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — LoveSkin",
  description: "How to cancel LoveSkin Pro, and our refund policy for the Pro subscription and the LoveSkin Guide.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">legal</span>
          <h1 className={styles.heroTitle}>Refund &amp; Cancellation Policy</h1>
          <p className={styles.updated}>Last updated 5 September 2026.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.content}`}>
          <h2>LoveSkin Pro subscription</h2>
          <p>
            Pro is billed monthly in advance through Stripe, and renews automatically until you
            cancel. You can cancel any time from the &quot;Manage billing&quot; button on the{" "}
            <Link href="/pricing">Pricing</Link>{" "}
            page, which opens Stripe&apos;s secure billing portal. Cancelling stops future renewals
            — you&apos;ll keep Pro access until the end of the billing period you&apos;ve already
            paid for.
          </p>
          <p>
            Because Pro gives you immediate access to increased chat limits as soon as you subscribe,
            we&apos;re not able to offer a refund for the current billing period. If something&apos;s
            gone wrong — a billing error, an accidental duplicate subscription, or anything else —
            email <a href="mailto:emmammahon@googlemail.com">emmammahon@googlemail.com</a>{" "}
            and we&apos;ll sort it out.
          </p>

          <h2>The LoveSkin Guide</h2>
          <p>
            The Guide is a one-off £1 purchase, with the PDF available to download immediately after
            payment. Because it&apos;s digital content delivered straight away, we&apos;re not able to
            offer a refund once it&apos;s been downloaded — but if you have a problem with your
            purchase or download, email us and we&apos;ll help.
          </p>

          <h2>Questions</h2>
          <p>
            Get in touch at{" "}
            <a href="mailto:emmammahon@googlemail.com">emmammahon@googlemail.com</a>{" "}
            and we&apos;ll do our best to help.
          </p>
        </div>
      </section>
    </>
  );
}
