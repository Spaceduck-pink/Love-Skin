import { describe, expect, it } from "vitest";
import { generateRoutine } from "./generate-routine";
import type { QuizAnswers, SkinType, Concern, Complexity } from "./types";

const baseAnswers: QuizAnswers = {
  skinType: "oily",
  concern: "acne",
  middayFeel: "shiny",
  spfUsage: "daily",
  complexity: "standard",
};

const skinTypes: SkinType[] = ["oily", "dry", "combination", "normal", "sensitive"];
const concerns: Concern[] = ["acne", "dullness", "aging", "dark-spots", "redness"];
const complexities: Complexity[] = ["minimal", "standard", "comprehensive"];

describe("generateRoutine", () => {
  it("produces the expected step counts for a minimal routine", () => {
    const routine = generateRoutine({ ...baseAnswers, complexity: "minimal" });
    expect(routine.am).toHaveLength(3);
    expect(routine.pm).toHaveLength(3);
  });

  it("produces the expected step counts for a standard routine", () => {
    const routine = generateRoutine({ ...baseAnswers, complexity: "standard" });
    expect(routine.am).toHaveLength(5);
    expect(routine.pm).toHaveLength(5);
  });

  it("produces the expected step counts for a comprehensive routine", () => {
    const routine = generateRoutine({ ...baseAnswers, complexity: "comprehensive" });
    expect(routine.am).toHaveLength(7);
    expect(routine.pm).toHaveLength(8);
  });

  it("tags the routine with skin type, concern, and complexity", () => {
    const routine = generateRoutine(baseAnswers);
    expect(routine.tags).toEqual(["oily", "acne & breakouts", "standard routine"]);
  });

  it("includes a headline that names the skin type and concern", () => {
    const routine = generateRoutine(baseAnswers);
    expect(routine.headline).toBe("Your oily skin, acne & breakouts routine");
  });

  it("capitalizes the first letter of the skin description in the summary", () => {
    const routine = generateRoutine(baseAnswers);
    expect(routine.summary.startsWith("Your skin tends")).toBe(true);
  });

  it("includes exactly two tips: the concern tip and a midday note", () => {
    const routine = generateRoutine(baseAnswers);
    expect(routine.tips).toHaveLength(2);
  });

  it.each(skinTypes)("generates a routine without throwing for skin type '%s'", (skinType) => {
    expect(() => generateRoutine({ ...baseAnswers, skinType })).not.toThrow();
  });

  it.each(concerns)("generates a routine without throwing for concern '%s'", (concern) => {
    expect(() => generateRoutine({ ...baseAnswers, concern })).not.toThrow();
  });

  it.each(complexities)("generates non-empty am/pm steps for complexity '%s'", (complexity) => {
    const routine = generateRoutine({ ...baseAnswers, complexity });
    expect(routine.am.length).toBeGreaterThan(0);
    expect(routine.pm.length).toBeGreaterThan(0);
    for (const step of [...routine.am, ...routine.pm]) {
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
    }
  });

  it("uses a mattifying SPF for oily and combination skin", () => {
    const oily = generateRoutine({ ...baseAnswers, skinType: "oily" });
    const combination = generateRoutine({ ...baseAnswers, skinType: "combination" });
    expect(oily.am.at(-1)?.title).toContain("Mattifying");
    expect(combination.am.at(-1)?.title).toContain("Mattifying");
  });

  it("uses a mineral SPF for sensitive skin", () => {
    const sensitive = generateRoutine({ ...baseAnswers, skinType: "sensitive" });
    expect(sensitive.am.at(-1)?.title).toContain("Mineral SPF");
  });

  it("uses a broad-spectrum SPF for dry and normal skin", () => {
    const dry = generateRoutine({ ...baseAnswers, skinType: "dry" });
    const normal = generateRoutine({ ...baseAnswers, skinType: "normal" });
    expect(dry.am.at(-1)?.title).toBe("Broad-spectrum SPF 30+");
    expect(normal.am.at(-1)?.title).toBe("Broad-spectrum SPF 30+");
  });

  it("nudges people who rarely wear SPF to start applying it daily", () => {
    const routine = generateRoutine({ ...baseAnswers, spfUsage: "rarely" });
    expect(routine.am.at(-1)?.description).toContain("single most impactful step");
  });

  it("encourages people who already wear SPF daily to keep the habit", () => {
    const routine = generateRoutine({ ...baseAnswers, spfUsage: "daily" });
    expect(routine.am.at(-1)?.description).toContain("Keep up the daily habit");
  });

  it("adds a midday tip tailored to a shiny midday feel", () => {
    const routine = generateRoutine({ ...baseAnswers, middayFeel: "shiny" });
    expect(routine.tips[1]).toContain("blotting paper");
  });

  it("adds a midday tip tailored to a tight midday feel", () => {
    const routine = generateRoutine({ ...baseAnswers, middayFeel: "tight" });
    expect(routine.tips[1]).toContain("hydrating mist");
  });

  it("adds a midday tip tailored to a varying midday feel", () => {
    const routine = generateRoutine({ ...baseAnswers, middayFeel: "varies" });
    expect(routine.tips[1]).toContain("varies by area");
  });

  it("adds a generic midday tip for a comfortable midday feel", () => {
    const routine = generateRoutine({ ...baseAnswers, middayFeel: "normal" });
    expect(routine.tips[1]).toContain("balanced");
  });
});
