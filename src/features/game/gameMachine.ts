import type { RandomizerResult } from "@/features/randomizer/domain";
import type { GameState } from "./types";

export const INITIAL_GAME_STATE: GameState = {
  phase: "configuring",
  draftFilters: {
    kind: "FOOD",
    categoryIds: [],
    vegetarianOnly: false,
    budgetMode: "NONE",
  },
  frozenSelection: null,
  blockedDiagnostics: null,
};

/**
 * RS-020: pure phase transitions only. The actual winner draw happens in
 * features/randomizer/domain (via useGame.ts) — this module never touches RNG.
 */
export function updateDraftFilters(
  state: GameState,
  patch: Partial<GameState["draftFilters"]>,
): GameState {
  if (state.phase === "spinning") return state; // CODE controls locked mid-spin.
  return {
    ...state,
    phase: "configuring",
    frozenSelection: null,
    draftFilters: { ...state.draftFilters, ...patch },
    blockedDiagnostics: null,
  };
}

export function applyRandomizerResult(state: GameState, result: RandomizerResult): GameState {
  if (result.status === "NO_CANDIDATES") {
    return { ...state, phase: "blocked", frozenSelection: null, blockedDiagnostics: result.diagnostics };
  }
  return {
    ...state,
    phase: "spinning",
    frozenSelection: result.selection,
    blockedDiagnostics: null,
  };
}

/** CaseReel finished landing — hand off to the reveal payoff. */
export function landReel(state: GameState): GameState {
  if (state.phase !== "spinning") return state;
  return { ...state, phase: "revealed" };
}

/** Accept ends the round; the next OPEN starts a fresh spin with no previous-winner exclusion. */
export function acceptResult(state: GameState): GameState {
  return { ...state, phase: "configuring", frozenSelection: null };
}
