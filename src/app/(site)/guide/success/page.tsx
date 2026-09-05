import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { GUIDE_PRODUCT_ID } from "@/lib/guide-product";
import styles from "@/styles/state-page.module.css";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function GuideSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  let paid = false;
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid =
        session.payment_status === "paid" &&
        session.metadata?.product === GUIDE_PRODUCT_ID;
    } catch {
      paid = false;
    }
  }

  if (!paid) {
    return (
      <div className={styles.wrap}>
        <div className={`container ${styles.inner}`}>
          <span className="mono-tag">Payment not confirmed</span>
          <h1 className={styles.title}>We couldn&apos;t confirm that payment</h1>
          <p className={styles.message}>
            If you were charged, please contact us with your payment
            confirmation and we&apos;ll sort out your download.
          </p>
          <div className={styles.actions}>
            <Link href="/#guide" className="btn btn-primary">
              Back to the guide
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <span className="mono-tag">Payment confirmed</span>
        <h1 className={styles.title}>Thank you! Your guide is ready</h1>
        <p className={styles.message}>
          Click below to download your PDF. You can come back to this page to
          download it again if you need to.
        </p>
        <div className={styles.actions}>
          <a
            href={`/api/download?session_id=${encodeURIComponent(sessionId!)}`}
            className="btn btn-primary"
          >
            Download the PDF
          </a>
          <Link href="/" className="btn btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
