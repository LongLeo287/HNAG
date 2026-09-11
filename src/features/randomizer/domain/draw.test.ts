import { describe, expect, it } from "vitest";
import { seededRng } from "@/test/seededRng";
import { makeItem } from "@/test/factories";
import { distributionTolerance } from "@/test/statistics";
import { drawPureRandom, drawWeighted } from "./draw";
import { computeWeights } from "./weighting";
import { makeContext } from "@/test/factories";

describe("drawPureRandom", () => {
  it("always returns a member of the eligible list", () => {
    const pool = [makeItem({ id: "a" }), makeItem({ id: "b" }), makeItem({ id: "c" })];
    const rng = seededRng(1);
    for (let i = 0; i < 50; i += 1) {
      const winner = drawPureRandom(pool, rng);
      expect(pool.some((item) => item.id === winner.id)).toBe(true);
    }
  });

  it("RANK-018: replays the same winner for the same stable pool + seeded RNG", () => {
    const pool = [makeItem({ id: "a" }), makeItem({ id: "b" }), makeItem({ id: "c" })];
    const first = drawPureRandom(pool, seededRng(42));
    const second = drawPureRandom(pool, seededRng(42));
    expect(first.id).toBe(second.id);
  });

  it(
    "RANK-032/QA-009: 100k draws match 1/N within max(0.005, 5*sqrt(p(1-p)/N))",
    () => {
      const pool = Array.from({ length: 10 }, (_, i) => makeItem({ id: `item-${i}` }));
      const draws = 100_000;
      const rng = seededRng(7);
      const counts = new Map<string, number>();
      for (let i = 0; i < draws; i += 1) {
        const winner = drawPureRandom(pool, rng);
        counts.set(winner.id, (counts.get(winner.id) ?? 0) + 1);
      }

      const p = 1 / pool.length;
      const tolerance = distributionTolerance(p, draws);
      for (const item of pool) {
        const observedFrequency = (counts.get(item.id) ?? 0) / draws;
        expect(Math.abs(observedFrequency - p)).toBeLessThan(tolerance);
      }
    },
  );
});

describe("drawWeighted", () => {
  it("only ever returns items with weight > 0 when at least one weight is positive", () => {
    const pool = [makeItem({ id: "zero" }), makeItem({ id: "hot" })];
    const rng = seededRng(3);
    for (let i = 0; i < 50; i += 1) {
      expect(drawWeighted(pool, [0, 1], rng).id).toBe("hot");
    }
  });

  it("QA-009: TARGET mode matches normalized configured weights within the spec tolerance", () => {
    const cheap = makeItem({ id: "cheap", priceVnd: 20000 });
    const onTarget = makeItem({ id: "on-target", priceVnd: 50000 });
    const expensive = makeItem({ id: "expensive", priceVnd: 200000 });
    const pool = [cheap, onTarget, expensive];
    const context = makeContext({ budgetMode: "TARGET", targetBudgetVnd: 50000 });
    const weights = computeWeights(pool, context);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const expectedShare = weights.map((w) => w / totalWeight);

    const draws = 100_000;
    const rng = seededRng(11);
    const counts = new Map<string, number>();
    for (let i = 0; i < draws; i += 1) {
      const winner = drawWeighted(pool, weights, rng);
      counts.set(winner.id, (counts.get(winner.id) ?? 0) + 1);
    }

    pool.forEach((item, index) => {
      const p = expectedShare[index] ?? 0;
      const observedFrequency = (counts.get(item.id) ?? 0) / draws;
      expect(Math.abs(observedFrequency - p)).toBeLessThan(distributionTolerance(p, draws));
    });
    // The on-target item must be drawn more often than the far-from-target expensive item.
    expect(counts.get("on-target") ?? 0).toBeGreaterThan(counts.get("expensive") ?? 0);
  });
});
