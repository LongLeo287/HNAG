import type { CandidateItem } from "@/data/catalog";
import type { RandomizerContext } from "./types";

const UNKNOWN_PRICE_FIT = 0.25;
const TARGET_DECAY = 0.4;
const TARGET_WEIGHT_FLOOR = 0.1;
const TARGET_WEIGHT_EXPONENT = 1.5;

/** RANK-012: TARGET priceFit — known prices decay from 1.0 as they move away (log-symmetric) from the target. */
export function priceFit(priceVnd: number | null, targetBudgetVnd: number): number {
  if (priceVnd === null) return UNKNOWN_PRICE_FIT;
  return Math.exp(-Math.abs(Math.log(priceVnd / targetBudgetVnd)) / TARGET_DECAY);
}

/** RANK-013: every eligible item keeps a non-zero chance, even far from the target. */
export function targetWeight(priceVnd: number | null, targetBudgetVnd: number): number {
  const fit = priceFit(priceVnd, targetBudgetVnd);
  return Math.max(TARGET_WEIGHT_FLOOR, fit) ** TARGET_WEIGHT_EXPONENT;
}

/**
 * RANK-011/012/014: NONE and HARD_MAX are PURE_RANDOM (weight=1 for every eligible item,
 * bundled or custom — CUSTOM_FAIR). TARGET is the only weighted mode.
 */
export function computeWeights(eligible: CandidateItem[], context: RandomizerContext): number[] {
  if (context.budgetMode === "TARGET" && context.targetBudgetVnd !== undefined) {
    const target = context.targetBudgetVnd;
    return eligible.map((item) => targetWeight(item.priceVnd, target));
  }
  return eligible.map(() => 1);
}
