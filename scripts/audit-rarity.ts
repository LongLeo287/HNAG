import { BUNDLED_CATALOG, RARITY_ORDER, type CandidateItem } from "../src/data/catalog/index";
import { CRATES, filterItemsForCrate } from "../src/data/crates";
import { filterItemsByContext } from "../src/features/context/contextEngine";
import type { ResolvedContext } from "../src/features/context/types";
import { computeWeights, runRandomizer, type RandomizerContext } from "../src/features/randomizer/domain/index";
import { seededRng } from "../src/test/seededRng";

// Reproducible current-catalog audit. Run with tsx --tsconfig tsconfig.app.json.
const smartContext: ResolvedContext = {
  mealTime: "BREAKFAST", weather: "SUNNY_HOT", dayType: "WEEKEND", location: "ALL", isAutoDetected: false,
};
const counts = (pool: CandidateItem[]) => Object.fromEntries(RARITY_ORDER.map((tier) => [tier, pool.filter((item) => item.rarity === tier).length]));
const iterations = 20_000;
const rows = CRATES.map((crate, index) => {
  const kindPool = BUNDLED_CATALOG.filter((item) => item.enabled && item.kind === crate.filter.kind);
  const pool = filterItemsForCrate(filterItemsByContext(kindPool, smartContext), crate);
  const context: RandomizerContext = { ...crate.filter, budgetMode: "NONE" };
  const weights = computeWeights(pool, context);
  const expectedPercent = Object.fromEntries(RARITY_ORDER.map((tier) => [tier,
    Number((100 * pool.reduce((sum, item, i) => sum + (item.rarity === tier ? weights[i]! : 0), 0)).toFixed(4)),
  ]));
  const rng = seededRng(20260912 + index);
  const observed = Object.fromEntries(RARITY_ORDER.map((tier) => [tier, 0]));
  let previousWinnerId: string | null = null;
  for (let i = 0; i < iterations; i++) {
    const result = runRandomizer({ pool, context: { ...context, previousWinnerId }, rng });
    if (result.status !== "OK") throw new Error(`Unexpected empty crate: ${crate.id}`);
    observed[result.selection.winner.rarity]! += 1;
    previousWinnerId = result.selection.winner.id;
  }
  for (const tier of RARITY_ORDER) {
    const probability = expectedPercent[tier]! / 100;
    const tolerance = 6 * Math.sqrt(iterations * probability * (1 - probability)) + 1;
    if (Math.abs(observed[tier]! - iterations * probability) > tolerance) {
      throw new Error(`Distribution outside six-sigma tolerance: ${crate.id}/${tier}`);
    }
  }
  return { crate: crate.id, eligible: pool.length, tierCounts: counts(pool),
    oldUniformHighTierPercent: Number((100 * pool.filter((item) => ["DINH", "HUYEN_THOAI"].includes(item.rarity)).length / pool.length).toFixed(4)),
    expectedPercent, draws: iterations, observed,
    observedPercent: Object.fromEntries(RARITY_ORDER.map((tier) => [tier, 100 * observed[tier]! / iterations])),
  };
});
console.log(JSON.stringify({ catalogSize: BUNDLED_CATALOG.length, catalogTierCounts: counts(BUNDLED_CATALOG), smartContext, rows }, null, 2));
