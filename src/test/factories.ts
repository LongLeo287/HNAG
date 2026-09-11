import type { CandidateItem } from "@/data/catalog";
import type { RandomizerContext } from "@/features/randomizer/domain";

let counter = 0;

export function makeItem(overrides: Partial<CandidateItem> = {}): CandidateItem {
  counter += 1;
  return {
    id: `test-item-${counter}`,
    kind: "FOOD",
    name: `Test Item ${counter}`,
    categoryId: "com",
    vegetarianPossible: false,
    priceVnd: 30000,
    rarity: "THUONG",
    origin: "BUNDLED",
    enabled: true,
    ...overrides,
  };
}

export function makeContext(overrides: Partial<RandomizerContext> = {}): RandomizerContext {
  return {
    kind: "FOOD",
    categoryIds: [],
    vegetarianOnly: false,
    budgetMode: "NONE",
    ...overrides,
  };
}

export function resetItemCounter(): void {
  counter = 0;
}
