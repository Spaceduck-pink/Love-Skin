import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  it("switches to dark theme and persists it when toggled from no theme", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "Toggle color theme" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });

  it("switches back to light when toggled again", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Toggle color theme" });

    await user.click(button);
    await user.click(button);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("theme")).toBe("light");
  });
});
