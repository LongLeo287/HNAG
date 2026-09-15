import { describe, expect, it } from "vitest";
import { makeContext, makeItem } from "@/test/factories";
import { computeWeights } from "./weighting";

const regionalSpecialty = { familyId:"bun-bo-hue",locality:"Huế",region:"CENTRAL" as const,sourceUrl:"https://vietnam.travel/things-to-do/vietnam-foodie-guide-region" };
describe("regional specialty frequency", () => {
  it.each(["NONE","HARD_MAX","TARGET"] as const)("halves within-tier weight without raising high-tier shares in %s mode", (budgetMode) => {
    const pool = [makeItem(),makeItem({regionalSpecialty}),makeItem({rarity:"NGON"}),makeItem({rarity:"DINH"}),makeItem({rarity:"HUYEN_THOAI"})];
    const weights = computeWeights(pool,makeContext({budgetMode,targetBudgetVnd:30000,maxBudgetVnd:30000}));
    expect(weights[0]! / weights[1]!).toBeCloseTo(2,12);
    expect(weights[0]! + weights[1]!).toBeCloseTo(.8,12);
    expect(weights.slice(2)).toEqual([.16,.035,.005]);
  });
  it("normalizes an all-specialty or single-item pool without claiming a fixed percentage", () => {
    expect(computeWeights([makeItem({regionalSpecialty})],makeContext())).toEqual([1]);
    expect(computeWeights([makeItem({regionalSpecialty}),makeItem({regionalSpecialty})],makeContext())).toEqual([.5,.5]);
  });
});
