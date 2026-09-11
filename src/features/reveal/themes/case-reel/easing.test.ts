import { describe, expect, it } from "vitest";
import { easeSpin } from "./easing";

describe("easeSpin", () => {
  it("starts at exactly 0 and ends at exactly 1", () => {
    expect(easeSpin(0)).toBe(0);
    expect(easeSpin(1)).toBeCloseTo(1, 12);
  });

  it("is monotonically non-decreasing (no visual backtracking)", () => {
    let previous = -Infinity;
    for (let t = 0; t <= 1; t += 0.02) {
      const value = easeSpin(t);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("front-loads movement (fast start, slow finish)", () => {
    const firstHalf = easeSpin(0.5) - easeSpin(0);
    const secondHalf = easeSpin(1) - easeSpin(0.5);
    expect(firstHalf).toBeGreaterThan(secondHalf);
  });
});

describe("createSpinProfile", () => {
  it("stays within the 5.5-7.5s product window for normal motion", async () => {
    const { createSpinProfile } = await import("./spinProfile");
    for (const sample of [0, 0.25, 0.5, 0.75, 0.999]) {
      const profile = createSpinProfile(false, () => sample);
      expect(profile.durationMs).toBeGreaterThanOrEqual(5500);
      expect(profile.durationMs).toBeLessThanOrEqual(7500);
    }
  });

  it("reduced motion always resolves to the short non-sliding duration", async () => {
    const { createSpinProfile } = await import("./spinProfile");
    const profile = createSpinProfile(true);
    expect(profile.durationMs).toBeLessThanOrEqual(600);
  });
});
