import { z } from "zod";

// CODE-007 / CANDIDATE ITEM CONTRACT: runtime-validated shape for bundled + custom items.
// Kept intentionally small — this is randomizer input, not a public food-graph schema (PV-006, RS-037).

export const ItemKind = z.enum(["FOOD", "DRINK"]);
export type ItemKind = z.infer<typeof ItemKind>;

export const RarityTier = z.enum(["THUONG", "NGON", "DINH", "HUYEN_THOAI"]);
export type RarityTier = z.infer<typeof RarityTier>;

// RANK-029: rarity is presentation flavor only. Order here is display order, not a value ranking.
export const RARITY_ORDER: readonly RarityTier[] = ["THUONG", "NGON", "DINH", "HUYEN_THOAI"];

export const RARITY_LABEL: Record<RarityTier, string> = {
  THUONG: "Thường",
  NGON: "Ngon",
  DINH: "Đỉnh",
  HUYEN_THOAI: "Huyền Thoại",
};

// Integer VND. Unknown price is null — RANK-009 forbids inferring 0.
const priceVnd = z
  .number()
  .int()
  .positive()
  .max(5_000_000)
  .nullable();

export const CandidateItemSchema = z.object({
  id: z.string().min(1).max(64),
  kind: ItemKind,
  name: z.string().min(1).max(70),
  categoryId: z.string().min(1).max(40),
  vegetarianPossible: z.boolean(),
  priceVnd,
  rarity: RarityTier,
  origin: z.enum(["BUNDLED", "CUSTOM"]),
  enabled: z.boolean(),
  // Optional contextual metadata:
  province: z.string().optional(),
  region: z.string().optional(),
  mealTimes: z.array(z.string()).optional(),
  weatherSuitability: z.enum(["ANY", "RAINY_COOL", "SUNNY_HOT"]).optional(),
  daySuitability: z.enum(["ANY", "WEEKDAY", "WEEKEND"]).optional(),
  description: z.string().optional(),
});
export type CandidateItem = z.infer<typeof CandidateItemSchema>;

export const CategorySchema = z.object({
  id: z.string().min(1).max(40),
  kind: ItemKind,
  label: z.string().min(1).max(40),
});
export type Category = z.infer<typeof CategorySchema>;

export const BundledCatalogSchema = z.array(CandidateItemSchema);
