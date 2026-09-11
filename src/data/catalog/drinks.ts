import type { CandidateItem } from "./schema";

// RS-037: bundled drink pool — same contract/rules as FOODS (RANK-002/003).
export const DRINKS: CandidateItem[] = [
  { id: "ca-phe-den-da", kind: "DRINK", name: "Cà phê đen đá", categoryId: "cafe", vegetarianPossible: true, priceVnd: 20000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "ca-phe-sua-da", kind: "DRINK", name: "Cà phê sữa đá", categoryId: "cafe", vegetarianPossible: true, priceVnd: 22000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "bac-xiu", kind: "DRINK", name: "Bạc xỉu", categoryId: "cafe", vegetarianPossible: true, priceVnd: 25000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "cold-brew", kind: "DRINK", name: "Cold brew", categoryId: "cafe", vegetarianPossible: true, priceVnd: 35000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "tra-sua-tran-chau-duong-den", kind: "DRINK", name: "Trà sữa trân châu đường đen", categoryId: "tra-sua", vegetarianPossible: true, priceVnd: 35000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "tra-sua-matcha", kind: "DRINK", name: "Trà sữa matcha", categoryId: "tra-sua", vegetarianPossible: true, priceVnd: 38000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "hong-tra-sua", kind: "DRINK", name: "Hồng trà sữa", categoryId: "tra-sua", vegetarianPossible: true, priceVnd: 30000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "tra-sua-full-topping", kind: "DRINK", name: "Trà sữa full topping đặc biệt", categoryId: "tra-sua", vegetarianPossible: true, priceVnd: 45000, rarity: "HUYEN_THOAI", origin: "BUNDLED", enabled: true },

  { id: "tra-dao-cam-sa", kind: "DRINK", name: "Trà đào cam sả", categoryId: "tra", vegetarianPossible: true, priceVnd: 30000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "tra-chanh", kind: "DRINK", name: "Trà chanh", categoryId: "tra", vegetarianPossible: true, priceVnd: 15000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "tra-atiso", kind: "DRINK", name: "Trà atiso", categoryId: "tra", vegetarianPossible: true, priceVnd: 20000, rarity: "THUONG", origin: "BUNDLED", enabled: true },

  { id: "nuoc-ep-cam", kind: "DRINK", name: "Nước ép cam", categoryId: "ep-sinh-to", vegetarianPossible: true, priceVnd: 25000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "nuoc-ep-dua-hau", kind: "DRINK", name: "Nước ép dưa hấu", categoryId: "ep-sinh-to", vegetarianPossible: true, priceVnd: 20000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "sinh-to-bo", kind: "DRINK", name: "Sinh tố bơ", categoryId: "ep-sinh-to", vegetarianPossible: true, priceVnd: 30000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "sinh-to-xoai", kind: "DRINK", name: "Sinh tố xoài", categoryId: "ep-sinh-to", vegetarianPossible: true, priceVnd: 28000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "nuoc-dua", kind: "DRINK", name: "Nước dừa", categoryId: "ep-sinh-to", vegetarianPossible: true, priceVnd: 20000, rarity: "THUONG", origin: "BUNDLED", enabled: true },

  { id: "matcha-da-xay", kind: "DRINK", name: "Matcha đá xay", categoryId: "da-xay", vegetarianPossible: true, priceVnd: 40000, rarity: "DINH", origin: "BUNDLED", enabled: true },
  { id: "socola-da-xay", kind: "DRINK", name: "Socola đá xay", categoryId: "da-xay", vegetarianPossible: true, priceVnd: 40000, rarity: "DINH", origin: "BUNDLED", enabled: true },
  { id: "caramel-da-xay", kind: "DRINK", name: "Caramel đá xay", categoryId: "da-xay", vegetarianPossible: true, priceVnd: 42000, rarity: "DINH", origin: "BUNDLED", enabled: true },

  // 2026-09-11 catalog expansion (user request) — extra coverage for tra/ep-sinh-to/da-xay/cafe.
  { id: "tra-sen", kind: "DRINK", name: "Trà sen", categoryId: "tra", vegetarianPossible: true, priceVnd: 25000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "tra-gung", kind: "DRINK", name: "Trà gừng", categoryId: "tra", vegetarianPossible: true, priceVnd: 18000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "tra-vai", kind: "DRINK", name: "Trà vải", categoryId: "tra", vegetarianPossible: true, priceVnd: 28000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "nuoc-ep-ca-rot", kind: "DRINK", name: "Nước ép cà rốt", categoryId: "ep-sinh-to", vegetarianPossible: true, priceVnd: 22000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "sinh-to-dau", kind: "DRINK", name: "Sinh tố dâu", categoryId: "ep-sinh-to", vegetarianPossible: true, priceVnd: 32000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "sinh-to-mit", kind: "DRINK", name: "Sinh tố mít", categoryId: "ep-sinh-to", vegetarianPossible: true, priceVnd: 30000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "tra-xanh-da-xay", kind: "DRINK", name: "Trà xanh đá xay", categoryId: "da-xay", vegetarianPossible: true, priceVnd: 40000, rarity: "DINH", origin: "BUNDLED", enabled: true },
  { id: "oreo-da-xay", kind: "DRINK", name: "Đá xay Oreo", categoryId: "da-xay", vegetarianPossible: true, priceVnd: 42000, rarity: "DINH", origin: "BUNDLED", enabled: true },

  { id: "espresso", kind: "DRINK", name: "Espresso", categoryId: "cafe", vegetarianPossible: true, priceVnd: 25000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "americano", kind: "DRINK", name: "Americano", categoryId: "cafe", vegetarianPossible: true, priceVnd: 28000, rarity: "NGON", origin: "BUNDLED", enabled: true },
];
