"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import type { RoutineResult } from "@/lib/types";
import styles from "./ResultsView.module.css";

interface ResultsViewProps {
  routine: RoutineResult;
  onRetake: () => void;
  savedToProfile: boolean;
}

export default function ResultsView({ routine, onRetake, savedToProfile }: ResultsViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className={styles.wrapper}>
      <span className="mono-tag">your results</span>
      <h1 ref={headingRef} tabIndex={-1} className={styles.headline}>
        {routine.headline}
      </h1>
      <p className={styles.summary}>{routine.summary}</p>

      <ul className={styles.tags} aria-label="Skin profile tags">
        {routine.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>

      <div className={styles.routineGrid}>
        <section className={styles.routineCard} aria-labelledby="am-heading">
          <h2 id="am-heading" className={styles.routineHeading}>
            <span className={styles.routineIcon} data-variant="am" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </span>
            Morning
          </h2>
          <ol className={styles.stepList}>
            {routine.am.map((step, index) => (
              <li key={`am-${index}`} className={styles.step}>
                <span className={styles.stepIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepDescription}>{step.description}</p>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.routineCard} aria-labelledby="pm-heading">
          <h2 id="pm-heading" className={styles.routineHeading}>
            <span className={styles.routineIcon} data-variant="pm" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
              </svg>
            </span>
            Evening
          </h2>
          <ol className={styles.stepList}>
            {routine.pm.map((step, index) => (
              <li key={`pm-${index}`} className={styles.step}>
                <span className={styles.stepIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepDescription}>{step.description}</p>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className={styles.tipsCard} aria-labelledby="tips-heading">
        <h2 id="tips-heading" className={styles.tipsHeading}>
          A few extra notes
        </h2>
        <ul className={styles.tipsList}>
          {routine.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </section>

      {savedToProfile && (
        <p className={styles.savedNotice} role="status">
          ✓ Added to your profile
        </p>
      )}

      <div className={styles.actions}>
        {savedToProfile && (
          <Link href="/my-routine" className="btn btn-primary">
            Go to my routine
          </Link>
        )}
        <button type="button" className="btn btn-ghost" onClick={onRetake}>
          Retake the quiz
        </button>
      </div>
    </div>
  );
}
