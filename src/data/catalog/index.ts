import { FOODS } from "./foods";
import { DRINKS } from "./drinks";
import { VIETNAM_CATALOG_ITEMS } from "./dataset";
import type { CandidateItem } from "./schema";
import { correctClassification } from "./classification-corrections";
import { withRegionalSpecialty } from "./regional-specialties";

export { FOODS, DRINKS, VIETNAM_CATALOG_ITEMS };
export * from "./schema";
export * from "./categories";
export * from "./dataset";

export const BUNDLED_CATALOG: CandidateItem[] = [
  ...FOODS,
  ...DRINKS,
  ...VIETNAM_CATALOG_ITEMS,
].map(correctClassification).map(withRegionalSpecialty);

export function bundledItemsForKind(kind: "FOOD" | "DRINK"): CandidateItem[] {
  return BUNDLED_CATALOG.filter((item) => item.kind === kind && item.enabled);
}
