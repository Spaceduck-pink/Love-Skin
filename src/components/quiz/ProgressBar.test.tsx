import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  it("shows the current step and total", () => {
    render(<ProgressBar current={2} total={5} />);
    expect(screen.getByText("Question 2 of 5")).toBeInTheDocument();
  });

  it("computes and displays the rounded percentage", () => {
    render(<ProgressBar current={1} total={3} />);
    expect(screen.getByText("33%")).toBeInTheDocument();
  });

  it("exposes the percentage via the progressbar role for assistive tech", () => {
    render(<ProgressBar current={3} total={4} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "75");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("shows 100% when current equals total", () => {
    render(<ProgressBar current={5} total={5} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
