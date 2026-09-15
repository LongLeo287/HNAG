import { categoriesForKind, type CandidateItem } from "@/data/catalog";
import { CRATES, DEFAULT_CRATE_ID, filterItemsForCrate, type CrateDefinition, type CrateId } from "@/data/crates";
import { applyHardFilters, type RandomizerContext } from "@/features/randomizer/domain";

export function initialCrateId(filters: RandomizerContext): CrateId {
  if (filters.kind === "DRINK") return filters.categoryIds.includes("co-con") ? "crate_alcohol" : "crate_drink";
  if (filters.vegetarianOnly) return "crate_vegetarian";
  const matching = CRATES.find((crate) => crate.filter.kind === "FOOD" &&
    !crate.filter.vegetarianOnly && filters.categoryIds.length > 0 &&
    filters.categoryIds.every((id) => crate.filter.categoryIds.includes(id)));
  return matching?.id ?? DEFAULT_CRATE_ID;
}

export function categoriesForCrate(crate: CrateDefinition) {
  return categoriesForKind(crate.filter.kind).filter((category) =>
    crate.filter.categoryIds.length === 0 || crate.filter.categoryIds.includes(category.id));
}

/** Selecting a crate clears prior category/vegetarian narrowing but preserves budget. */
export function filtersForCrate(crate: CrateDefinition, filters: RandomizerContext): RandomizerContext {
  return { ...filters, kind: crate.filter.kind, categoryIds: [], vegetarianOnly: crate.filter.vegetarianOnly };
}

/** The preview, count and draw all use the domain's exact hard-filter contract. */
export function eligibleForCrate(pool: CandidateItem[], crate: CrateDefinition, filters: RandomizerContext): CandidateItem[] {
  return applyHardFilters(filterItemsForCrate(pool, crate), filters).eligible;
}
