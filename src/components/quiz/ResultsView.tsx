"use client";

import { useRef, useEffect } from "react";
import type { RoutineResult } from "@/lib/types";
import styles from "./ResultsView.module.css";

interface ResultsViewProps {
  routine: RoutineResult;
  onRetake: () => void;
}

export default function ResultsView({ routine, onRetake }: ResultsViewProps) {
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
              ☀
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
              ☾
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

      <div className={styles.actions}>
        <button type="button" className="btn btn-ghost" onClick={onRetake}>
          Retake the quiz
        </button>
      </div>
    </div>
  );
}
