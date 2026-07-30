import type { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "skinType",
    question: "How would you describe your skin type?",
    helper: "Pick the one that fits most days — it doesn't need to be exact.",
    options: [
      { value: "oily", label: "Oily", hint: "Shiny most of the day, prone to enlarged pores" },
      { value: "dry", label: "Dry", hint: "Feels tight, flaky, or rough" },
      { value: "combination", label: "Combination", hint: "Oily T-zone, drier cheeks" },
      { value: "normal", label: "Normal", hint: "Balanced, rarely feels irritated" },
      { value: "sensitive", label: "Sensitive", hint: "Reacts easily, prone to redness or stinging" },
    ],
  },
  {
    id: "concern",
    question: "What's your main skin concern right now?",
    options: [
      { value: "acne", label: "Acne & breakouts" },
      { value: "dullness", label: "Dullness & uneven texture" },
      { value: "aging", label: "Fine lines & aging" },
      { value: "dark-spots", label: "Dark spots & hyperpigmentation" },
      { value: "redness", label: "Redness & sensitivity" },
    ],
  },
  {
    id: "middayFeel",
    question: "By midday, how does your skin usually feel?",
    options: [
      { value: "shiny", label: "Shiny or greasy" },
      { value: "tight", label: "Tight or flaky" },
      { value: "normal", label: "Comfortable, no change" },
      { value: "varies", label: "Depends on the area" },
    ],
  },
  {
    id: "spfUsage",
    question: "Do you currently wear SPF every day?",
    options: [
      { value: "daily", label: "Yes, every day" },
      { value: "sometimes", label: "Sometimes" },
      { value: "rarely", label: "Rarely or never" },
    ],
  },
  {
    id: "complexity",
    question: "How many steps do you want in your routine?",
    helper: "This shapes how detailed your AM and PM routine will be.",
    options: [
      { value: "minimal", label: "Minimal", hint: "3 steps — quick and low-effort" },
      { value: "standard", label: "Standard", hint: "5 steps — a solid daily routine" },
      { value: "comprehensive", label: "Comprehensive", hint: "7+ steps — the full routine" },
    ],
  },
];
