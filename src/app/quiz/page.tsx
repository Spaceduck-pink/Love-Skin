"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { quizQuestions } from "@/lib/quiz-data";
import { generateRoutine } from "@/lib/generate-routine";
import { saveSkinProfile } from "@/lib/actions";
import type { QuestionId, QuizAnswers } from "@/lib/types";
import ProgressBar from "@/components/quiz/ProgressBar";
import QuestionStep from "@/components/quiz/QuestionStep";
import ResultsView from "@/components/quiz/ResultsView";
import styles from "./quiz.module.css";

type PartialAnswers = Partial<Record<QuestionId, string>>;

const TOTAL_STEPS = quizQuestions.length;

function isCompleteAnswers(answers: PartialAnswers): answers is Record<QuestionId, string> {
  return quizQuestions.every((question) => Boolean(answers[question.id]));
}

export default function QuizPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const currentQuestion = quizQuestions[stepIndex];
  const isLastStep = stepIndex === TOTAL_STEPS - 1;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  useEffect(() => {
    if (!showResults) {
      headingRef.current?.focus();
    }
  }, [stepIndex, showResults]);

  const routine = useMemo(() => {
    if (!showResults || !isCompleteAnswers(answers)) return null;
    return generateRoutine(answers as unknown as QuizAnswers);
  }, [showResults, answers]);

  useEffect(() => {
    if (!routine || !isCompleteAnswers(answers)) return;
    saveSkinProfile(answers as unknown as QuizAnswers, routine).catch((error) => {
      console.error("Failed to save skin profile:", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    if (isLastStep) {
      setShowResults(true);
    } else {
      setStepIndex((index) => index + 1);
    }
  };

  const handleBack = () => {
    setStepIndex((index) => Math.max(0, index - 1));
  };

  const handleRetake = () => {
    setAnswers({});
    setStepIndex(0);
    setShowResults(false);
  };

  if (showResults && routine) {
    return (
      <div className="container">
        <ResultsView routine={routine} onRetake={handleRetake} />
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card} key={stepIndex}>
        <ProgressBar current={stepIndex + 1} total={TOTAL_STEPS} />

        <QuestionStep
          question={currentQuestion}
          selectedValue={currentAnswer}
          onSelect={handleSelect}
          headingRef={headingRef}
        />

        <div className={styles.nav}>
          {stepIndex === 0 ? (
            <Link href="/" className={`btn btn-ghost ${styles.backBtn}`}>
              Back
            </Link>
          ) : (
            <button
              type="button"
              className={`btn btn-ghost ${styles.backBtn}`}
              onClick={handleBack}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!currentAnswer}
          >
            {isLastStep ? "See my routine" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
