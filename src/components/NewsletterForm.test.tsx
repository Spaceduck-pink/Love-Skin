import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewsletterForm from "./NewsletterForm";
import { subscribeToNewsletter } from "@/lib/actions";

vi.mock("@/lib/actions", () => ({
  subscribeToNewsletter: vi.fn(),
}));

const mockedSubscribe = vi.mocked(subscribeToNewsletter);

describe("NewsletterForm", () => {
  it("renders the sign-up form", () => {
    render(<NewsletterForm />);
    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("shows a success message once the action resolves with success", async () => {
    mockedSubscribe.mockResolvedValue({ status: "success" });
    const user = userEvent.setup();
    render(<NewsletterForm />);

    await user.type(screen.getByLabelText("First name"), "Amy");
    await user.type(screen.getByLabelText("Email address"), "amy@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(await screen.findByText("You're on the list")).toBeInTheDocument();
  });

  it("shows an error message when the action resolves with an error", async () => {
    mockedSubscribe.mockResolvedValue({
      status: "error",
      message: "Please enter a valid name and email.",
    });
    const user = userEvent.setup();
    render(<NewsletterForm />);

    // The mocked action controls the outcome here, not the browser's native
    // email format check, so this just needs to pass type="email" validation.
    await user.type(screen.getByLabelText("First name"), "Amy");
    await user.type(screen.getByLabelText("Email address"), "amy@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please enter a valid name and email.",
    );
  });
});
