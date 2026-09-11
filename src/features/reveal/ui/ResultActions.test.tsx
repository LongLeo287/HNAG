import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultActions } from "./ResultActions";

describe("ResultActions", () => {
  it("FEAT-047: Accept and Re-spin call their respective handlers", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    const onRespin = vi.fn();
    const onEditPool = vi.fn();
    render(<ResultActions onAccept={onAccept} onRespin={onRespin} onEditPool={onEditPool} />);

    await user.click(screen.getByRole("button", { name: /chốt món/i }));
    expect(onAccept).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /quay tiếp/i }));
    expect(onRespin).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /chỉnh danh sách/i }));
    expect(onEditPool).toHaveBeenCalledOnce();
  });
});
