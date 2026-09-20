import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResultsView from "./ResultsView";
import type { RoutineResult } from "@/lib/types";

const routine: RoutineResult = {
  headline: "Your oily skin, acne & breakouts routine",
  summary: "A summary of your routine.",
  tags: ["oily", "acne & breakouts", "standard routine"],
  am: [
    { title: "Cleanser", description: "Wash your face." },
    { title: "SPF", description: "Protect your face." },
  ],
  pm: [{ title: "Cleanser", description: "Wash your face." }],
  tips: ["Tip one.", "Tip two."],
};

describe("ResultsView", () => {
  it("renders the headline, summary, tags, and tips", () => {
    render(<ResultsView routine={routine} onRetake={vi.fn()} savedToProfile={false} />);

    expect(screen.getByRole("heading", { name: routine.headline })).toBeInTheDocument();
    expect(screen.getByText(routine.summary)).toBeInTheDocument();
    for (const tag of routine.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
    expect(screen.getByText("Tip one.")).toBeInTheDocument();
    expect(screen.getByText("Tip two.")).toBeInTheDocument();
  });

  it("renders each AM and PM step with a 1-indexed, zero-padded number", () => {
    render(<ResultsView routine={routine} onRetake={vi.fn()} savedToProfile={false} />);

    expect(screen.getAllByText("01")).toHaveLength(2);
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getAllByText("Cleanser")).toHaveLength(2);
  });

  it("does not show a saved notice or profile link when not saved to profile", () => {
    render(<ResultsView routine={routine} onRetake={vi.fn()} savedToProfile={false} />);

    expect(screen.queryByText("✓ Added to your profile")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Go to my routine" })).not.toBeInTheDocument();
  });

  it("shows a saved notice and profile link when saved to profile", () => {
    render(<ResultsView routine={routine} onRetake={vi.fn()} savedToProfile />);

    expect(screen.getByText("✓ Added to your profile")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to my routine" })).toHaveAttribute(
      "href",
      "/my-routine",
    );
  });

  it("calls onRetake when the retake button is clicked", async () => {
    const user = userEvent.setup();
    const onRetake = vi.fn();
    render(<ResultsView routine={routine} onRetake={onRetake} savedToProfile={false} />);

    await user.click(screen.getByRole("button", { name: "Retake the quiz" }));

    expect(onRetake).toHaveBeenCalledTimes(1);
  });
});
