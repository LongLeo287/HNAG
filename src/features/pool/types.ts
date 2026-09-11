import type { CandidateItem, ItemKind } from "@/data/catalog";

/** RS-018: user-controlled pool state. Combined with bundled data to produce the randomizer's input pool. */
export interface PoolProfile {
  disabledBuiltInIds: string[];
  customItems: CandidateItem[];
}

export interface CustomItemInput {
  kind: ItemKind;
  name: string;
  categoryId: string;
  priceVnd: number | null;
  vegetarianPossible: boolean;
}

export const EMPTY_POOL_PROFILE: PoolProfile = {
  disabledBuiltInIds: [],
  customItems: [],
};

export const MAX_CUSTOM_ITEMS = 30;
export const CUSTOM_NAME_MAX_LENGTH = 60;
export const CUSTOM_PRICE_MIN_VND = 1_000;
export const CUSTOM_PRICE_MAX_VND = 2_000_000;
