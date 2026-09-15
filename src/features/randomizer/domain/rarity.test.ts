import { describe, expect, it } from "vitest";
import { makeContext, makeItem } from "@/test/factories";
import { runRandomizer } from "./engine";
import { computeWeights } from "./weighting";

const tiers = ["THUONG", "NGON", "DINH", "HUYEN_THOAI"] as const;
const expectedShares = [0.8, 0.16, 0.035, 0.005];
const pool = tiers.map((rarity, i) => makeItem({ id: `${i}`, rarity }));

function tierShares(items: typeof pool, context = makeContext()) {
  const weights = computeWeights(items, context);
  const total = weights.reduce((a, b) => a + b, 0);
  return tiers.map((tier) => items.reduce((sum, item, i) => sum + (item.rarity === tier ? weights[i]! / total : 0), 0));
}

describe("rarity balance requested on 2026-09-12", () => {
  it("keeps full-pool tier odds at 80 / 16 / 3.5 / 0.5 regardless of tier population", () => {
    const crowded = [...pool, ...Array.from({ length: 20 }, (_, i) => makeItem({ id: `gold-${i}`, rarity: "HUYEN_THOAI" }))];
    tierShares(crowded).forEach((share, i) => expect(share).toBeCloseTo(expectedShares[i]!, 12));
  });

  it("uses rarity probabilities for the real NONE draw, not only an odds display", () => {
    const result = runRandomizer({ pool, context: makeContext(), rng: () => 0.79 });
    expect(result.status).toBe("OK");
    if (result.status === "OK") expect(result.selection.winner.rarity).toBe("THUONG");
  });

  it("TARGET favors price fit inside a tier without increasing that tier's total share", () => {
    const priced = pool.map((item) => ({ ...item, priceVnd: item.rarity === "HUYEN_THOAI" ? 150000 : 20000 }));
    tierShares(priced, makeContext({ budgetMode: "TARGET", targetBudgetVnd: 150000 }))
      .forEach((share, i) => expect(share).toBeCloseTo(expectedShares[i]!, 12));
  });

  it("conditions on available tiers without inventing unavailable winners", () => {
    const shares = tierShares(pool.filter((item) => item.rarity === "THUONG" || item.rarity === "DINH"));
    expect(shares[0]).toBeCloseTo(0.8 / 0.835, 12);
    expect(shares[1]).toBe(0);
    expect(shares[2]).toBeCloseTo(0.035 / 0.835, 12);
    expect(shares[3]).toBe(0);
  });

  it("handles empty and single-item pools", () => {
    expect(computeWeights([], makeContext())).toEqual([]);
    expect(tierShares([pool[3]!])).toEqual([0, 0, 0, 1]);
  });

  it("re-spin never forces a high tier by removing the last item of the previous tier", () => {
    const result = runRandomizer({ pool: [pool[0]!, pool[3]!], context: makeContext({ previousWinnerId: pool[0]!.id }), rng: () => 0.5 });
    expect(result.status).toBe("OK");
    if (result.status === "OK") expect(result.selection.winner.id).toBe(pool[0]!.id);
  });
});
