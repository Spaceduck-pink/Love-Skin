import { GoogleGenAI, Type } from "@google/genai";
import { generateRoutine } from "@/lib/generate-routine";
import type { QuizAnswers, RoutineResult } from "@/lib/types";

const MODEL = "gemini-3.6-flash";

const SKIN_TYPES = ["oily", "dry", "combination", "normal", "sensitive"];
const CONCERNS = ["acne", "dullness", "aging", "dark-spots", "redness"];
const MIDDAY_FEELS = ["shiny", "tight", "normal", "varies"];
const SPF_USAGES = ["daily", "sometimes", "rarely"];
const COMPLEXITIES = ["minimal", "standard", "comprehensive"];

const STEP_COUNTS: Record<QuizAnswers["complexity"], { am: number; pm: number }> = {
  minimal: { am: 3, pm: 3 },
  standard: { am: 5, pm: 5 },
  comprehensive: { am: 7, pm: 8 },
};

function isValidAnswers(value: unknown): value is QuizAnswers {
  if (typeof value !== "object" || value === null) return false;
  const answers = value as Record<string, unknown>;
  return (
    SKIN_TYPES.includes(answers.skinType as string) &&
    CONCERNS.includes(answers.concern as string) &&
    MIDDAY_FEELS.includes(answers.middayFeel as string) &&
    SPF_USAGES.includes(answers.spfUsage as string) &&
    COMPLEXITIES.includes(answers.complexity as string)
  );
}

const stepSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
  },
  required: ["title", "description"],
};

const routineSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    am: { type: Type.ARRAY, items: stepSchema },
    pm: { type: Type.ARRAY, items: stepSchema },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["headline", "summary", "tags", "am", "pm", "tips"],
};

function isValidRoutine(value: unknown): value is RoutineResult {
  if (typeof value !== "object" || value === null) return false;
  const routine = value as Record<string, unknown>;
  const isStepArray = (steps: unknown) =>
    Array.isArray(steps) &&
    steps.length > 0 &&
    steps.every(
      (step) =>
        typeof step === "object" &&
        step !== null &&
        typeof (step as RoutineResult["am"][number]).title === "string" &&
        typeof (step as RoutineResult["am"][number]).description === "string",
    );

  return (
    typeof routine.headline === "string" &&
    typeof routine.summary === "string" &&
    Array.isArray(routine.tags) &&
    routine.tags.every((tag) => typeof tag === "string") &&
    isStepArray(routine.am) &&
    isStepArray(routine.pm) &&
    Array.isArray(routine.tips) &&
    routine.tips.every((tip) => typeof tip === "string")
  );
}

function buildPrompt(answers: QuizAnswers): string {
  const steps = STEP_COUNTS[answers.complexity];
  return `Build a personalized AM/PM skincare routine as JSON for someone with:
- Skin type: ${answers.skinType}
- Main concern: ${answers.concern}
- Midday skin feel: ${answers.middayFeel}
- Current SPF habit: ${answers.spfUsage}
- Desired routine complexity: ${answers.complexity}

Requirements:
- "headline" is a short, friendly title for the routine.
- "summary" is 1-2 sentences explaining the overall approach for this skin type and concern.
- "tags" is 3 short lowercase labels summarizing the profile (e.g. skin type, concern, "${answers.complexity} routine").
- "am" has about ${steps.am} steps in application order, "pm" has about ${steps.pm} steps in application order. Each step has a "title" (product type, not a brand name) and a one-sentence "description" of what it does and why it's included.
- If spfUsage is "rarely" or "sometimes", the AM routine must end with an SPF step and the description should encourage building the daily habit. If "daily", still include SPF and acknowledge the good habit.
- "tips" has 2 short, practical notes relevant to the concern and complexity chosen.
- Keep tone warm, concise, and non-medical. Do not recommend prescription-strength treatments.`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const answers = (body as { answers?: unknown })?.answers;
  if (!isValidAnswers(answers)) {
    return Response.json({ error: "Invalid quiz answers." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ routine: generateRoutine(answers), source: "fallback" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: buildPrompt(answers) }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: routineSchema,
        maxOutputTokens: 4000,
      },
    });

    const parsed: unknown = JSON.parse(response.text ?? "");
    if (!isValidRoutine(parsed)) {
      throw new Error("Malformed routine shape from Gemini");
    }

    return Response.json({ routine: parsed, source: "gemini" });
  } catch (err) {
    console.error("generate-routine Gemini error, falling back:", err);
    return Response.json({ routine: generateRoutine(answers), source: "fallback" });
  }
}
