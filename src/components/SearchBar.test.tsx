import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

// SearchBar also merges in live product/skin-profile results from Supabase;
// this component test only exercises the static searchIndex, so an empty
// result set keeps it focused and avoids a real network dependency.
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

describe("SearchBar", () => {
  it("opens the search panel when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("shows matching static results as the user types", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.type(screen.getByLabelText("Search LoveSkin"), "quiz");

    expect(await screen.findByText("Start the Quiz")).toBeInTheDocument();
  });

  it("shows a no-results message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.type(screen.getByLabelText("Search LoveSkin"), "zzzznomatch");

    expect(
      await screen.findByText(
        (_, element) => Boolean(element?.textContent?.includes("zzzznomatch")),
        { selector: "li" },
      ),
    ).toHaveTextContent("No results for");
  });

  it("navigates to a result and closes the panel when it's clicked", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.type(screen.getByLabelText("Search LoveSkin"), "quiz");
    await user.click(await screen.findByText("Start the Quiz"));

    expect(push).toHaveBeenCalledWith("/quiz");
    await waitFor(() => expect(screen.queryByRole("search")).not.toBeInTheDocument());
  });

  it("submits to the top result when the form is submitted", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    const input = screen.getByLabelText("Search LoveSkin");
    await user.type(input, "quiz");
    await waitFor(() => expect(screen.getByText("Start the Quiz")).toBeInTheDocument());
    await user.type(input, "{Enter}");

    expect(push).toHaveBeenCalledWith("/quiz");
  });

  it("closes the panel on Escape", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("search")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("search")).not.toBeInTheDocument());
  });
});
