import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FoodDrinkToggle } from "./FoodDrinkToggle";

describe("FoodDrinkToggle", () => {
  it("UI-004: exposes radio semantics and reports the pressed value", () => {
    render(<FoodDrinkToggle value="FOOD" onChange={() => undefined} />);
    const food = screen.getByRole("radio", { name: /ăn/i });
    const drink = screen.getByRole("radio", { name: /uống/i });
    expect(food).toHaveAttribute("aria-checked", "true");
    expect(drink).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange with the newly selected kind", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FoodDrinkToggle value="FOOD" onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: /uống/i }));
    expect(onChange).toHaveBeenCalledWith("DRINK");
  });
});
