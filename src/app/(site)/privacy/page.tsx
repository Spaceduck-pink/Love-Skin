import type { Metadata } from "next";
import styles from "@/styles/legal-page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — LoveSkin",
  description: "What data LoveSkin collects, why, and who it's shared with.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">legal</span>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.updated}>Last updated 5 September 2026.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.content}`}>
          <h2>1. Who we are</h2>
          <p>
            LoveSkin is run by Emma Mahon as an individual, who is the data controller for the
            information described below. Contact:{" "}
            <a href="mailto:emmammahon@googlemail.com">emmammahon@googlemail.com</a>.
          </p>

          <h2>2. What we collect</h2>
          <ul>
            <li>
              <strong>Account details</strong>{" "}
              — if you sign in with Google, we store your name, email address, and profile photo.
            </li>
            <li>
              <strong>Skin quiz answers</strong>{" "}
              — your skin type, concerns, and other quiz answers, saved to your account if
              you&apos;re signed in.
            </li>
            <li>
              <strong>Chat messages</strong>{" "}
              — messages you send the expert chatbot are sent to Google&apos;s Gemini API to
              generate a reply. We don&apos;t store them on our servers; your browser keeps a
              local copy (in its own storage, on your device) so your conversation is there next
              time you visit.
            </li>
            <li>
              <strong>Payment &amp; subscription details</strong>{" "}
              — handled entirely by Stripe. We only ever store your Stripe customer and
              subscription IDs, never your card details.
            </li>
            <li>
              <strong>Newsletter</strong>{" "}— your email address, if you choose to subscribe.
            </li>
            <li>
              <strong>Basic abuse-prevention logs</strong>{" "}
              — your IP address may be briefly recorded against the feature you used (e.g. the
              chatbot), purely to stop abuse of our AI features. These logs are automatically
              deleted within about 24 hours.
            </li>
          </ul>

          <h2>3. Why we use it</h2>
          <p>
            To provide the features you&apos;re using (fulfilling our contract with you), to prevent
            abuse of the site (our legitimate interest), and, for the newsletter, because you&apos;ve
            asked to receive it.
          </p>

          <h2>4. Who we share it with</h2>
          <ul>
            <li>
              <strong>Supabase</strong>{" "}— hosts our database and handles sign-in.
            </li>
            <li>
              <strong>Google</strong>{" "}
              — provides Google Sign-In, and its Gemini API generates chatbot and routine
              responses. Anything you send the chatbot is processed by Google to produce a reply.
            </li>
            <li>
              <strong>Stripe</strong>{" "}— processes all payments and subscriptions.
            </li>
          </ul>
          <p>We don&apos;t sell your data to anyone.</p>

          <h2>5. Where your data is stored</h2>
          <p>
            Our providers (Supabase, Google, and Stripe) may process data outside the UK or EEA. Each
            maintains its own safeguards for doing so, such as Standard Contractual Clauses.
          </p>

          <h2>6. How long we keep it</h2>
          <p>
            Account and quiz data is kept while your account exists — email us to have it deleted.
            Abuse-prevention logs are kept for about 24 hours. Newsletter emails are kept until you
            unsubscribe.
          </p>

          <h2>7. Cookies &amp; local storage</h2>
          <p>
            We only use strictly necessary storage: a session cookie (from Supabase) that keeps you
            signed in, and your browser&apos;s local storage to remember your chat history and
            light/dark theme choice on your own device. We don&apos;t use advertising or analytics
            cookies, so we don&apos;t show a cookie banner.
          </p>

          <h2>8. Your rights</h2>
          <p>
            Under UK GDPR, you can ask us to access, correct, delete, or export your data, or object
            to how we use it. Email{" "}
            <a href="mailto:emmammahon@googlemail.com">emmammahon@googlemail.com</a>{" "}
            to do so. You can also complain to the{" "}
            <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer">
              Information Commissioner&apos;s Office (ICO)
            </a>{" "}
            if you think we&apos;ve mishandled your data.
          </p>

          <h2>9. Children</h2>
          <p>LoveSkin isn&apos;t intended for children under 16.</p>

          <h2>10. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. If we make a material change, we&apos;ll
            update the date at the top of this page.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about your data? Email{" "}
            <a href="mailto:emmammahon@googlemail.com">emmammahon@googlemail.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
