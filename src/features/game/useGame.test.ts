import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGame } from "./useGame";

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

const customInput = {
  kind: "FOOD" as const,
  name: "Cơm nhà",
  categoryId: "com",
  priceVnd: 35000,
  vegetarianPossible: false,
};

describe("game orchestration regressions", () => {
  it("recovers from an empty budget without discarding the personal pool", () => {
    const { result } = renderHook(useGame);
    act(() => result.current.setFilters({ budgetMode: "HARD_MAX", maxBudgetVnd: 1 }));
    act(() => result.current.open());
    expect(result.current.game.phase).toBe("blocked");
    act(() => result.current.setFilters({ budgetMode: "NONE" }));
    expect(result.current.game.phase).toBe("configuring");
    act(() => result.current.open());
    expect(result.current.game.phase).toBe("spinning");
  });

  it("returns the real outcome of consecutive custom-item submissions", () => {
    const { result } = renderHook(useGame);
    act(() => {
      expect(result.current.addCustom(customInput).ok).toBe(true);
      expect(result.current.addCustom({ ...customInput, name: "Món thứ hai" }).ok).toBe(true);
    });
    expect(result.current.profile.customItems).toHaveLength(2);
  });

  it("locks pool, filters, theme and reset until the frozen winner lands", () => {
    const { result } = renderHook(useGame);
    act(() => result.current.open());
    const frozen = result.current.game.frozenSelection;
    act(() => {
      result.current.setRevealTheme("wheel");
      result.current.setFilters({ kind: "DRINK" });
      result.current.addCustom(customInput);
    });
    expect(result.current.revealThemeId).toBe("case-reel");
    expect(result.current.profile.customItems).toHaveLength(0);
    expect(result.current.game.frozenSelection).toBe(frozen);
    expect(result.current.game.draftFilters.kind).toBe("FOOD");
    act(() => result.current.resetAll());
    expect(result.current.game.frozenSelection).toBe(frozen);
  });

  it("hydrates the local counter and counts each landing once, including re-spins", () => {
    localStorage.setItem("hnag_spin_count", "7");
    const { result } = renderHook(useGame);
    expect(result.current.spinCount).toBe(7);
    act(() => { result.current.open(); result.current.open(); });
    const winner = result.current.game.frozenSelection?.winner.id;
    expect(result.current.spinCount).toBe(7);
    act(() => { result.current.landed(); result.current.landed(); });
    expect(result.current.spinCount).toBe(8);
    act(() => result.current.respin());
    expect(result.current.game.frozenSelection?.winner.id).not.toBe(winner);
    act(() => result.current.landed());
    expect(result.current.spinCount).toBe(9);
    expect(localStorage.getItem("hnag_spin_count")).toBe("9");
  });

  it("keeps custom items and completed counts in memory when storage writes fail", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    const { result } = renderHook(useGame);
    act(() => { expect(result.current.addCustom(customInput).ok).toBe(true); });
    expect(result.current.profile.customItems).toHaveLength(1);
    expect(result.current.storageAvailable).toBe(false);
    act(() => result.current.open());
    act(() => result.current.landed());
    expect(result.current.game.phase).toBe("revealed");
    expect(result.current.spinCount).toBe(1);
  });

  it("shows a retryable error when randomness fails without changing the counter", () => {
    vi.spyOn(crypto, "getRandomValues").mockImplementation(() => { throw new Error("unavailable"); });
    const { result } = renderHook(useGame);
    act(() => result.current.open());
    expect(result.current.spinError).toMatch(/thử mở hộp lại/i);
    expect(result.current.spinCount).toBe(0);
    expect(result.current.game.phase).toBe("configuring");
    vi.restoreAllMocks();
    act(() => result.current.open());
    expect(result.current.game.phase).toBe("spinning");
    expect(result.current.spinError).toBeNull();
  });

  it.each(["NaN", "-5", "1.5", "9007199254740992"])("recovers from invalid counter %s", (value) => {
    localStorage.setItem("hnag_spin_count", value);
    const { result } = renderHook(useGame);
    expect(result.current.spinCount).toBe(0);
  });
});
