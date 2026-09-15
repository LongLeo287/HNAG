import type { CandidateItem } from "@/data/catalog";
import { applyHardFilters, applyRespinExclusion, stableSortById } from "./eligibility";
import { computeWeights } from "./weighting";
import { drawWeighted } from "./draw";
import type { RandomizerContext, RandomizerResult, UniformRng } from "./types";

export interface RunRandomizerInput {
  pool: CandidateItem[];
  context: RandomizerContext;
  rng: UniformRng;
}

/**
 * RS-019/CODE-019: the single pure entry point for winner selection.
 * Freezes a winner BEFORE any reveal/animation/audio code runs — this function has
 * no knowledge of React, the DOM, or presentation and must stay that way
 * (enforced by scripts/check-boundaries.ts).
 */
export function runRandomizer({ pool, context, rng }: RunRandomizerInput): RandomizerResult {
  const { eligible: hardEligible, diagnostics } = applyHardFilters(pool, context);

  if (hardEligible.length === 0) {
    return { status: "NO_CANDIDATES", diagnostics };
  }

  const eligibleAfterRespin = applyRespinExclusion(hardEligible, context.previousWinnerId);
  const eligible = stableSortById(eligibleAfterRespin);
  const weights = computeWeights(eligible, context);

  const winner = drawWeighted(eligible, weights, rng);

  return {
    status: "OK",
    selection: {
      algorithmVersion: "randomizer-v2.1.0",
      winner,
      eligiblePool: eligible,
      probabilities: weights,
      context,
      frozenAtMs: Date.now(),
    },
  };
}
