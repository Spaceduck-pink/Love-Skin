import { describe, expect, it } from "vitest";
import {
  arrayToLines,
  linesToArray,
  parseFaqs,
  parseWhatHelps,
  serializeFaqs,
  serializeWhatHelps,
} from "./admin-skin-profile-format";

describe("linesToArray / arrayToLines", () => {
  it("splits text into a trimmed, non-empty list of lines", () => {
    expect(linesToArray("first\n  second  \n\nthird\n")).toEqual([
      "first",
      "second",
      "third",
    ]);
  });

  it("returns an empty array for blank input", () => {
    expect(linesToArray("\n\n  \n")).toEqual([]);
  });

  it("joins an array back into newline-separated text", () => {
    expect(arrayToLines(["first", "second"])).toBe("first\nsecond");
  });

  it("round-trips through both directions", () => {
    const items = ["one", "two", "three"];
    expect(linesToArray(arrayToLines(items))).toEqual(items);
  });
});

describe("parseFaqs / serializeFaqs", () => {
  it("parses Q/A blocks separated by blank lines", () => {
    const text = "Q: What is retinol?\nA: A vitamin A derivative.\n\nQ: Is it safe?\nA: Yes, when used correctly.";
    expect(parseFaqs(text)).toEqual([
      { q: "What is retinol?", a: "A vitamin A derivative." },
      { q: "Is it safe?", a: "Yes, when used correctly." },
    ]);
  });

  it("is case-insensitive on the Q/A labels", () => {
    const text = "q: Question\na: Answer";
    expect(parseFaqs(text)).toEqual([{ q: "Question", a: "Answer" }]);
  });

  it("supports a multi-line answer", () => {
    const text = "Q: Multi?\nA: Line one\nline two";
    expect(parseFaqs(text)).toEqual([{ q: "Multi?", a: "Line one\nline two" }]);
  });

  it("drops blocks missing a question or an answer", () => {
    const text = "Q: Only a question\n\nA: Only an answer\n\nQ: Complete\nA: Pair";
    expect(parseFaqs(text)).toEqual([{ q: "Complete", a: "Pair" }]);
  });

  it("returns an empty array for blank input", () => {
    expect(parseFaqs("")).toEqual([]);
  });

  it("serializes FAQs back into Q/A blocks", () => {
    const faqs = [
      { q: "What is retinol?", a: "A vitamin A derivative." },
      { q: "Is it safe?", a: "Yes, when used correctly." },
    ];
    expect(serializeFaqs(faqs)).toBe(
      "Q: What is retinol?\nA: A vitamin A derivative.\n\nQ: Is it safe?\nA: Yes, when used correctly.",
    );
  });

  it("round-trips through both directions", () => {
    const faqs = [{ q: "Question?", a: "Answer." }];
    expect(parseFaqs(serializeFaqs(faqs))).toEqual(faqs);
  });
});

describe("parseWhatHelps / serializeWhatHelps", () => {
  it("parses Title/Description blocks separated by blank lines", () => {
    const text =
      "Title: Niacinamide\nDescription: Calms redness.\n\nTitle: Salicylic acid\nDescription: Clears pores.";
    expect(parseWhatHelps(text)).toEqual([
      { title: "Niacinamide", description: "Calms redness." },
      { title: "Salicylic acid", description: "Clears pores." },
    ]);
  });

  it("round-trips through both directions", () => {
    const items = [{ title: "Retinol", description: "Boosts cell turnover." }];
    expect(parseWhatHelps(serializeWhatHelps(items))).toEqual(items);
  });

  it("drops incomplete blocks", () => {
    const text = "Title: No description here";
    expect(parseWhatHelps(text)).toEqual([]);
  });
});
