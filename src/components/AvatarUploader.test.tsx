import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AvatarUploader from "./AvatarUploader";
import { resetAvatarToGoogle } from "@/lib/settings-actions";

vi.mock("@/lib/settings-actions", () => ({
  uploadAvatar: vi.fn(async () => ({})),
  resetAvatarToGoogle: vi.fn(async () => ({})),
}));

const mockedReset = vi.mocked(resetAvatarToGoogle);

describe("AvatarUploader", () => {
  it("shows the current avatar and upload control", () => {
    render(
      <AvatarUploader firstName="Amy" avatarUrl="https://example.com/a.jpg" googleAvatarUrl={null} />,
    );
    expect(screen.getByRole("img", { name: "Amy's avatar" })).toHaveAttribute(
      "src",
      "https://example.com/a.jpg",
    );
    expect(screen.getByText("Upload photo")).toBeInTheDocument();
  });

  it("only shows the 'Use Google photo' option when a Google avatar exists", () => {
    const { rerender } = render(
      <AvatarUploader firstName="Amy" avatarUrl={null} googleAvatarUrl={null} />,
    );
    expect(screen.queryByRole("button", { name: "Use Google photo" })).not.toBeInTheDocument();

    rerender(
      <AvatarUploader
        firstName="Amy"
        avatarUrl={null}
        googleAvatarUrl="https://google.example.com/pic.jpg"
      />,
    );
    expect(screen.getByRole("button", { name: "Use Google photo" })).toBeInTheDocument();
  });

  it("previews a locally selected file before it's uploaded", async () => {
    const user = userEvent.setup();
    render(<AvatarUploader firstName="Amy" avatarUrl={null} googleAvatarUrl={null} />);

    const file = new File(["fake-image-bytes"], "avatar.png", { type: "image/png" });
    const input = screen.getByLabelText("Upload photo", { selector: "input" });
    await user.upload(input, file);

    expect(screen.getByRole("img", { name: "Amy's avatar" })).toHaveAttribute(
      "src",
      "blob:mock-url",
    );
  });

  it("resets to the Google photo when 'Use Google photo' is clicked", async () => {
    mockedReset.mockResolvedValue({ avatarUrl: "https://google.example.com/pic.jpg" });
    const user = userEvent.setup();
    render(
      <AvatarUploader
        firstName="Amy"
        avatarUrl={null}
        googleAvatarUrl="https://google.example.com/pic.jpg"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Use Google photo" }));

    expect(mockedReset).toHaveBeenCalled();
  });
});
