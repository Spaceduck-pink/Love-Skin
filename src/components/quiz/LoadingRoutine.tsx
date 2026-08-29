"use client";

import { useEffect, useState } from "react";
import styles from "./LoadingRoutine.module.css";

const MESSAGES = [
  "Reading your answers...",
  "Matching products to your skin type...",
  "Layering your AM and PM steps...",
  "Putting the finishing touches on your routine...",
];

export default function LoadingRoutine() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((index) => Math.min(index + 1, MESSAGES.length - 1));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className="mono-tag">building your routine</span>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Generating your skincare routine"
      >
        <div className={styles.fill} />
      </div>
      <p className={styles.message}>{MESSAGES[messageIndex]}</p>
    </div>
  );
}
