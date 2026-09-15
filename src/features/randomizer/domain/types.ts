import type { CandidateItem, ItemKind } from "@/data/catalog";

// RS-019: pure domain types. No React/DOM/storage/audio imports allowed in this folder
// (enforced by scripts/check-boundaries.ts).

export type BudgetMode = "NONE" | "HARD_MAX" | "TARGET";

export interface RandomizerContext {
  kind: ItemKind;
  categoryIds: string[];
  vegetarianOnly: boolean;
  budgetMode: BudgetMode;
  maxBudgetVnd?: number;
  targetBudgetVnd?: number;
  /** v2 re-spin exclusion within a tier. Null/undefined on the first spin. */
  previousWinnerId?: string | null;
}

export type FilterBlockerCode =
  | "NO_CANDIDATES_KIND"
  | "NO_CANDIDATES_CATEGORY"
  | "NO_CANDIDATES_VEGETARIAN"
  | "NO_CANDIDATES_BUDGET";

export interface FilterDiagnostics {
  startCount: number;
  afterKind: number;
  afterCategory: number;
  afterVegetarian: number;
  afterBudget: number;
  blockers: FilterBlockerCode[];
}

export interface DrawOdds {
  eligiblePool: CandidateItem[];
  /** Actual draw probabilities aligned with eligiblePool; sum to 1 for a nonempty pool. */
  probabilities: number[];
}

export interface FrozenSelection extends DrawOdds {
  /** Bumped only on an incompatible domain-contract change. */
  algorithmVersion: "randomizer-v2.1.0";
  winner: CandidateItem;
  context: RandomizerContext;
  frozenAtMs: number;
}

export type RandomizerResult =
  | { status: "OK"; selection: FrozenSelection }
  | { status: "NO_CANDIDATES"; diagnostics: FilterDiagnostics };

/** Injected uniform RNG in [0, 1). Production uses crypto; tests inject a seeded PRNG. */
export type UniformRng = () => number;
