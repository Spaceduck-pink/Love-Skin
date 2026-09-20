import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuestionStep from "./QuestionStep";
import type { QuizQuestion } from "@/lib/types";

const question: QuizQuestion = {
  id: "skinType",
  question: "How would you describe your skin type?",
  helper: "Pick the one that fits most days.",
  options: [
    { value: "oily", label: "Oily", hint: "Shiny most of the day" },
    { value: "dry", label: "Dry" },
    { value: "normal", label: "Normal" },
  ],
};

function setup(selectedValue?: string) {
  const onSelect = vi.fn();
  const headingRef = createRef<HTMLHeadingElement>();
  render(
    <QuestionStep
      question={question}
      selectedValue={selectedValue}
      onSelect={onSelect}
      headingRef={headingRef}
    />,
  );
  return { onSelect };
}

describe("QuestionStep", () => {
  it("renders the question, helper text, and every option", () => {
    setup();
    expect(screen.getByText(question.question)).toBeInTheDocument();
    expect(screen.getByText(question.helper!)).toBeInTheDocument();
    for (const option of question.options) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  it("renders an option's hint when present", () => {
    setup();
    expect(screen.getByText("Shiny most of the day")).toBeInTheDocument();
  });

  it("calls onSelect with the option's value when clicked", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup();

    await user.click(screen.getByRole("radio", { name: /Dry/ }));

    expect(onSelect).toHaveBeenCalledWith("dry");
  });

  it("marks the selected option as checked", () => {
    setup("dry");
    expect(screen.getByRole("radio", { name: /Dry/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /Oily/ })).toHaveAttribute("aria-checked", "false");
  });

  it("moves selection to the next option on ArrowDown", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup("oily");

    screen.getByRole("radio", { name: /Oily/ }).focus();
    await user.keyboard("{ArrowDown}");

    expect(onSelect).toHaveBeenCalledWith("dry");
  });

  it("wraps around to the first option on ArrowDown from the last option", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup("normal");

    screen.getByRole("radio", { name: /Normal/ }).focus();
    await user.keyboard("{ArrowDown}");

    expect(onSelect).toHaveBeenCalledWith("oily");
  });

  it("moves selection to the previous option on ArrowUp, wrapping to the last", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup("oily");

    screen.getByRole("radio", { name: /Oily/ }).focus();
    await user.keyboard("{ArrowUp}");

    expect(onSelect).toHaveBeenCalledWith("normal");
  });
});
