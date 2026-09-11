import type { CandidateItem } from "@/data/catalog";
import { REEL_LENGTH, WINNER_SLOT_INDEX } from "./constants";

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
 * slot is a cosmetic decoy with no probability weight, so plain Math.random() is fine here —
 * this function never selects or influences the winner (CODE-019).
 */
export function buildReelSlots(winner: CandidateItem, decoyPool: CandidateItem[]): CandidateItem[] {
  const pool = decoyPool.length > 0 ? decoyPool : [winner];
  return Array.from({ length: REEL_LENGTH }, (_, index) => {
    if (index === WINNER_SLOT_INDEX) return winner;
    const decoy = pool[Math.floor(Math.random() * pool.length)];
    return decoy ?? winner;
  });
}

/** Build a shuffled, repeating visual strip for the idle crate preview */
export function buildIdleSlots(items: CandidateItem[], winnerItem?: CandidateItem | null): CandidateItem[] {
  if (items.length === 0) return winnerItem ? [winnerItem] : [];
  const pool = winnerItem ? items.filter((i) => i.id !== winnerItem.id) : items;
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  const repeated: CandidateItem[] = [];
  while (repeated.length < 24) {
    repeated.push(...(shuffled.length > 0 ? shuffled : items));
  }
  const result = repeated.slice(0, 32);
  if (winnerItem) {
    const centerIndex = Math.min(4, Math.floor(result.length / 2));
    result[centerIndex] = winnerItem;
  }
  return result;
}
