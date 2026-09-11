import type { CandidateItem } from "./schema";

// RS-037: bundled, validated candidate pool. Generic Vietnamese dish names only —
// no merchant/venue data, no scraped content. Prices are typical casual-dining VND, illustrative.
// pnpm validate:catalog enforces the schema in scripts/validate-catalog.ts.
export const FOODS: CandidateItem[] = [
  { id: "com-tam-suon-bi-cha", kind: "FOOD", name: "Cơm tấm sườn bì chả", categoryId: "com", vegetarianPossible: false, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "com-ga-xoi-mo", kind: "FOOD", name: "Cơm gà xối mỡ", categoryId: "com", vegetarianPossible: false, priceVnd: 40000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "com-chay-thap-cam", kind: "FOOD", name: "Cơm chay thập cẩm", categoryId: "com", vegetarianPossible: true, priceVnd: 30000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "com-rang-dua-bo", kind: "FOOD", name: "Cơm rang dưa bò", categoryId: "com", vegetarianPossible: false, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "com-nieu-ca-kho", kind: "FOOD", name: "Cơm niêu cá kho", categoryId: "com", vegetarianPossible: false, priceVnd: 45000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "bun-cha", kind: "FOOD", name: "Bún chả", categoryId: "bun", vegetarianPossible: false, priceVnd: 40000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "bun-bo-hue", kind: "FOOD", name: "Bún bò Huế", categoryId: "bun", vegetarianPossible: false, priceVnd: 45000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "bun-dau-mam-tom", kind: "FOOD", name: "Bún đậu mắm tôm", categoryId: "bun", vegetarianPossible: true, priceVnd: 40000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "bun-rieu", kind: "FOOD", name: "Bún riêu", categoryId: "bun", vegetarianPossible: true, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "bun-thit-nuong", kind: "FOOD", name: "Bún thịt nướng", categoryId: "bun", vegetarianPossible: false, priceVnd: 40000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "bun-mam", kind: "FOOD", name: "Bún mắm", categoryId: "bun", vegetarianPossible: false, priceVnd: 45000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "pho-bo", kind: "FOOD", name: "Phở bò", categoryId: "pho-mi", vegetarianPossible: false, priceVnd: 45000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "pho-ga", kind: "FOOD", name: "Phở gà", categoryId: "pho-mi", vegetarianPossible: false, priceVnd: 40000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "mi-quang", kind: "FOOD", name: "Mì Quảng", categoryId: "pho-mi", vegetarianPossible: false, priceVnd: 40000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "hu-tieu-nam-vang", kind: "FOOD", name: "Hủ tiếu Nam Vang", categoryId: "pho-mi", vegetarianPossible: false, priceVnd: 40000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "mi-xao-gion", kind: "FOOD", name: "Mì xào giòn", categoryId: "pho-mi", vegetarianPossible: true, priceVnd: 45000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "chao-long", kind: "FOOD", name: "Cháo lòng", categoryId: "chao-sup", vegetarianPossible: false, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "chao-ga", kind: "FOOD", name: "Cháo gà", categoryId: "chao-sup", vegetarianPossible: false, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "sup-cua", kind: "FOOD", name: "Súp cua", categoryId: "chao-sup", vegetarianPossible: false, priceVnd: 30000, rarity: "THUONG", origin: "BUNDLED", enabled: true },

  { id: "lau-thai-hai-san", kind: "FOOD", name: "Lẩu thái hải sản", categoryId: "lau-nuong", vegetarianPossible: false, priceVnd: 150000, rarity: "HUYEN_THOAI", origin: "BUNDLED", enabled: true },
  { id: "nuong-bbq-vi", kind: "FOOD", name: "Nướng BBQ vỉ", categoryId: "lau-nuong", vegetarianPossible: false, priceVnd: 120000, rarity: "DINH", origin: "BUNDLED", enabled: true },
  { id: "ga-nuong-mat-ong", kind: "FOOD", name: "Gà nướng mật ong", categoryId: "lau-nuong", vegetarianPossible: false, priceVnd: 90000, rarity: "DINH", origin: "BUNDLED", enabled: true },
  { id: "oc-cac-loai", kind: "FOOD", name: "Ốc các loại", categoryId: "lau-nuong", vegetarianPossible: false, priceVnd: 60000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "banh-mi-thit", kind: "FOOD", name: "Bánh mì thịt", categoryId: "banh", vegetarianPossible: true, priceVnd: 20000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "banh-xeo", kind: "FOOD", name: "Bánh xèo", categoryId: "banh", vegetarianPossible: true, priceVnd: 35000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "banh-cuon", kind: "FOOD", name: "Bánh cuốn", categoryId: "banh", vegetarianPossible: true, priceVnd: 30000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "banh-canh-cua", kind: "FOOD", name: "Bánh canh cua", categoryId: "banh", vegetarianPossible: false, priceVnd: 40000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "goi-cuon", kind: "FOOD", name: "Gỏi cuốn", categoryId: "an-vat", vegetarianPossible: true, priceVnd: 30000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "banh-trang-tron", kind: "FOOD", name: "Bánh tráng trộn", categoryId: "an-vat", vegetarianPossible: true, priceVnd: 20000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "xoi-man", kind: "FOOD", name: "Xôi mặn", categoryId: "an-vat", vegetarianPossible: false, priceVnd: 20000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "che-thap-cam", kind: "FOOD", name: "Chè thập cẩm", categoryId: "an-vat", vegetarianPossible: true, priceVnd: 20000, rarity: "THUONG", origin: "BUNDLED", enabled: true },

  { id: "pizza-phan", kind: "FOOD", name: "Pizza phần", categoryId: "fastfood", vegetarianPossible: true, priceVnd: 45000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "ga-ran-phan", kind: "FOOD", name: "Gà rán phần", categoryId: "fastfood", vegetarianPossible: false, priceVnd: 50000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "burger-bo", kind: "FOOD", name: "Burger bò", categoryId: "fastfood", vegetarianPossible: false, priceVnd: 45000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  // 2026-09-11 catalog expansion (user request) — same rules as above: generic dish names only.
  { id: "com-ga-luoc", kind: "FOOD", name: "Cơm gà luộc", categoryId: "com", vegetarianPossible: false, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "com-suon-nuong", kind: "FOOD", name: "Cơm sườn nướng", categoryId: "com", vegetarianPossible: false, priceVnd: 40000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "bun-oc", kind: "FOOD", name: "Bún ốc", categoryId: "bun", vegetarianPossible: false, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "bun-ca", kind: "FOOD", name: "Bún cá", categoryId: "bun", vegetarianPossible: false, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },

  { id: "pho-tai-nam", kind: "FOOD", name: "Phở tái nạm", categoryId: "pho-mi", vegetarianPossible: false, priceVnd: 50000, rarity: "NGON", origin: "BUNDLED", enabled: true },
  { id: "mi-vit-tiem", kind: "FOOD", name: "Mì vịt tiềm", categoryId: "pho-mi", vegetarianPossible: false, priceVnd: 55000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "chao-thap-cam", kind: "FOOD", name: "Cháo thập cẩm", categoryId: "chao-sup", vegetarianPossible: false, priceVnd: 30000, rarity: "THUONG", origin: "BUNDLED", enabled: true },

  { id: "lau-bo", kind: "FOOD", name: "Lẩu bò", categoryId: "lau-nuong", vegetarianPossible: false, priceVnd: 130000, rarity: "HUYEN_THOAI", origin: "BUNDLED", enabled: true },
  { id: "muc-nuong-sa-te", kind: "FOOD", name: "Mực nướng sa tế", categoryId: "lau-nuong", vegetarianPossible: false, priceVnd: 80000, rarity: "DINH", origin: "BUNDLED", enabled: true },

  { id: "banh-beo", kind: "FOOD", name: "Bánh bèo", categoryId: "banh", vegetarianPossible: true, priceVnd: 25000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "banh-khot", kind: "FOOD", name: "Bánh khọt", categoryId: "banh", vegetarianPossible: true, priceVnd: 30000, rarity: "THUONG", origin: "BUNDLED", enabled: true },

  { id: "cha-gio", kind: "FOOD", name: "Chả giò", categoryId: "an-vat", vegetarianPossible: false, priceVnd: 25000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
  { id: "nem-nuong", kind: "FOOD", name: "Nem nướng", categoryId: "an-vat", vegetarianPossible: false, priceVnd: 35000, rarity: "NGON", origin: "BUNDLED", enabled: true },

  { id: "hot-dog", kind: "FOOD", name: "Hot dog", categoryId: "fastfood", vegetarianPossible: false, priceVnd: 35000, rarity: "THUONG", origin: "BUNDLED", enabled: true },
];
