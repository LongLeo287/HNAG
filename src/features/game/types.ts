import type { FrozenSelection, RandomizerContext } from "@/features/randomizer/domain";
import type { FilterDiagnostics } from "@/features/randomizer/domain";

/** RS-020: single source of truth for the visible game phase (UI-045 GameShell owns this). */
export type GamePhase = "configuring" | "spinning" | "revealed" | "blocked";

export interface GameState {
  phase: GamePhase;
  draftFilters: Omit<RandomizerContext, "previousWinnerId">;
  frozenSelection: FrozenSelection | null;
  blockedDiagnostics: FilterDiagnostics | null;
}
