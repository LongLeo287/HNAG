import { REDUCED_MOTION_DURATION_MS, SPIN_DURATION_MAX_MS, SPIN_DURATION_MIN_MS } from "./constants";

export interface SpinProfile {
  durationMs: number;
  reducedMotion: boolean;
}

/**
 * RANK-030/DS-022: normal spins land within the product-mandated 5.5–7.5s window;
 * reduced motion always uses the short, non-sliding path regardless of the random pick.
 * This has no bearing on which item wins — the winner is already frozen before this is called.
 */
export function createSpinProfile(reducedMotion: boolean, random: () => number = Math.random): SpinProfile {
  if (reducedMotion) {
    return { durationMs: REDUCED_MOTION_DURATION_MS, reducedMotion: true };
  }
  const span = SPIN_DURATION_MAX_MS - SPIN_DURATION_MIN_MS;
  return { durationMs: SPIN_DURATION_MIN_MS + random() * span, reducedMotion: false };
}
