import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultActions } from "./ResultActions";

afterEach(() => vi.restoreAllMocks());

describe("ResultActions", () => {
  it("copies the actual winner name for apps without a public search route", async () => {
    const user = userEvent.setup();
    render(<ResultActions dishName="Bún bò Huế" onAccept={vi.fn()} onRespin={vi.fn()} onEditPool={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Sao chép tên món" }));
    expect(await navigator.clipboard.readText()).toBe("Bún bò Huế");
    expect(screen.getByRole("button", { name: /đã sao chép tên món/i })).toBeInTheDocument();
  });

  it("offers manual selection if clipboard access fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Clipboard denied"));
    render(<ResultActions dishName="Cơm & trà" onAccept={vi.fn()} onRespin={vi.fn()} onEditPool={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Sao chép tên món" }));
    expect(screen.getByRole("textbox", { name: "Tên món để sao chép" })).toHaveValue("Cơm & trà");
    expect(screen.queryByRole("button", { name: /đã sao chép/i })).not.toBeInTheDocument();
  });

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
