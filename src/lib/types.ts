export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

export type Concern = "acne" | "dullness" | "aging" | "dark-spots" | "redness";

export type MiddayFeel = "shiny" | "tight" | "normal" | "varies";

export type SpfUsage = "daily" | "sometimes" | "rarely";

export type Complexity = "minimal" | "standard" | "comprehensive";

export interface QuizAnswers {
  skinType: SkinType;
  concern: Concern;
  middayFeel: MiddayFeel;
  spfUsage: SpfUsage;
  complexity: Complexity;
}

export type QuestionId = keyof QuizAnswers;

export interface QuizOption<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
}

export interface QuizQuestion {
  id: QuestionId;
  question: string;
  helper?: string;
  options: QuizOption[];
}

export interface RoutineStep {
  title: string;
  description: string;
}

export interface RoutineResult {
  headline: string;
  summary: string;
  tags: string[];
  am: RoutineStep[];
  pm: RoutineStep[];
  tips: string[];
}
