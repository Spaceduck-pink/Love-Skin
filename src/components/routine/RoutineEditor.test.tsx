import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoutineEditor from "./RoutineEditor";

vi.mock("@/lib/routine-actions", () => ({
  updateRoutine: vi.fn(async () => ({})),
}));

const am = [{ title: "Cleanser", description: "" }];
const pm = [{ title: "Cleanser", description: "Wash your face." }];
const products = [{ title: "Niacinamide serum", description: "Calms redness." }];

describe("RoutineEditor", () => {
  it("renders the initial AM and PM steps", () => {
    render(<RoutineEditor am={am} pm={pm} products={products} />);
    expect(screen.getByLabelText("Morning step 1 title")).toHaveValue("Cleanser");
    expect(screen.getByLabelText("Evening step 1 title")).toHaveValue("Cleanser");
    expect(screen.getByLabelText("Evening step 1 notes")).toHaveValue("Wash your face.");
  });

  it("adds a new empty step to a period when 'Add step' is clicked", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor am={am} pm={pm} products={products} />);

    const addButtons = screen.getAllByRole("button", { name: "+ Add step" });
    await user.click(addButtons[0]);

    expect(screen.getByLabelText("Morning step 2 title")).toHaveValue("");
  });

  it("removes a step when its remove button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <RoutineEditor
        am={[
          { title: "Step one", description: "" },
          { title: "Step two", description: "" },
        ]}
        pm={pm}
        products={products}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Remove morning step 1" }));

    expect(screen.queryByDisplayValue("Step one")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Morning step 1 title")).toHaveValue("Step two");
  });

  it("moves a step down and disables the boundary move buttons", async () => {
    const user = userEvent.setup();
    render(
      <RoutineEditor
        am={[
          { title: "First", description: "" },
          { title: "Second", description: "" },
        ]}
        pm={pm}
        products={products}
      />,
    );

    expect(screen.getByRole("button", { name: "Move morning step 1 up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move morning step 2 down" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Move morning step 1 down" }));

    expect(screen.getByLabelText("Morning step 1 title")).toHaveValue("Second");
    expect(screen.getByLabelText("Morning step 2 title")).toHaveValue("First");
  });

  it("auto-fills a step's description from a matched product when the description is empty", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor am={am} pm={pm} products={products} />);

    const titleInput = screen.getByLabelText("Morning step 1 title");
    await user.clear(titleInput);
    await user.type(titleInput, "Niacinamide serum");

    expect(screen.getByLabelText("Morning step 1 notes")).toHaveValue("Calms redness.");
  });

  it("does not overwrite existing notes when picking a matched product", async () => {
    const user = userEvent.setup();
    render(
      <RoutineEditor
        am={[{ title: "", description: "My own notes" }]}
        pm={pm}
        products={products}
      />,
    );

    const titleInput = screen.getByLabelText("Morning step 1 title");
    await user.type(titleInput, "Niacinamide serum");

    expect(screen.getByLabelText("Morning step 1 notes")).toHaveValue("My own notes");
  });
});
