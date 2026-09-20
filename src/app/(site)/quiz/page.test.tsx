import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizPage from "./page";
import { saveSkinProfile } from "@/lib/actions";
import { quizQuestions } from "@/lib/quiz-data";

vi.mock("@/lib/actions", () => ({
  saveSkinProfile: vi.fn(async () => ({ savedToProfile: true })),
}));

const mockedSave = vi.mocked(saveSkinProfile);

async function answerQuestion(user: ReturnType<typeof userEvent.setup>, label: RegExp) {
  await user.click(screen.getByRole("radio", { name: label }));
}

describe("QuizPage", () => {
  it("starts on the first question with Next disabled until an answer is chosen", () => {
    render(<QuizPage />);
    expect(screen.getByText(quizQuestions[0].question)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("enables Next once an option is selected, and advances through steps", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

    await answerQuestion(user, /^Oily/);
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText(quizQuestions[1].question)).toBeInTheDocument();
  });

  it("goes back to the previous question with the Back button", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

    await answerQuestion(user, /^Oily/);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(quizQuestions[1].question)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText(quizQuestions[0].question)).toBeInTheDocument();
  });

  it("links Back to home on the very first question", () => {
    render(<QuizPage />);
    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute("href", "/");
  });

  it("completes all questions and shows generated results, saving to the profile", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));
    const user = userEvent.setup();
    render(<QuizPage />);

    // skinType
    await answerQuestion(user, /^Oily/);
    await user.click(screen.getByRole("button", { name: "Next" }));
    // concern
    await answerQuestion(user, /^Acne & breakouts/);
    await user.click(screen.getByRole("button", { name: "Next" }));
    // middayFeel
    await answerQuestion(user, /^Shiny or greasy/);
    await user.click(screen.getByRole("button", { name: "Next" }));
    // spfUsage
    await answerQuestion(user, /^Yes, every day/);
    await user.click(screen.getByRole("button", { name: "Next" }));
    // complexity (last step)
    await answerQuestion(user, /^Standard/);
    expect(screen.getByRole("button", { name: "See my routine" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "See my routine" }));

    expect(
      await screen.findByRole("heading", { name: "Your oily skin, acne & breakouts routine" }),
    ).toBeInTheDocument();
    expect(screen.getByText("✓ Added to your profile")).toBeInTheDocument();
    expect(mockedSave).toHaveBeenCalledWith(
      expect.objectContaining({
        skinType: "oily",
        concern: "acne",
        middayFeel: "shiny",
        spfUsage: "daily",
        complexity: "standard",
      }),
      expect.any(Object),
    );
    vi.unstubAllGlobals();
  });

  it("retakes the quiz from the results screen, resetting to the first question", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));
    const user = userEvent.setup();
    render(<QuizPage />);

    for (const label of [/^Oily/, /^Acne & breakouts/, /^Shiny or greasy/, /^Yes, every day/]) {
      await answerQuestion(user, label);
      await user.click(screen.getByRole("button", { name: "Next" }));
    }
    await answerQuestion(user, /^Standard/);
    await user.click(screen.getByRole("button", { name: "See my routine" }));
    await screen.findByRole("button", { name: "Retake the quiz" });

    await user.click(screen.getByRole("button", { name: "Retake the quiz" }));

    expect(screen.getByText(quizQuestions[0].question)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    vi.unstubAllGlobals();
  });

  it("still shows a routine when saving to the profile fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));
    mockedSave.mockRejectedValueOnce(new Error("db unavailable"));
    const user = userEvent.setup();
    render(<QuizPage />);

    for (const label of [/^Oily/, /^Acne & breakouts/, /^Shiny or greasy/, /^Yes, every day/]) {
      await answerQuestion(user, label);
      await user.click(screen.getByRole("button", { name: "Next" }));
    }
    await answerQuestion(user, /^Standard/);
    await user.click(screen.getByRole("button", { name: "See my routine" }));

    expect(
      await screen.findByRole("heading", { name: "Your oily skin, acne & breakouts routine" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("✓ Added to your profile")).not.toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("uses the API-generated routine when the generate-routine endpoint succeeds", async () => {
    const apiRoutine = {
      headline: "API headline",
      summary: "API summary",
      tags: ["api"],
      am: [{ title: "API step", description: "desc" }],
      pm: [{ title: "API step", description: "desc" }],
      tips: ["tip"],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ routine: apiRoutine }),
      }),
    );
    const user = userEvent.setup();
    render(<QuizPage />);

    for (const label of [/^Oily/, /^Acne & breakouts/, /^Shiny or greasy/, /^Yes, every day/]) {
      await answerQuestion(user, label);
      await user.click(screen.getByRole("button", { name: "Next" }));
    }
    await answerQuestion(user, /^Standard/);
    await user.click(screen.getByRole("button", { name: "See my routine" }));

    expect(await screen.findByRole("heading", { name: "API headline" })).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("shows a loading state while the routine is being generated", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );
    const user = userEvent.setup();
    render(<QuizPage />);

    for (const label of [/^Oily/, /^Acne & breakouts/, /^Shiny or greasy/, /^Yes, every day/]) {
      await answerQuestion(user, label);
      await user.click(screen.getByRole("button", { name: "Next" }));
    }
    await answerQuestion(user, /^Standard/);
    await user.click(screen.getByRole("button", { name: "See my routine" }));

    expect(await screen.findByText("Reading your answers...")).toBeInTheDocument();

    resolveFetch({ ok: false, status: 500, json: async () => ({}) });
    await waitFor(() =>
      expect(screen.queryByText("Reading your answers...")).not.toBeInTheDocument(),
    );
    vi.unstubAllGlobals();
  });
});
