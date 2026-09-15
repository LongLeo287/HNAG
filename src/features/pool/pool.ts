import type { CandidateItem } from "@/data/catalog";
import { MAX_CUSTOM_ITEMS, type PoolProfile } from "./types";

/**
 * RANK-003: combined pool = enabled bundled items + valid enabled custom items.
 * Custom items carry no hidden origin bias — CUSTOM_FAIR is enforced in the randomizer weighting,
 * not here; this function only decides *membership*, never probability.
 */
export function combinePool(bundled: CandidateItem[], profile: PoolProfile): CandidateItem[] {
  const bundledWithState = bundled.map((item) => ({
    ...item,
    enabled: item.enabled && !profile.disabledBuiltInIds.includes(item.id),
  }));
  return [...bundledWithState, ...profile.customItems];
}

export function toggleBuiltIn(profile: PoolProfile, itemId: string, enabled: boolean): PoolProfile {
  const withoutId = profile.disabledBuiltInIds.filter((id) => id !== itemId);
  return {
    ...profile,
    disabledBuiltInIds: enabled ? withoutId : [...withoutId, itemId],
  };
}

export type AddCustomItemResult =
  | { ok: true; profile: PoolProfile }
  | { ok: false; error: string };

export function addCustomItem(profile: PoolProfile, item: CandidateItem): AddCustomItemResult {
  if (profile.customItems.length >= MAX_CUSTOM_ITEMS) {
    return { ok: false, error: `Chỉ có thể thêm tối đa ${MAX_CUSTOM_ITEMS} món tuỳ chỉnh` };
  }
  return { ok: true, profile: { ...profile, customItems: [...profile.customItems, item] } };
}

export function removeCustomItem(profile: PoolProfile, itemId: string): PoolProfile {
  return { ...profile, customItems: profile.customItems.filter((item) => item.id !== itemId) };
}
