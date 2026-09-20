import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileNavLink from "./MobileNavLink";
import { MobileMenuContext } from "./MobileMenuContext";

describe("MobileNavLink", () => {
  it("renders a link with the given href and children", () => {
    render(<MobileNavLink href="/pricing">Pricing</MobileNavLink>);
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
  });

  it("calls the close-menu handler from context when clicked", async () => {
    const user = userEvent.setup();
    const closeMenu = vi.fn();

    render(
      <MobileMenuContext value={closeMenu}>
        <MobileNavLink href="/pricing">Pricing</MobileNavLink>
      </MobileMenuContext>,
    );

    await user.click(screen.getByRole("link", { name: "Pricing" }));

    expect(closeMenu).toHaveBeenCalledTimes(1);
  });

  it("doesn't throw when rendered without a provider (uses the no-op default)", async () => {
    const user = userEvent.setup();
    render(<MobileNavLink href="/pricing">Pricing</MobileNavLink>);
    await expect(user.click(screen.getByRole("link", { name: "Pricing" }))).resolves.not.toThrow();
  });
});
