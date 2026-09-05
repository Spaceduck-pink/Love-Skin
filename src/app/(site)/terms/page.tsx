import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/styles/legal-page.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions — LoveSkin",
  description: "The terms that apply to using LoveSkin, the Pro subscription, and the LoveSkin Guide.",
};

export default function TermsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">legal</span>
          <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
          <p className={styles.updated}>Last updated 5 September 2026.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.content}`}>
          <h2>1. Who we are</h2>
          <p>
            LoveSkin is run by Emma Mahon as an individual (&quot;we&quot;, &quot;us&quot;). These
            terms are governed by the law of England and Wales. You can reach us at{" "}
            <a href="mailto:emmammahon@googlemail.com">emmammahon@googlemail.com</a>.
          </p>

          <h2>2. Using LoveSkin</h2>
          <p>
            The skin quiz, routine builder, product guides, and expert chatbot are provided for
            general skincare information only. They aren&apos;t medical advice and aren&apos;t a
            substitute for a consultation with a dermatologist. Always patch-test new products, and
            see a doctor or dermatologist for any medical skin concern.
          </p>

          <h2>3. Accounts</h2>
          <p>
            You can sign in with Google. You&apos;re responsible for keeping your account secure. We
            may suspend or remove accounts that misuse the site.
          </p>

          <h2>4. The expert chatbot</h2>
          <p>
            Chatbot answers are generated automatically by an AI model (Google Gemini) and aren&apos;t
            reviewed by a human before you see them. They can be incomplete or wrong — don&apos;t rely
            on them for medical decisions. To keep the service usable for everyone, Free accounts can
            send 1 chat message a day and Pro accounts up to 10 a day; these limits may change.
          </p>

          <h2>5. LoveSkin Pro subscription</h2>
          <p>
            Pro is a rolling monthly subscription billed automatically through Stripe until you
            cancel. You can cancel any time from the &quot;Manage billing&quot; button on the{" "}
            <Link href="/pricing">Pricing</Link>{" "}
            page — you&apos;ll keep Pro access until the end of the billing period you&apos;ve already
            paid for. See our{" "}
            <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>{" "}
            for details on refunds.
          </p>

          <h2>6. The LoveSkin Guide</h2>
          <p>
            The LoveSkin Guide is a one-off digital purchase delivered as a PDF download immediately
            after payment. See our{" "}
            <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>
            {" "}for details.
          </p>

          <h2>7. Payments</h2>
          <p>
            All payments are processed by Stripe. We never see or store your full card details —
            Stripe&apos;s own <a href="https://stripe.com/legal/consumer">terms</a> and{" "}
            <a href="https://stripe.com/privacy">privacy policy</a>{" "}
            apply to how they handle your payment.
          </p>

          <h2>8. Acceptable use</h2>
          <ul>
            <li>Don&apos;t try to bypass usage limits or rate limits.</li>
            <li>Don&apos;t scrape, resell, or misuse the site or its content.</li>
            <li>Don&apos;t submit illegal, abusive, or harmful content to the chatbot.</li>
          </ul>
          <p>We may suspend access for anyone who breaks these rules.</p>

          <h2>9. Intellectual property</h2>
          <p>
            The LoveSkin site, its design, and the LoveSkin Guide belong to us. Please don&apos;t copy
            or resell them without permission.
          </p>

          <h2>10. Liability</h2>
          <p>
            LoveSkin is provided &quot;as is&quot;. To the extent the law allows, we&apos;re not liable
            for indirect losses arising from your use of the site. Nothing in these terms limits our
            liability for anything the law doesn&apos;t allow us to limit, such as death or personal
            injury caused by negligence, or fraud.
          </p>

          <h2>11. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. If we make a material change, we&apos;ll
            update the date at the top of this page.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:emmammahon@googlemail.com">emmammahon@googlemail.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
