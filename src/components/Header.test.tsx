import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

// SearchBar (rendered by Header) talks to Supabase and next/navigation;
// stub both so this test can focus on Header's own nav/menu behavior.
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Header", () => {
  it("renders the primary nav links", () => {
    render(<Header authDesktop={<div>Desktop auth</div>} authMobile={<div>Mobile auth</div>} />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toHaveTextContent("Skin Profile");
    expect(nav).toHaveTextContent("Products");
    expect(nav).toHaveTextContent("Blog");
    expect(nav).toHaveTextContent("Pricing");
  });

  it("renders the desktop and mobile auth slots passed in as props", () => {
    render(<Header authDesktop={<div>Desktop auth</div>} authMobile={<div>Mobile auth</div>} />);
    expect(screen.getByText("Desktop auth")).toBeInTheDocument();
    expect(screen.getByText("Mobile auth")).toBeInTheDocument();
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    render(<Header authDesktop={<div>Desktop auth</div>} authMobile={<div>Mobile auth</div>} />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes the mobile menu when the logo is clicked", async () => {
    const user = userEvent.setup();
    render(<Header authDesktop={<div>Desktop auth</div>} authMobile={<div>Mobile auth</div>} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("link", { name: /LoveSkin/ }));

    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });
});
