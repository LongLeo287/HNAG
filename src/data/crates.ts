import type { CandidateItem, ItemKind } from "./catalog";

export type CrateId =
  | "crate_food"
  | "crate_drink"
  | "crate_alcohol"
  | "crate_snack"
  | "crate_drinking"
  | "crate_vegetarian";

export interface CrateTheme {
  primaryHex: string;
  glowClass: string;
  activeBorderClass: string;
  idleBorderClass: string;
  bgGradient: string;
  textAccentClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  lightConeClass: string;
  lidRayClass: string;
}

export interface CrateDefinition {
  id: CrateId;
  name: string;
  shortName: string;
  codeName: string;
  tagline: string;
  description: string;
  icon: string;
  imageSrc: string;
  theme: CrateTheme;
  filter: {
    kind: ItemKind;
    categoryIds: string[];
    vegetarianOnly: boolean;
  };
}

const BASE_CRATES: readonly CrateDefinition[] = [
  {
    id: "crate_food",
    name: "Hòm Bữa Chính",
    shortName: "Đồ Ăn",
    codeName: "CASE // FOOD-01",
    tagline: "Cơm, bún, phở, mì nóng hổi",
    description: "Tuyển tập món chính đậm đà chuẩn vị bữa sáng & trưa Việt Nam",
    icon: "🍱",
    imageSrc: "/images/crates/food.jpg",
    theme: {
      primaryHex: "#F59E0B",
      glowClass: "shadow-[0_0_25px_rgba(245,158,11,0.35)]",
      activeBorderClass: "border-amber-400 ring-2 ring-amber-400/40",
      idleBorderClass: "border-amber-500/25 hover:border-amber-400/60",
      bgGradient: "from-amber-500/20 via-amber-950/30 to-canvas-100",
      textAccentClass: "text-amber-400",
      badgeBgClass: "bg-amber-500/20 border-amber-500/40",
      badgeTextClass: "text-amber-300",
      lightConeClass: "bg-amber-400/15",
      lidRayClass: "from-amber-400/40 via-yellow-300/20 to-transparent",
    },
    filter: {
      kind: "FOOD",
      categoryIds: ["com", "bun", "pho-mi", "chao-sup", "banh-mi", "mon-man", "fastfood"],
      vegetarianOnly: false,
    },
  },
  {
    id: "crate_drink",
    name: "Hòm Giải Khát",
    shortName: "Đồ Uống",
    codeName: "CASE // DRINK-02",
    tagline: "Trà sữa, cà phê, sinh tố tươi mát",
    description: "Giải nhiệt sảng khoái tức thì cùng các loại trà, cà phê và đá xay đỉnh cao",
    icon: "🧋",
    imageSrc: "/images/crates/drink.jpg",
    theme: {
      primaryHex: "#06B6D4",
      glowClass: "shadow-[0_0_25px_rgba(6,182,212,0.35)]",
      activeBorderClass: "border-cyan-400 ring-2 ring-cyan-400/40",
      idleBorderClass: "border-cyan-500/25 hover:border-cyan-400/60",
      bgGradient: "from-cyan-500/20 via-cyan-950/30 to-canvas-100",
      textAccentClass: "text-cyan-400",
      badgeBgClass: "bg-cyan-500/20 border-cyan-500/40",
      badgeTextClass: "text-cyan-300",
      lightConeClass: "bg-cyan-400/15",
      lidRayClass: "from-cyan-400/40 via-sky-300/20 to-transparent",
    },
    filter: {
      kind: "DRINK",
      categoryIds: ["cafe", "tra-sua", "tra", "ep-sinh-to", "da-xay", "nuoc-khac"],
      vegetarianOnly: false,
    },
  },
  {
    id: "crate_snack",
    name: "Hòm Ăn Vặt",
    shortName: "Ăn Vặt",
    codeName: "CASE // SNACK-03",
    tagline: "Bánh tráng, gỏi cuốn, xiên que",
    description: "Thiên đường ăn vặt đường phố giòn ngon, cuốn hút từng miếng",
    icon: "🍢",
    imageSrc: "/images/crates/snack.jpg",
    theme: {
      primaryHex: "#D946EF",
      glowClass: "shadow-[0_0_25px_rgba(217,70,239,0.35)]",
      activeBorderClass: "border-fuchsia-400 ring-2 ring-fuchsia-400/40",
      idleBorderClass: "border-fuchsia-500/25 hover:border-fuchsia-400/60",
      bgGradient: "from-fuchsia-500/20 via-fuchsia-950/30 to-canvas-100",
      textAccentClass: "text-fuchsia-400",
      badgeBgClass: "bg-fuchsia-500/20 border-fuchsia-500/40",
      badgeTextClass: "text-fuchsia-300",
      lightConeClass: "bg-fuchsia-400/15",
      lidRayClass: "from-fuchsia-400/40 via-pink-300/20 to-transparent",
    },
    filter: {
      kind: "FOOD",
      categoryIds: ["an-vat", "banh", "trang-mieng"],
      vegetarianOnly: false,
    },
  },
  {
    id: "crate_drinking",
    name: "Hòm Ăn Nhậu",
    shortName: "Ăn Nhậu",
    codeName: "CASE // PARTY-04",
    tagline: "Lẩu, nướng BBQ, ốc cay nồng",
    description: "Chiến hữu tụ tập lai rai với lẩu thái chua cay, mực nướng sa tế và ốc nóng hổi",
    icon: "🍻",
    imageSrc: "/images/crates/drinking.jpg",
    theme: {
      primaryHex: "#EF4444",
      glowClass: "shadow-[0_0_25px_rgba(239,68,68,0.35)]",
      activeBorderClass: "border-rose-500 ring-2 ring-rose-500/40",
      idleBorderClass: "border-rose-500/25 hover:border-rose-400/60",
      bgGradient: "from-rose-500/20 via-rose-950/30 to-canvas-100",
      textAccentClass: "text-rose-400",
      badgeBgClass: "bg-rose-500/20 border-rose-500/40",
      badgeTextClass: "text-rose-300",
      lightConeClass: "bg-rose-400/15",
      lidRayClass: "from-rose-500/40 via-red-400/20 to-transparent",
    },
    filter: {
      kind: "FOOD",
      categoryIds: ["lau-nuong"],
      vegetarianOnly: false,
    },
  },
  {
    id: "crate_vegetarian",
    name: "Hòm Đồ Chay",
    shortName: "Đồ Chay",
    codeName: "CASE // VEG-05",
    tagline: "Các món có lựa chọn phiên bản chay",
    description: "Danh sách món có thể chọn phiên bản chay; hãy xác nhận thành phần khi gọi món",
    icon: "🥗",
    imageSrc: "/images/crates/veg.jpg",
    theme: {
      primaryHex: "#10B981",
      glowClass: "shadow-[0_0_25px_rgba(16,185,129,0.35)]",
      activeBorderClass: "border-emerald-400 ring-2 ring-emerald-400/40",
      idleBorderClass: "border-emerald-500/25 hover:border-emerald-400/60",
      bgGradient: "from-emerald-500/20 via-emerald-950/30 to-canvas-100",
      textAccentClass: "text-emerald-400",
      badgeBgClass: "bg-emerald-500/20 border-emerald-500/40",
      badgeTextClass: "text-emerald-300",
      lightConeClass: "bg-emerald-400/15",
      lidRayClass: "from-emerald-400/40 via-teal-300/20 to-transparent",
    },
    filter: {
      kind: "FOOD",
      categoryIds: [],
      vegetarianOnly: true,
    },
  },
] as const;

// A distinct beverage crate prevents alcohol from appearing among refreshments.
const refreshmentCrate = BASE_CRATES.find((crate) => crate.id === "crate_drink")!;
export const CRATES: readonly CrateDefinition[] = [...BASE_CRATES, {
  ...refreshmentCrate,
  id: "crate_alcohol", name: "Hòm Đồ Uống Có Cồn", shortName: "Có Cồn",
  codeName: "CASE // DRINK-06", icon: "🍷",
  tagline: "Rượu, bia và cocktail — chọn riêng",
  description: "Nhóm đồ uống có cồn, tách khỏi hòm giải khát và các hòm món ăn",
  filter: { kind: "DRINK", categoryIds: ["co-con"], vegetarianOnly: false },
}];

export function cratesForKind(kind: ItemKind): CrateDefinition[] {
  return CRATES.filter((crate) => crate.filter.kind === kind);
}

export const DEFAULT_CRATE_ID: CrateId = "crate_food";

export function getCrateById(id: string): CrateDefinition {
  const found = CRATES.find((c) => c.id === id);
  return found ?? (CRATES[0] as CrateDefinition);
}

/** Filter a combined candidate item pool specifically for a crate's preset */
export function filterItemsForCrate(items: CandidateItem[], crate: CrateDefinition): CandidateItem[] {
  return items.filter((item) => {
    if (!item.enabled) return false;
    if (item.kind !== crate.filter.kind) return false;
    if (crate.filter.vegetarianOnly && !item.vegetarianPossible) return false;
    if (crate.filter.categoryIds.length > 0 && !crate.filter.categoryIds.includes(item.categoryId)) {
      return false;
    }
    return true;
  });
}
