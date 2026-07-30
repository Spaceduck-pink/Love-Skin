"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";
import type { QuizOption, QuizQuestion } from "@/lib/types";
import styles from "./QuestionStep.module.css";

interface QuestionStepProps {
  question: QuizQuestion;
  selectedValue?: string;
  onSelect: (value: string) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}

export default function QuestionStep({
  question,
  selectedValue,
  onSelect,
  headingRef,
}: QuestionStepProps) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const { key } = event;
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(key)) return;

    event.preventDefault();
    const direction = key === "ArrowDown" || key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (index + direction + question.options.length) % question.options.length;

    const nextOption = question.options[nextIndex];
    onSelect(nextOption.value);
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        id={`question-${question.id}`}
        className={styles.question}
      >
        {question.question}
      </h2>
      {question.helper ? <p className={styles.helper}>{question.helper}</p> : null}

      <div
        role="radiogroup"
        aria-labelledby={`question-${question.id}`}
        className={styles.options}
      >
        {question.options.map((option: QuizOption, index: number) => {
          const isSelected = option.value === selectedValue;
          return (
            <button
              key={option.value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (!selectedValue && index === 0) ? 0 : -1}
              className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
              onClick={() => onSelect(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span className={styles.radioDot} aria-hidden="true" />
              <span className={styles.optionText}>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.hint ? (
                  <span className={styles.optionHint}>{option.hint}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
