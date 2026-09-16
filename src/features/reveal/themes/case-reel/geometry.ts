import type { CandidateItem } from "@/data/catalog";
import { REEL_LENGTH, WINNER_SLOT_INDEX } from "./constants";
import { sampleDecoy } from "./decoys";

export interface ReelGeometry {
  viewportWidthPx: number;
  cardWidthPx: number;
  cardGapPx: number;
}

/**
 * RANK-023/DS-023: pure geometry math, computed from *measured* runtime values —
 * no hard-coded desktop width. The React layer (useCaseReelAnimation) is responsible
 * for measuring the real viewport/card box and calling these functions every spin.
 */
export function cardStep(geometry: ReelGeometry): number {
  return geometry.cardWidthPx + geometry.cardGapPx;
}

/** Horizontal offset (negative = strip moved left) that centers the winner slot under the fixed selector. */
export function finalTranslateXPx(geometry: ReelGeometry, winnerIndex: number = WINNER_SLOT_INDEX): number {
  const step = cardStep(geometry);
  return geometry.viewportWidthPx / 2 - geometry.cardWidthPx / 2 - winnerIndex * step;
}

/** Inverse of finalTranslateXPx — which slot index currently sits under the fixed selector. */
export function currentSlotIndex(geometry: ReelGeometry, translateXPx: number): number {
  const step = cardStep(geometry);
  const raw = (geometry.viewportWidthPx / 2 - geometry.cardWidthPx / 2 - translateXPx) / step;
  return Math.round(raw);
}

/**
 * RANK-022: build the visual strip. Only WINNER_SLOT_INDEX carries meaning; every other
 * slot is a cosmetic decoy sampled from the frozen probabilities using Math.random() —
 * this function never selects or influences the winner (CODE-019).
 * Upgraded with CS:GO signature "Near-Miss" suspense positioning.
 */
export function buildReelSlots(winner: CandidateItem, decoyPool: CandidateItem[], probabilities: number[] = []): CandidateItem[] {
  const pool = decoyPool.length > 0 ? decoyPool : [winner];

  // CS:GO near-miss suspense: place an epic/legendary/specialty card immediately adjacent to winner
  const nearMissCandidates = pool.filter(
    (item) =>
      item.id !== winner.id &&
      (item.rarity === "HUYEN_THOAI" || item.rarity === "DINH" || Boolean(item.regionalSpecialty)),
  );
  const nearMissItem =
    nearMissCandidates.length > 0
      ? nearMissCandidates[Math.floor(Math.random() * nearMissCandidates.length)]
      : undefined;

  return Array.from({ length: REEL_LENGTH }, (_, index) => {
    if (index === WINNER_SLOT_INDEX) return winner;
    if (index === WINNER_SLOT_INDEX - 1 && nearMissItem) return nearMissItem;
    const decoy = sampleDecoy(pool, probabilities);
    return decoy ?? winner;
  });
}

/** Cosmetic preview with current odds and a fixed landed-winner slot. */
export function buildIdleSlots(items: CandidateItem[], winnerItem?: CandidateItem | null, probabilities: number[] = []): CandidateItem[] {
  if (items.length === 0) return winnerItem ? [winnerItem] : [];
  const pool = winnerItem ? items.filter((i) => i.id !== winnerItem.id) : items;
  const weights = probabilities.filter((_, i) => !winnerItem || items[i]?.id !== winnerItem.id);
  const result = Array.from({ length: 32 }, () => sampleDecoy(pool, weights) ?? winnerItem ?? items[0]!);
  if (winnerItem) {
    const centerIndex = Math.min(4, Math.floor(result.length / 2));
    result[centerIndex] = winnerItem;
  }
  return result;
}
