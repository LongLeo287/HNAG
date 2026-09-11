import type { UniformRng } from "@/features/randomizer/domain";

/**
 * RS-046: deterministic seeded RNG for tests only. Production code must never import
 * this — winner selection always uses the crypto-backed rng from features/randomizer/domain/rng.ts.
 * mulberry32 — small, fast, good-enough statistical quality for distribution/property tests.
 */
export function seededRng(seed: number): UniformRng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
