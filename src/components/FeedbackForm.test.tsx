import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedbackForm from "./FeedbackForm";
import { submitFeedback } from "@/lib/actions";

vi.mock("@/lib/actions", () => ({
  submitFeedback: vi.fn(),
}));

const mockedSubmit = vi.mocked(submitFeedback);

describe("FeedbackForm", () => {
  it("pre-fills name and email from defaultName/defaultEmail props", () => {
    render(<FeedbackForm defaultName="Amy" defaultEmail="amy@example.com" />);
    expect(screen.getByLabelText("Name")).toHaveValue("Amy");
    expect(screen.getByLabelText("Email address")).toHaveValue("amy@example.com");
  });

  it("shows a success message once the action resolves with success", async () => {
    mockedSubmit.mockResolvedValue({ status: "success" });
    const user = userEvent.setup();
    render(<FeedbackForm />);

    await user.type(screen.getByLabelText("Name"), "Amy");
    await user.type(screen.getByLabelText("Email address"), "amy@example.com");
    await user.type(screen.getByLabelText("Your feedback"), "Loving the app!");
    await user.click(screen.getByRole("button", { name: "Send feedback" }));

    expect(await screen.findByText("Thanks for the feedback")).toBeInTheDocument();
  });

  it("shows an error message when the action resolves with an error", async () => {
    mockedSubmit.mockResolvedValue({
      status: "error",
      message: "Please fill in your name, email, and feedback.",
    });
    const user = userEvent.setup();
    render(<FeedbackForm />);

    // The mocked action controls the outcome here, not the browser's native
    // required-field check, so every required field still needs a value.
    await user.type(screen.getByLabelText("Name"), "Amy");
    await user.type(screen.getByLabelText("Email address"), "amy@example.com");
    await user.type(screen.getByLabelText("Your feedback"), "Hi");
    await user.click(screen.getByRole("button", { name: "Send feedback" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please fill in your name, email, and feedback.",
    );
  });
});
