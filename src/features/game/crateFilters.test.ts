import { describe, expect, it } from "vitest";
import { BUNDLED_CATALOG } from "@/data/catalog";
import { CRATES, cratesForKind, getCrateById } from "@/data/crates";
import { makeContext, makeItem } from "@/test/factories";
import { categoriesForCrate, eligibleForCrate, filtersForCrate, initialCrateId } from "./crateFilters";
import { INITIAL_GAME_STATE, applyRandomizerResult, landReel, updateDraftFilters } from "./gameMachine";
import { runRandomizer } from "@/features/randomizer/domain";

describe("crate/filter boundaries", () => {
  it.each(CRATES)("only exposes categories and candidates from $id", (crate) => {
    const categories = categoriesForCrate(crate);
    expect(categories.every((category) => category.kind === crate.filter.kind)).toBe(true);
    const pool = eligibleForCrate(BUNDLED_CATALOG, crate, filtersForCrate(crate, makeContext()));
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((item) => item.kind === crate.filter.kind && categories.some((c) => c.id === item.categoryId))).toBe(true);
    if (crate.id === "crate_drink") expect(pool.some((item) => item.categoryId === "co-con")).toBe(false);
  });
  it("switching from vegetarian food to drinks clears incompatible narrowing but keeps budget", () => {
    const next = filtersForCrate(getCrateById("crate_drink"), makeContext({ categoryIds: ["bun"], vegetarianOnly: true, budgetMode: "HARD_MAX", maxBudgetVnd: 30000 }));
    expect(next).toMatchObject({ kind: "DRINK", categoryIds: [], vegetarianOnly: false, budgetMode: "HARD_MAX", maxBudgetVnd: 30000 });
    expect(cratesForKind("DRINK").map((crate) => crate.id)).toEqual(["crate_drink", "crate_alcohol"]);
    expect(initialCrateId({ ...next, categoryIds: ["co-con"] })).toBe("crate_alcohol");
  });
  it("preview and counts honor the exact hard ceiling including zero and unknown prices", () => {
    const pool = [makeItem({priceVnd:null}),makeItem({priceVnd:20000}),makeItem({priceVnd:30000}),makeItem({kind:"DRINK",categoryId:"tra",priceVnd:10000})];
    const crate = getCrateById("crate_food");
    expect(eligibleForCrate(pool,crate,makeContext({budgetMode:"HARD_MAX",maxBudgetVnd:20000}))).toEqual([pool[1]]);
    expect(eligibleForCrate(pool,crate,makeContext({budgetMode:"HARD_MAX",maxBudgetVnd:0}))).toEqual([]);
  });
  it("changing kind after reveal clears the previous food result before displaying drink cards", () => {
    const result = runRandomizer({pool:[makeItem()],context:makeContext(),rng:()=>0});
    const spinning = applyRandomizerResult(INITIAL_GAME_STATE,result);
    expect(updateDraftFilters(spinning,{kind:"DRINK"})).toBe(spinning);
    const changed = updateDraftFilters(landReel(spinning),{kind:"DRINK",categoryIds:[]});
    expect(changed.phase).toBe("configuring");
    expect(changed.frozenSelection).toBeNull();
  });
});
