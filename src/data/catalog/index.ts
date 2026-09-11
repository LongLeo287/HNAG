import { FOODS } from "./foods";
import { DRINKS } from "./drinks";
import { VIETNAM_CATALOG_ITEMS } from "./dataset";
import type { CandidateItem } from "./schema";

export { FOODS, DRINKS, VIETNAM_CATALOG_ITEMS };
export * from "./schema";
export * from "./categories";
export * from "./dataset";

export const BUNDLED_CATALOG: CandidateItem[] = [
  ...FOODS,
  ...DRINKS,
  ...VIETNAM_CATALOG_ITEMS,
];

export function bundledItemsForKind(kind: "FOOD" | "DRINK"): CandidateItem[] {
  return BUNDLED_CATALOG.filter((item) => item.kind === kind);
}
