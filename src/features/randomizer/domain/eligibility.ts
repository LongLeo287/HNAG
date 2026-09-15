import type { CandidateItem } from "@/data/catalog";
import type { FilterBlockerCode, FilterDiagnostics, RandomizerContext } from "./types";

/**
 * RANK-004..010: hard eligibility filters. Every step here is a HARD filter —
 * nothing is silently relaxed. The caller (engine.ts) decides what NO_CANDIDATES means for the UI.
 */
export function applyHardFilters(
  pool: CandidateItem[],
  context: RandomizerContext,
): { eligible: CandidateItem[]; diagnostics: FilterDiagnostics } {
  const blockers: FilterBlockerCode[] = [];
  const startCount = pool.length;

  const byKind = pool.filter((item) => item.enabled && item.kind === context.kind);
  if (byKind.length === 0) blockers.push("NO_CANDIDATES_KIND");

  const byCategory =
    context.categoryIds.length === 0
      ? byKind
      : byKind.filter((item) => context.categoryIds.includes(item.categoryId));
  if (byKind.length > 0 && byCategory.length === 0) blockers.push("NO_CANDIDATES_CATEGORY");

  const byVegetarian = context.vegetarianOnly
    ? byCategory.filter((item) => item.vegetarianPossible)
    : byCategory;
  if (byCategory.length > 0 && byVegetarian.length === 0) blockers.push("NO_CANDIDATES_VEGETARIAN");

  const byBudget = applyBudgetHardMax(byVegetarian, context);
  if (byVegetarian.length > 0 && byBudget.length === 0) blockers.push("NO_CANDIDATES_BUDGET");

  return {
    eligible: byBudget,
    diagnostics: {
      startCount,
      afterKind: byKind.length,
      afterCategory: byCategory.length,
      afterVegetarian: byVegetarian.length,
      afterBudget: byBudget.length,
      blockers,
    },
  };
}

/** RANK-010: HARD_MAX keeps only items with a KNOWN price at or under the cap. Unknown price is excluded, never treated as 0. */
function applyBudgetHardMax(pool: CandidateItem[], context: RandomizerContext): CandidateItem[] {
  if (context.budgetMode !== "HARD_MAX") return pool;
  const cap = context.maxBudgetVnd;
  if (cap === undefined) return pool;
  return pool.filter((item) => item.priceVnd !== null && item.priceVnd <= cap);
}

/** v2: exclude the previous item only when its tier has an alternative; never force a rarer tier. */
export function applyRespinExclusion(
  eligible: CandidateItem[],
  previousWinnerId: string | null | undefined,
): CandidateItem[] {
  if (!previousWinnerId || eligible.length <= 1) return eligible;
  const previous = eligible.find((item) => item.id === previousWinnerId);
  if (!previous || !eligible.some((item) => item.id !== previous.id && item.rarity === previous.rarity)) return eligible;
  const withoutPrevious = eligible.filter((item) => item.id !== previousWinnerId);
  return withoutPrevious.length > 0 ? withoutPrevious : eligible;
}

/** RANK-017: stable ascending sort by id so seeded draws replay deterministically. */
export function stableSortById(pool: CandidateItem[]): CandidateItem[] {
  return [...pool].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
