import type { Category } from "./schema";

// FEAT-006 category taxonomy. Extensible list, not a public browse taxonomy —
// it only narrows the randomizer pool (RANK-005).
export const CATEGORIES: Category[] = [
  { id: "com", kind: "FOOD", label: "Cơm & Xôi" },
  { id: "bun", kind: "FOOD", label: "Bún" },
  { id: "pho-mi", kind: "FOOD", label: "Phở & Mì" },
  { id: "chao-sup", kind: "FOOD", label: "Cháo & Súp" },
  { id: "lau-nuong", kind: "FOOD", label: "Lẩu & Nướng" },
  { id: "banh", kind: "FOOD", label: "Bánh" },
  { id: "an-vat", kind: "FOOD", label: "Ăn vặt" },
  { id: "fastfood", kind: "FOOD", label: "Đồ Âu / Fastfood" },
  { id: "banh-mi", kind: "FOOD", label: "Bánh mì" },
  { id: "mon-man", kind: "FOOD", label: "Món mặn & ăn kèm" },
  { id: "trang-mieng", kind: "FOOD", label: "Tráng miệng" },

  { id: "cafe", kind: "DRINK", label: "Cà phê" },
  { id: "tra-sua", kind: "DRINK", label: "Trà sữa" },
  { id: "tra", kind: "DRINK", label: "Trà" },
  { id: "ep-sinh-to", kind: "DRINK", label: "Nước ép & Sinh tố" },
  { id: "da-xay", kind: "DRINK", label: "Đá xay" },
  { id: "nuoc-khac", kind: "DRINK", label: "Sữa & nước giải khát" },
  { id: "co-con", kind: "DRINK", label: "Đồ uống có cồn" },
];

export function categoriesForKind(kind: "FOOD" | "DRINK"): Category[] {
  return CATEGORIES.filter((c) => c.kind === kind);
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
