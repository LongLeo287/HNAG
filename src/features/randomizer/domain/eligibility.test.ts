import { describe, expect, it } from "vitest";
import { makeContext, makeItem } from "@/test/factories";
import { applyHardFilters, applyRespinExclusion, stableSortById } from "./eligibility";

describe("applyHardFilters", () => {
  it("RANK-004: excludes disabled and wrong-kind items", () => {
    const pool = [
      makeItem({ id: "a", kind: "FOOD", enabled: true }),
      makeItem({ id: "b", kind: "FOOD", enabled: false }),
      makeItem({ id: "c", kind: "DRINK", enabled: true }),
    ];
    const { eligible } = applyHardFilters(pool, makeContext({ kind: "FOOD" }));
    expect(eligible.map((i) => i.id)).toEqual(["a"]);
  });

  it("RANK-005: a selected category must be matched, never silently ignored", () => {
    const pool = [
      makeItem({ id: "com-1", categoryId: "com" }),
      makeItem({ id: "bun-1", categoryId: "bun" }),
    ];
    const { eligible, diagnostics } = applyHardFilters(
      pool,
      makeContext({ categoryIds: ["bun"] }),
    );
    expect(eligible.map((i) => i.id)).toEqual(["bun-1"]);
    expect(diagnostics.blockers).not.toContain("NO_CANDIDATES_CATEGORY");
  });

  it("RANK-006: vegetarianOnly excludes non-vegetarian items with zero violations", () => {
    const pool = [
      makeItem({ id: "veg", vegetarianPossible: true }),
      makeItem({ id: "meat", vegetarianPossible: false }),
    ];
    const { eligible } = applyHardFilters(pool, makeContext({ vegetarianOnly: true }));
    expect(eligible).toHaveLength(1);
    expect(eligible[0]?.id).toBe("veg");
  });

  it("RANK-009/010: HARD_MAX excludes unknown prices, never treats them as free", () => {
    const pool = [
      makeItem({ id: "known-cheap", priceVnd: 20000 }),
      makeItem({ id: "known-expensive", priceVnd: 200000 }),
      makeItem({ id: "unknown", priceVnd: null }),
    ];
    const { eligible } = applyHardFilters(
      pool,
      makeContext({ budgetMode: "HARD_MAX", maxBudgetVnd: 50000 }),
    );
    expect(eligible.map((i) => i.id)).toEqual(["known-cheap"]);
  });

  it("RANK-016: reports a blocker instead of relaxing filters when nothing is eligible", () => {
    const pool = [makeItem({ id: "only", categoryId: "com" })];
    const { eligible, diagnostics } = applyHardFilters(
      pool,
      makeContext({ categoryIds: ["bun"] }),
    );
    expect(eligible).toHaveLength(0);
    expect(diagnostics.blockers).toContain("NO_CANDIDATES_CATEGORY");
  });

  it("origin never changes eligibility (CUSTOM_FAIR precondition)", () => {
    const pool = [
      makeItem({ id: "bundled", origin: "BUNDLED" }),
      makeItem({ id: "custom", origin: "CUSTOM" }),
    ];
    const { eligible } = applyHardFilters(pool, makeContext());
    expect(eligible.map((i) => i.id).sort()).toEqual(["bundled", "custom"]);
  });
});

describe("applyRespinExclusion", () => {
  it("RANK-015: excludes exactly the previous winner when another candidate exists", () => {
    const pool = [makeItem({ id: "a" }), makeItem({ id: "b" }), makeItem({ id: "c" })];
    const result = applyRespinExclusion(pool, "b");
    expect(result.map((i) => i.id).sort()).toEqual(["a", "c"]);
  });

  it("keeps the sole candidate instead of emptying the pool", () => {
    const pool = [makeItem({ id: "only" })];
    const result = applyRespinExclusion(pool, "only");
    expect(result.map((i) => i.id)).toEqual(["only"]);
  });

  it("is a no-op on the first spin (no previous winner)", () => {
    const pool = [makeItem({ id: "a" }), makeItem({ id: "b" })];
    const result = applyRespinExclusion(pool, null);
    expect(result).toHaveLength(2);
  });
});

describe("stableSortById", () => {
  it("RANK-017: sorts ascending regardless of input order (permutation invariant)", () => {
    const pool = [makeItem({ id: "c" }), makeItem({ id: "a" }), makeItem({ id: "b" })];
    expect(stableSortById(pool).map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(stableSortById([...pool].reverse()).map((i) => i.id)).toEqual(["a", "b", "c"]);
  });
});
