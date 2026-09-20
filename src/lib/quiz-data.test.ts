import { describe, expect, it } from "vitest";
import { quizQuestions } from "./quiz-data";
import type { QuestionId } from "./types";

const expectedIds: QuestionId[] = [
  "skinType",
  "concern",
  "middayFeel",
  "spfUsage",
  "complexity",
];

describe("quizQuestions", () => {
  it("has exactly the five questions the quiz flow expects, in order", () => {
    expect(quizQuestions.map((q) => q.id)).toEqual(expectedIds);
  });

  it("gives every question at least two options", () => {
    for (const question of quizQuestions) {
      expect(question.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("gives every option a non-empty value and label", () => {
    for (const question of quizQuestions) {
      for (const option of question.options) {
        expect(option.value).toBeTruthy();
        expect(option.label).toBeTruthy();
      }
    }
  });

  it("has unique option values within each question", () => {
    for (const question of quizQuestions) {
      const values = question.options.map((o) => o.value);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("gives every question a non-empty question string", () => {
    for (const question of quizQuestions) {
      expect(question.question).toBeTruthy();
    }
  });
});
