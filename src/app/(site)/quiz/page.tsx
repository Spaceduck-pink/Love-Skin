"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { quizQuestions } from "@/lib/quiz-data";
import { generateRoutine } from "@/lib/generate-routine";
import { saveSkinProfile } from "@/lib/actions";
import type { QuestionId, QuizAnswers, RoutineResult } from "@/lib/types";
import ProgressBar from "@/components/quiz/ProgressBar";
import QuestionStep from "@/components/quiz/QuestionStep";
import ResultsView from "@/components/quiz/ResultsView";
import LoadingRoutine from "@/components/quiz/LoadingRoutine";
import styles from "./quiz.module.css";

type PartialAnswers = Partial<Record<QuestionId, string>>;

const TOTAL_STEPS = quizQuestions.length;

function isCompleteAnswers(answers: PartialAnswers): answers is Record<QuestionId, string> {
  return quizQuestions.every((question) => Boolean(answers[question.id]));
}

export default function QuizPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [routine, setRoutine] = useState<RoutineResult | null>(null);
  const [savedToProfile, setSavedToProfile] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const currentQuestion = quizQuestions[stepIndex];
  const isLastStep = stepIndex === TOTAL_STEPS - 1;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  useEffect(() => {
    if (!isGenerating && !routine) {
      headingRef.current?.focus();
    }
  }, [stepIndex, isGenerating, routine]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = async () => {
    if (!currentAnswer) return;
    if (!isLastStep) {
      setStepIndex((index) => index + 1);
      return;
    }
    if (!isCompleteAnswers(answers)) return;

    const finalAnswers = answers as unknown as QuizAnswers;
    setIsGenerating(true);
    try {
      let generatedRoutine: RoutineResult;
      try {
        const response = await fetch("/api/generate-routine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: finalAnswers }),
        });
        if (!response.ok) throw new Error(`generate-routine failed: ${response.status}`);
        const data = await response.json();
        if (!data.routine) throw new Error("generate-routine returned no routine");
        generatedRoutine = data.routine as RoutineResult;
      } catch (error) {
        console.error("Falling back to local routine generation:", error);
        generatedRoutine = generateRoutine(finalAnswers);
      }

      const { savedToProfile } = await saveSkinProfile(finalAnswers, generatedRoutine).catch(
        (error) => {
          console.error("Failed to save skin profile:", error);
          return { savedToProfile: false };
        },
      );

      setSavedToProfile(savedToProfile);
      setRoutine(generatedRoutine);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    setStepIndex((index) => Math.max(0, index - 1));
  };

  const handleRetake = () => {
    setAnswers({});
    setStepIndex(0);
    setRoutine(null);
    setSavedToProfile(false);
  };

  if (routine) {
    return (
      <div className="container">
        <ResultsView routine={routine} onRetake={handleRetake} savedToProfile={savedToProfile} />
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.card}>
          <LoadingRoutine />
        </div>
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
