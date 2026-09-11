import { describe, expect, it } from "vitest";
import { seededRng } from "@/test/seededRng";
import { makeContext, makeItem } from "@/test/factories";
import { runRandomizer } from "./engine";

describe("runRandomizer", () => {
  it("CODE-019: freezes a winner drawn only from the eligible pool", () => {
    const pool = [
      makeItem({ id: "a", kind: "FOOD" }),
      makeItem({ id: "b", kind: "FOOD" }),
      makeItem({ id: "wrong-kind", kind: "DRINK" }),
    ];
    const result = runRandomizer({
      pool,
      context: makeContext({ kind: "FOOD" }),
      rng: seededRng(5),
    });
    expect(result.status).toBe("OK");
    if (result.status === "OK") {
      expect(["a", "b"]).toContain(result.selection.winner.id);
      expect(result.selection.algorithmVersion).toBe("randomizer-v1.0.0");
    }
  });

  it("RANK-016: returns NO_CANDIDATES with diagnostics instead of relaxing filters", () => {
    const pool = [makeItem({ id: "only", categoryId: "com" })];
    const result = runRandomizer({
      pool,
      context: makeContext({ categoryIds: ["bun"] }),
      rng: seededRng(1),
    });
    expect(result.status).toBe("NO_CANDIDATES");
    if (result.status === "NO_CANDIDATES") {
      expect(result.diagnostics.blockers).toContain("NO_CANDIDATES_CATEGORY");
    }
  });

  it("re-spin: the previous winner never repeats immediately when another item is eligible", () => {
    const pool = [makeItem({ id: "a" }), makeItem({ id: "b" })];
    const rng = seededRng(2);
    let previousWinnerId: string | null = null;
    for (let i = 0; i < 20; i += 1) {
      const result = runRandomizer({
        pool,
        context: makeContext({ previousWinnerId }),
        rng,
      });
      expect(result.status).toBe("OK");
      if (result.status !== "OK") continue;
      if (previousWinnerId) {
        expect(result.selection.winner.id).not.toBe(previousWinnerId);
      }
      previousWinnerId = result.selection.winner.id;
    }
  });

  it("winner-consistency: replaying the same stable pool/context/seed reproduces the same winner", () => {
    const pool = [makeItem({ id: "a" }), makeItem({ id: "b" }), makeItem({ id: "c" })];
    const context = makeContext();
    const first = runRandomizer({ pool, context, rng: seededRng(99) });
    const second = runRandomizer({ pool: [...pool].reverse(), context, rng: seededRng(99) });
    expect(first.status).toBe("OK");
    expect(second.status).toBe("OK");
    if (first.status === "OK" && second.status === "OK") {
      expect(first.selection.winner.id).toBe(second.selection.winner.id);
    }
  });

  it("hard eligibility never allows a HARD_MAX winner to exceed the cap", () => {
    const pool = [
      makeItem({ id: "cheap", priceVnd: 20000 }),
      makeItem({ id: "expensive", priceVnd: 500000 }),
    ];
    const rng = seededRng(4);
    for (let i = 0; i < 30; i += 1) {
      const result = runRandomizer({
        pool,
        context: makeContext({ budgetMode: "HARD_MAX", maxBudgetVnd: 50000 }),
        rng,
      });
      expect(result.status).toBe("OK");
      if (result.status === "OK") {
        expect(result.selection.winner.id).toBe("cheap");
      }
    }
  });
});
