import type { CandidateItem } from "@/data/catalog";
import type { FrozenSelection } from "@/features/randomizer/domain";

/**
 * FEAT-052/UI-052: the shared contract every reveal theme renders against.
 * A theme receives an already-frozen winner and decoy context — it owns presentation only
 * and can never re-draw or replace `frozenSelection.winner` (RANK-021, CODE-019).
 */
export interface RevealContext {
  frozenSelection: FrozenSelection;
  decoyPool: CandidateItem[];
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export type RevealPhase = "idle" | "spinning" | "landed" | "revealed";

export interface RevealThemeProps {
  context: RevealContext;
  onLanded: () => void;
  onTick: () => void;
}
