import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { createClient } from "@/lib/supabase-server";
import { signInWithGoogle } from "@/lib/auth-actions";
import { setPlan } from "@/lib/plan-actions";
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
  const becomePro = setPlan.bind(null, "pro");
  const becomeFree = setPlan.bind(null, "free");

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
            {currentPlan === "pro" ? (
              <form action={becomeFree}>
                <button type="submit" className="btn btn-ghost">
                  Switch back to Free
                </button>
              </form>
            ) : currentPlan === "free" ? (
              <p className={styles.currentPlan}>Your current plan</p>
            ) : null}
          </div>

          <div className={`${styles.card} ${styles.cardPro}`}>
            <span className="mono-tag">Pro</span>
            <p className={styles.price}>
              £4.99<span className={styles.pricePeriod}> / month</span>
            </p>
            <p className={styles.priceNote}>Illustrative price — billing coming soon.</p>
            <ul className={styles.features}>
              <li>10 expert chat messages a day</li>
              <li>Everything in Free</li>
            </ul>
            {currentPlan === "pro" ? (
              <p className={styles.currentPlan}>Your current plan</p>
            ) : currentPlan === "free" ? (
              <form action={becomePro}>
                <button type="submit" className="btn btn-primary">
                  Become Pro
                </button>
              </form>
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
