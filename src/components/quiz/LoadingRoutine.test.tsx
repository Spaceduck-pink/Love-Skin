import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import LoadingRoutine from "./LoadingRoutine";

describe("LoadingRoutine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts on the first message", () => {
    render(<LoadingRoutine />);
    expect(screen.getByText("Reading your answers...")).toBeInTheDocument();
  });

  it("advances to the next message every 2.2 seconds", () => {
    render(<LoadingRoutine />);

    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(screen.getByText("Matching products to your skin type...")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(screen.getByText("Layering your AM and PM steps...")).toBeInTheDocument();
  });

  it("stops advancing once it reaches the last message", () => {
    render(<LoadingRoutine />);

    act(() => {
      vi.advanceTimersByTime(2200 * 10);
    });

    expect(
      screen.getByText("Putting the finishing touches on your routine..."),
    ).toBeInTheDocument();
  });
});
