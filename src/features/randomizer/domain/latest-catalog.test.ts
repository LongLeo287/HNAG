import { describe, expect, it } from "vitest";
import { BUNDLED_CATALOG, RARITY_ORDER } from "@/data/catalog";
import { CRATES, filterItemsForCrate } from "@/data/crates";
import { filterItemsByContext } from "@/features/context/contextEngine";
import type { ResolvedContext } from "@/features/context/types";
import { applyHardFilters, applyRespinExclusion } from "./eligibility";
import { computeWeights } from "./weighting";
import { runRandomizer } from "./engine";
import type { RandomizerContext } from "./types";

const shares = [0.8, 0.16, 0.035, 0.005];
const meals: ResolvedContext["mealTime"][] = ["BREAKFAST", "LUNCH", "AFTERNOON", "DINNER", "LATE_NIGHT"];
const weathers: ResolvedContext["weather"][] = ["SUNNY_HOT", "RAINY_COOL", "MILD"];

describe("current expanded catalog and crate probabilities", () => {
  it("uses the expanded catalog, including separate food/drink/alcohol crates and contextual metadata", () => {
    expect(BUNDLED_CATALOG).toHaveLength(1731);
    expect(CRATES).toHaveLength(6);
    expect(BUNDLED_CATALOG.filter((item) => item.mealTimes?.length)).toHaveLength(1654);
  });

  it.each(CRATES)("keeps tier shares through context, budget and repeat filters: $id", (crate) => {
    const kindPool = BUNDLED_CATALOG.filter((item) => item.enabled && item.kind === crate.filter.kind);
    for (const mealTime of meals) for (const weather of weathers) for (const location of ["ALL", "Hà Nội", "TP. Hồ Chí Minh"]) {
      const contextual = filterItemsByContext(kindPool, { mealTime, weather, location, dayType: "WEEKEND", isAutoDetected: false });
      const cratePool = filterItemsForCrate(contextual, crate);
      for (const budgetMode of ["NONE", "TARGET", "HARD_MAX"] as const) {
        const context: RandomizerContext = { ...crate.filter, budgetMode, targetBudgetVnd: 150000, maxBudgetVnd: 30000 };
        const { eligible } = applyHardFilters(cratePool, context);
        const afterRepeat = applyRespinExclusion(eligible, eligible[0]?.id);
        expect(new Set(afterRepeat.map((item) => item.rarity))).toEqual(new Set(eligible.map((item) => item.rarity)));
        const weights = computeWeights(afterRepeat, context);
        if (afterRepeat.length === 0) {
          expect(runRandomizer({ pool: cratePool, context, rng: () => 0.5 }).status).toBe("NO_CANDIDATES");
          continue;
        }
        expect(weights.every((weight) => Number.isFinite(weight) && weight > 0)).toBe(true);
        expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 12);
        const availableShare = RARITY_ORDER.reduce((sum, tier, i) => sum + (afterRepeat.some((item) => item.rarity === tier) ? shares[i]! : 0), 0);
        RARITY_ORDER.forEach((tier, i) => {
          const actual = afterRepeat.reduce((sum, item, j) => sum + (item.rarity === tier ? weights[j]! : 0), 0);
          const expected = afterRepeat.some((item) => item.rarity === tier) ? shares[i]! / availableShare : 0;
          expect(actual).toBeCloseTo(expected, 12);
        });
        // Real engine selection must match the same frozen distribution and never escape the pool.
        const result = runRandomizer({ pool: cratePool, context: { ...context, previousWinnerId: eligible[0]?.id }, rng: () => 0.975 });
        expect(result.status).toBe("OK");
        if (result.status === "OK") {
          expect(afterRepeat.map((item) => item.id)).toContain(result.selection.winner.id);
          expect(result.selection.probabilities).toEqual(computeWeights(result.selection.eligiblePool, context));
        }
      }
    }
  });
});
