import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatWidget from "./ChatWidget";

function streamingResponse(chunks: string[], ok = true) {
  const encoder = new TextEncoder();
  let i = 0;
  const body = {
    getReader() {
      return {
        read() {
          if (i < chunks.length) {
            const value = encoder.encode(chunks[i]);
            i += 1;
            return Promise.resolve({ done: false, value });
          }
          return Promise.resolve({ done: true, value: undefined });
        },
      };
    },
  };
  return { ok, body, json: async () => ({}) } as unknown as Response;
}

describe("ChatWidget", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("is closed by default", () => {
    render(<ChatWidget />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens to show the welcome message", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open skincare assistant chat" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Hi! I'm your LoveSkin assistant/)).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open skincare assistant chat" }));
    await user.click(screen.getByRole("button", { name: "Close chat" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends a message and streams the assistant's reply", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(streamingResponse(["Use a gentle ", "cleanser twice a day."])),
    );
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open skincare assistant chat" }));
    await user.type(screen.getByLabelText("Message"), "What cleanser should I use?");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByText("What cleanser should I use?")).toBeInTheDocument();
    expect(
      await screen.findByText("Use a gentle cleanser twice a day."),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows an error message in the chat when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        body: null,
        json: async () => ({ error: "Rate limit exceeded." }),
      }),
    );
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open skincare assistant chat" }));
    await user.type(screen.getByLabelText("Message"), "Hello");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Rate limit exceeded.")).toBeInTheDocument();
  });

  it("disables the send button while a message is empty", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);
    await user.click(screen.getByRole("button", { name: "Open skincare assistant chat" }));

    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();

    await user.type(screen.getByLabelText("Message"), "Hi");
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  it("clears the chat history back to the welcome message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(streamingResponse(["Sure, here's a tip."])),
    );
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open skincare assistant chat" }));
    await user.type(screen.getByLabelText("Message"), "Any tips?");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByText("Sure, here's a tip.");

    await user.click(screen.getByRole("button", { name: "Clear chat history" }));

    expect(screen.queryByText("Any tips?")).not.toBeInTheDocument();
    expect(screen.getByText(/Hi! I'm your LoveSkin assistant/)).toBeInTheDocument();
  });

  it("persists chat history to localStorage and restores it on remount", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(streamingResponse(["Got it."])),
    );
    const user = userEvent.setup();
    const { unmount } = render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open skincare assistant chat" }));
    await user.type(screen.getByLabelText("Message"), "Remember this");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByText("Got it.");
    unmount();

    render(<ChatWidget />);
    await user.click(screen.getByRole("button", { name: "Open skincare assistant chat" }));

    expect(screen.getByText("Remember this")).toBeInTheDocument();

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem("loveskin-chat-history") ?? "[]");
      expect(stored.some((m: { text: string }) => m.text === "Remember this")).toBe(true);
    });
  });
});
