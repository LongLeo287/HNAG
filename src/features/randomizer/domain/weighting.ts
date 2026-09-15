import { RARITY_ORDER, type CandidateItem, type RarityTier } from "@/data/catalog";
import type { RandomizerContext } from "./types";

const UNKNOWN_PRICE_FIT = 0.25;
const TARGET_DECAY = 0.4;
const TARGET_WEIGHT_FLOOR = 0.1;
const TARGET_WEIGHT_EXPONENT = 1.5;
/** Within a tier, a specialty has half the weight of an otherwise equal ordinary dish. */
export const REGIONAL_SPECIALTY_WEIGHT = 0.5;

/** User-requested rarity balance, 2026-09-12. Total tier shares, not per-item multipliers. */
export const RARITY_BASE_SHARE: Readonly<Record<RarityTier, number>> = {
  THUONG: 0.8,
  NGON: 0.16,
  DINH: 0.035,
  HUYEN_THOAI: 0.005,
};

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
 * v2 supersedes uniform-per-item selection. Allocate each available tier its normalized
 * base share, then distribute within that tier. TARGET price fit cannot inflate a tier.
 * Eligibility and previous-winner exclusion must run first. Origin never changes a weight.
 */
export function computeWeights(eligible: CandidateItem[], context: RandomizerContext): number[] {
  const target = context.budgetMode === "TARGET" ? context.targetBudgetVnd : undefined;
  const itemWeights = eligible.map((item) => (item.regionalSpecialty ? REGIONAL_SPECIALTY_WEIGHT : 1)
    * (target === undefined ? 1 : targetWeight(item.priceVnd, target)));
  const tierTotals: Record<RarityTier, number> = { THUONG: 0, NGON: 0, DINH: 0, HUYEN_THOAI: 0 };
  eligible.forEach((item, i) => { tierTotals[item.rarity] += itemWeights[i]!; });
  const availableShare = RARITY_ORDER.reduce((sum, tier) => sum + (tierTotals[tier] > 0 ? RARITY_BASE_SHARE[tier] : 0), 0);
  return eligible.map((item, i) => RARITY_BASE_SHARE[item.rarity] / availableShare * itemWeights[i]! / tierTotals[item.rarity]);
}
