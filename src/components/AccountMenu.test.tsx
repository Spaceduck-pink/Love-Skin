import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountMenu from "./AccountMenu";

vi.mock("@/lib/auth-actions", () => ({
  signOut: vi.fn(),
}));

describe("AccountMenu", () => {
  it("shows the first name (or 'Account' as a fallback) on the trigger button", () => {
    render(<AccountMenu isAdmin={false} firstName="Amy" username="amy" avatarUrl={null} />);
    expect(screen.getByRole("button", { name: /Amy/ })).toBeInTheDocument();
  });

  it("falls back to 'Account' when there's no first name", () => {
    render(<AccountMenu isAdmin={false} firstName={null} username={null} avatarUrl={null} />);
    expect(screen.getByRole("button", { name: /Account/ })).toBeInTheDocument();
  });

  it("the menu panel is closed by default", () => {
    render(<AccountMenu isAdmin={false} firstName="Amy" username="amy" avatarUrl={null} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the menu on click, showing the standard menu items", async () => {
    const user = userEvent.setup();
    render(<AccountMenu isAdmin={false} firstName="Amy" username="amy" avatarUrl={null} />);

    await user.click(screen.getByRole("button", { name: /Amy/ }));

    expect(screen.getByRole("menuitem", { name: "My routine" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Log out" })).toBeInTheDocument();
  });

  it("shows a 'View profile' link only when a username is set", async () => {
    const user = userEvent.setup();
    render(<AccountMenu isAdmin={false} firstName="Amy" username={null} avatarUrl={null} />);

    await user.click(screen.getByRole("button", { name: /Amy/ }));

    expect(screen.queryByRole("menuitem", { name: "View profile" })).not.toBeInTheDocument();
  });

  it("shows an Admin link only when isAdmin is true", async () => {
    const user = userEvent.setup();
    render(<AccountMenu isAdmin username="amy" firstName="Amy" avatarUrl={null} />);

    await user.click(screen.getByRole("button", { name: /Amy/ }));

    expect(screen.getByRole("menuitem", { name: "Admin" })).toBeInTheDocument();
  });

  it("closes the menu when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<AccountMenu isAdmin={false} firstName="Amy" username="amy" avatarUrl={null} />);

    await user.click(screen.getByRole("button", { name: /Amy/ }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles closed when the trigger is clicked again", async () => {
    const user = userEvent.setup();
    render(<AccountMenu isAdmin={false} firstName="Amy" username="amy" avatarUrl={null} />);

    const trigger = screen.getByRole("button", { name: /Amy/ });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
