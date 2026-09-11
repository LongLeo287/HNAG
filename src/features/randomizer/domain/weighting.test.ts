import { describe, expect, it } from "vitest";
import { makeContext, makeItem } from "@/test/factories";
import { computeWeights, priceFit, targetWeight } from "./weighting";

describe("priceFit (RANK-012)", () => {
  it("is 1.0 when price equals target", () => {
    expect(priceFit(50000, 50000)).toBeCloseTo(1, 10);
  });

  it("is symmetric in log-space around the target", () => {
    const below = priceFit(25000, 50000); // ratio 0.5
    const above = priceFit(100000, 50000); // ratio 2.0
    expect(below).toBeCloseTo(above, 10);
  });

  it("decays monotonically as price moves away from target", () => {
    const near = priceFit(45000, 50000);
    const far = priceFit(20000, 50000);
    expect(near).toBeGreaterThan(far);
  });

  it("returns the fixed unknown-price fit instead of guessing", () => {
    expect(priceFit(null, 50000)).toBe(0.25);
  });
});

describe("targetWeight (RANK-013)", () => {
  it("never reaches zero, even far from target", () => {
    expect(targetWeight(1_000_000, 20000)).toBeGreaterThan(0);
  });

  it("is monotonic with priceFit", () => {
    const closer = targetWeight(48000, 50000);
    const farther = targetWeight(10000, 50000);
    expect(closer).toBeGreaterThan(farther);
  });
});

describe("computeWeights (RANK-011/014)", () => {
  it("PURE_RANDOM (NONE/HARD_MAX) assigns equal weight=1 to every eligible item", () => {
    const pool = [makeItem({ priceVnd: 20000 }), makeItem({ priceVnd: 200000 })];
    expect(computeWeights(pool, makeContext({ budgetMode: "NONE" }))).toEqual([1, 1]);
    expect(
      computeWeights(pool, makeContext({ budgetMode: "HARD_MAX", maxBudgetVnd: 500000 })),
    ).toEqual([1, 1]);
  });

  it("CUSTOM_FAIR: origin never changes computed weight when other fields match", () => {
    const bundled = makeItem({ origin: "BUNDLED", priceVnd: 40000 });
    const custom = makeItem({ origin: "CUSTOM", priceVnd: 40000 });
    const context = makeContext({ budgetMode: "TARGET", targetBudgetVnd: 40000 });
    const [bundledWeight, customWeight] = computeWeights([bundled, custom], context);
    expect(bundledWeight).toBe(customWeight);
  });
});
