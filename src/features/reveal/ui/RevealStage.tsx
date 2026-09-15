import { useEffect, useMemo } from "react";
import type { FrozenSelection } from "@/features/randomizer/domain";
import { CaseReel } from "@/features/reveal/themes/case-reel/CaseReel";
import { createSpinProfile } from "@/features/reveal/themes/case-reel/spinProfile";
import type { GameAudio } from "@/features/audio/gameAudio";
import { RevealCard } from "./RevealCard";
import { ResultActions } from "./ResultActions";

interface RevealStageProps {
  phase: "spinning" | "revealed";
  frozenSelection: FrozenSelection;
  reducedMotion: boolean;
  audio: GameAudio;
  onLanded: () => void;
  onAccept: () => void;
  onRespin: () => void;
  onEditPool: () => void;
}

/**
 * UI-010: owns ready→spinning→landed→revealed presentation. Never selects or changes the winner —
 * `frozenSelection.winner` is fixed before this component ever renders (CODE-019).
 */
export function RevealStage({
  phase,
  frozenSelection,
  reducedMotion,
  audio,
  onLanded,
  onAccept,
  onRespin,
  onEditPool,
}: RevealStageProps) {
  // frozenSelection is intentionally in the deps: each new spin/re-spin should get its own
  // randomized duration within the 5.5-7.5s window (RANK-024), not the previous spin's value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const spinProfile = useMemo(() => createSpinProfile(reducedMotion), [reducedMotion, frozenSelection]);

  useEffect(() => {
    if (phase !== "spinning" || !reducedMotion) return;
    // RANK-030: short non-sliding reveal — same frozen winner, no long horizontal travel.
    const timeout = window.setTimeout(onLanded, spinProfile.durationMs);
    return () => window.clearTimeout(timeout);
  }, [phase, reducedMotion, spinProfile.durationMs, onLanded]);

  useEffect(() => {
    if (phase === "revealed") audio.playReveal(frozenSelection.winner.rarity, frozenSelection.winner.regionalSpecialty?.region);
  }, [phase, audio, frozenSelection]);

  if (phase === "spinning" && !reducedMotion) {
    return (
      <CaseReel
        frozenSelection={frozenSelection}
        decoyPool={frozenSelection.eligiblePool}
        durationMs={spinProfile.durationMs}
        onTick={() => audio.playTick()}
        onLanded={onLanded}
      />
    );
  }

  if (phase === "spinning" && reducedMotion) {
    return (
      <div
        className="flex h-44 w-full items-center justify-center rounded-hnag border border-ink-900/10 bg-canvas-200 text-sm text-ink-500"
        role="status"
        aria-live="polite"
      >
        Đang chọn món…
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <RevealCard winner={frozenSelection.winner} reducedMotion={reducedMotion} />
      <ResultActions
        dishName={frozenSelection.winner.name}
        onAccept={onAccept}
        onRespin={onRespin}
        onEditPool={onEditPool}
      />
    </div>
  );
}
