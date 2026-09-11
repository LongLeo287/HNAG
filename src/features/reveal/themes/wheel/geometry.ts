import type { CandidateItem } from "@/data/catalog";

export const WHEEL_SEGMENT_COUNT = 10;
export const WHEEL_WINNER_INDEX = 0;
export const WHEEL_FULL_SPINS = 5;
export const SEGMENT_ANGLE_DEG = 360 / WHEEL_SEGMENT_COUNT;

/** Same shape as case-reel's buildReelSlots (RANK-022): only WHEEL_WINNER_INDEX carries meaning. */
export function buildWheelSegments(winner: CandidateItem, decoyPool: CandidateItem[]): CandidateItem[] {
  const pool = decoyPool.length > 0 ? decoyPool : [winner];
  return Array.from({ length: WHEEL_SEGMENT_COUNT }, (_, index) => {
    if (index === WHEEL_WINNER_INDEX) return winner;
    const decoy = pool[Math.floor(Math.random() * pool.length)];
    return decoy ?? winner;
  });
}

/** Final clockwise rotation (deg) so the winner segment's center lands under the fixed top pointer. */
export function finalAngleDeg(winnerIndex: number = WHEEL_WINNER_INDEX): number {
  const segmentCenter = winnerIndex * SEGMENT_ANGLE_DEG + SEGMENT_ANGLE_DEG / 2;
  return WHEEL_FULL_SPINS * 360 + (360 - segmentCenter);
}

/** Inverse — which segment currently sits under the fixed top pointer at a given wheel rotation. */
export function currentSegmentIndex(currentAngleDeg: number): number {
  const normalized = ((360 - (currentAngleDeg % 360)) % 360 + 360) % 360;
  return Math.floor(normalized / SEGMENT_ANGLE_DEG) % WHEEL_SEGMENT_COUNT;
}
