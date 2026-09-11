import type { Category } from "./schema";

// FEAT-006 category taxonomy. Extensible list, not a public browse taxonomy —
// it only narrows the randomizer pool (RANK-005).
export const CATEGORIES: Category[] = [
  { id: "com", kind: "FOOD", label: "Cơm" },
  { id: "bun", kind: "FOOD", label: "Bún" },
  { id: "pho-mi", kind: "FOOD", label: "Phở & Mì" },
  { id: "chao-sup", kind: "FOOD", label: "Cháo & Súp" },
  { id: "lau-nuong", kind: "FOOD", label: "Lẩu & Nướng" },
  { id: "banh", kind: "FOOD", label: "Bánh" },
  { id: "an-vat", kind: "FOOD", label: "Ăn vặt" },
  { id: "fastfood", kind: "FOOD", label: "Đồ Âu / Fastfood" },

  { id: "cafe", kind: "DRINK", label: "Cà phê" },
  { id: "tra-sua", kind: "DRINK", label: "Trà sữa" },
  { id: "tra", kind: "DRINK", label: "Trà" },
  { id: "ep-sinh-to", kind: "DRINK", label: "Nước ép & Sinh tố" },
  { id: "da-xay", kind: "DRINK", label: "Đá xay" },
];

export function categoriesForKind(kind: "FOOD" | "DRINK"): Category[] {
  return CATEGORIES.filter((c) => c.kind === kind);
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
