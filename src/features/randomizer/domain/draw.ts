import type { CandidateItem } from "@/data/catalog";
import type { UniformRng } from "./types";

/**
 * RANK-019: PURE_RANDOM draw — floor(u * N) over the stable eligible list.
 * u is expected in [0, 1); a u that rounds up to N (near-1 edge case) clamps to the last index.
 */
export function drawPureRandom(eligible: CandidateItem[], rng: UniformRng): CandidateItem {
  if (eligible.length === 0) throw new Error("DRAW_EMPTY_POOL");
  const index = Math.min(eligible.length - 1, Math.floor(rng() * eligible.length));
  // Index is always a valid position because it is clamped to [0, length-1] above.
  return eligible[index] as CandidateItem;
}

/** RANK-019: TARGET draw — cumulative weighted draw over the same stable eligible list. */
export function drawWeighted(eligible: CandidateItem[], weights: number[], rng: UniformRng): CandidateItem {
  if (eligible.length === 0) throw new Error("DRAW_EMPTY_POOL");
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return drawPureRandom(eligible, rng);

  const target = rng() * total;
  let cumulative = 0;
  for (let i = 0; i < eligible.length; i += 1) {
    cumulative += weights[i] ?? 0;
    if (target < cumulative) {
      // Non-null: i stays within [0, eligible.length) for the whole loop.
      return eligible[i] as CandidateItem;
    }
  }
  // Rounding fallback per RANK-019 — last item covers any residual floating-point slack.
  return eligible[eligible.length - 1] as CandidateItem;
}
