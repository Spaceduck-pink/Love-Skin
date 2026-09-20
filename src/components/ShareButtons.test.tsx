import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareButtons from "./ShareButtons";

describe("ShareButtons", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("renders a share link for each social platform with the encoded url and text", () => {
    render(<ShareButtons url="https://loveskin.example.com/blog/post" title="My Post" />);

    const email = screen.getByRole("link", { name: "Share on Email" });
    expect(email).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent("https://loveskin.example.com/blog/post")),
    );

    expect(screen.getByRole("link", { name: "Share on WhatsApp" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Share on X" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Share on Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Share on Pinterest" })).toBeInTheDocument();
  });

  it("does not show the native share button when navigator.share is unavailable", () => {
    render(<ShareButtons url="https://example.com" title="Title" />);
    expect(screen.queryByRole("button", { name: /Share via your device/ })).not.toBeInTheDocument();
  });

  it("shows the native share button when navigator.share is available, and invokes it", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    const user = userEvent.setup();

    render(<ShareButtons url="https://example.com" title="Title" text="Some text" />);
    const button = screen.getByRole("button", { name: /Share via your device/ });
    await user.click(button);

    expect(share).toHaveBeenCalledWith({ title: "Title", text: "Some text", url: "https://example.com" });
    // @ts-expect-error -- undoing the test-only patch above
    delete navigator.share;
  });

  it("copies the link to the clipboard and shows a confirmation toast", async () => {
    // jsdom implements a real navigator.clipboard, so replacing the whole
    // object is silently ignored (WebIDL legacy platform object semantics) —
    // spy on the real instance's method instead.
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ShareButtons url="https://example.com" title="Title" />);
    await user.click(screen.getByRole("button", { name: "Copy link" }));

    expect(writeText).toHaveBeenCalledWith("https://example.com");
    expect(await screen.findByText("Link copied")).toBeInTheDocument();
  });
});
