import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { createClient } from "@/lib/supabase-server";
import { signInWithGoogle } from "@/lib/auth-actions";
import { PRO_PRICE_GBP_PENCE, PRO_PRICE_INTERVAL } from "@/lib/pro-product";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Pricing — LoveSkin",
  description:
    "Compare LoveSkin's Free and Pro plans — Pro unlocks more daily questions to the skincare expert chatbot.",
};

async function getCurrentPlan(): Promise<"free" | "pro" | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  return profile?.plan === "pro" ? "pro" : "free";
}

export default async function PricingPage() {
  const currentPlan = await getCurrentPlan();
  const signIn = signInWithGoogle.bind(null, "/pricing");
  const proPrice = (PRO_PRICE_GBP_PENCE / 100).toFixed(2);

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="mono-tag">pricing</span>
          <h1 className={styles.heroTitle}>Simple pricing, more expert answers</h1>
          <p className={styles.heroSubtitle}>
            Everyone gets the full skin quiz and routine builder. Pro unlocks more daily questions
            to the skincare expert chatbot.
          </p>
        </div>
      </section>

      <FadeIn className={styles.section}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.card}>
            <span className="mono-tag">Free</span>
            <p className={styles.price}>
              £0<span className={styles.pricePeriod}> / forever</span>
            </p>
            <ul className={styles.features}>
              <li>1 expert chat message a day</li>
              <li>Full skin quiz &amp; personalised routine</li>
              <li>Browse all product guides</li>
            </ul>
            {currentPlan === "free" && <p className={styles.currentPlan}>Your current plan</p>}
          </div>

          <div className={`${styles.card} ${styles.cardPro}`}>
            <span className="mono-tag">Pro</span>
            <p className={styles.price}>
              £{proPrice}
              <span className={styles.pricePeriod}> / {PRO_PRICE_INTERVAL}</span>
            </p>
            <ul className={styles.features}>
              <li>10 expert chat messages a day</li>
              <li>Everything in Free</li>
            </ul>
            {currentPlan === "pro" ? (
              <>
                <p className={styles.currentPlan}>Your current plan</p>
                <form action="/api/billing-portal" method="POST">
                  <button type="submit" className="btn btn-ghost">
                    Manage billing
                  </button>
                </form>
              </>
            ) : currentPlan === "free" ? (
              <>
                <form action="/api/checkout/pro" method="POST">
                  <button type="submit" className="btn btn-primary">
                    Become Pro
                  </button>
                </form>
                <p className={styles.legalNote}>
                  By subscribing, you agree to our <Link href="/terms">Terms</Link>{" "}
                  and{" "}
                  <Link href="/refund-policy">Refund Policy</Link>.
                </p>
              </>
            ) : (
              <form action={signIn}>
                <button type="submit" className="btn btn-primary">
                  Sign in to get started
                </button>
              </form>
            )}
          </div>
        </div>
      </FadeIn>
    </>
  );
}
