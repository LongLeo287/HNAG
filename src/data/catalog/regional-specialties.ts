import type { CandidateItem } from "./schema";

type Specialty = NonNullable<CandidateItem["regionalSpecialty"]>;
const regionalGuide = "https://vietnam.travel/things-to-do/vietnam-foodie-guide-region";
const hoiAnGuide = "https://vietnam.travel/things-to-do/explore-food-hoi-an";
const hueGuide = "https://www.vietnam.travel/vi/things-to-do/how-eat-local-hue";

/** Curated dish families supported by the linked tourism authority articles.
 * A cultural locality is not a GPS position or an assertion about nearby availability.
 * Province metadata alone never assigns this designation. See the provenance notes. */
export const REGIONAL_SPECIALTIES: readonly (Specialty & { itemIds: readonly string[] })[] = [
  { familyId: "bun-thang", locality: "Hà Nội", region: "NORTH", sourceUrl: regionalGuide,
    itemIds: ["hnag-0027"] },
  { familyId: "bun-bo-hue", locality: "Huế", region: "CENTRAL", sourceUrl: regionalGuide,
    itemIds: ["bun-bo-hue", "hnag-0240", "hnag-0241", "hnag-0409", "hnag-0689", "hnag-1279"] },
  { familyId: "mi-quang", locality: "Quảng Nam", region: "CENTRAL", sourceUrl: regionalGuide,
    itemIds: ["mi-quang", "hnag-0324", "hnag-0325", "hnag-0326", "hnag-0327", "hnag-0328", "hnag-0701", "hnag-1035", "hnag-1036", "hnag-1281"] },
  { familyId: "cao-lau", locality: "Hội An", region: "CENTRAL", sourceUrl: hoiAnGuide,
    itemIds: ["hnag-0316", "hnag-0317", "hnag-0318", "hnag-0319", "hnag-1038"] },
  { familyId: "com-ga-hoi-an", locality: "Hội An", region: "CENTRAL", sourceUrl: hoiAnGuide,
    itemIds: ["hnag-0320", "hnag-1037"] },
  { familyId: "com-tam", locality: "Nam Bộ", region: "SOUTH", sourceUrl: regionalGuide,
    itemIds: ["com-tam-suon-bi-cha", "hnag-0417", "hnag-0418", "hnag-0419", "hnag-0420", "hnag-0421", "hnag-0538", "hnag-0693", "hnag-1171", "hnag-1297"] },
  { familyId: "ca-kho-to", locality: "Đồng bằng sông Cửu Long", region: "SOUTH", sourceUrl: regionalGuide,
    itemIds: ["hnag-1396"] },
  { familyId: "banh-hue", locality: "Huế", region: "CENTRAL", sourceUrl: hueGuide,
    itemIds: ["hnag-0249", "hnag-0250", "hnag-1014", "hnag-1341"] },
];

const byId = new Map<string, Specialty>();
for (const { itemIds, ...specialty } of REGIONAL_SPECIALTIES) {
  for (const id of itemIds) byId.set(id, specialty);
}

export function withRegionalSpecialty(item: CandidateItem): CandidateItem {
  const specialty = byId.get(item.id);
  return specialty && item.kind === "FOOD" ? { ...item, regionalSpecialty: specialty } : item;
}
