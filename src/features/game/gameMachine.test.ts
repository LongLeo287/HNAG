import { describe, expect, it } from "vitest";
import { seededRng } from "@/test/seededRng";
import { makeContext, makeItem } from "@/test/factories";
import { runRandomizer } from "@/features/randomizer/domain";
import { INITIAL_GAME_STATE, acceptResult, applyRandomizerResult, landReel, updateDraftFilters } from "./gameMachine";

describe("gameMachine", () => {
  it("locks filter edits while spinning (CODE game-controls-locked rule)", () => {
    const spinning = { ...INITIAL_GAME_STATE, phase: "spinning" as const };
    const result = updateDraftFilters(spinning, { vegetarianOnly: true });
    expect(result).toBe(spinning);
  });

  it("moves to blocked with diagnostics on NO_CANDIDATES", () => {
    const result = runRandomizer({
      pool: [makeItem({ id: "only", categoryId: "com" })],
      context: makeContext({ categoryIds: ["bun"] }),
      rng: seededRng(1),
    });
    const next = applyRandomizerResult(INITIAL_GAME_STATE, result);
    expect(next.phase).toBe("blocked");
    expect(next.blockedDiagnostics?.blockers).toContain("NO_CANDIDATES_CATEGORY");
  });

  it("moves to spinning with a frozen winner on OK", () => {
    const result = runRandomizer({
      pool: [makeItem({ id: "a" }), makeItem({ id: "b" })],
      context: makeContext(),
      rng: seededRng(1),
    });
    const next = applyRandomizerResult(INITIAL_GAME_STATE, result);
    expect(next.phase).toBe("spinning");
    expect(next.frozenSelection).not.toBeNull();
  });

  it("landReel only transitions from spinning", () => {
    expect(landReel(INITIAL_GAME_STATE).phase).toBe("configuring");
    const spinning = { ...INITIAL_GAME_STATE, phase: "spinning" as const };
    expect(landReel(spinning).phase).toBe("revealed");
  });

  it("acceptResult clears the frozen selection and returns to configuring", () => {
    const revealed = { ...INITIAL_GAME_STATE, phase: "revealed" as const, frozenSelection: null };
    const next = acceptResult(revealed);
    expect(next.phase).toBe("configuring");
    expect(next.frozenSelection).toBeNull();
  });
});
