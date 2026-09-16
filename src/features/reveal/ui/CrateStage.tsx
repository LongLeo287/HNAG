import type { DrawOdds, FrozenSelection } from "@/features/randomizer/domain";
import type { CandidateItem } from "@/data/catalog";
import type { GameAudio } from "@/features/audio/gameAudio";
import { CRATES, type CrateDefinition } from "@/data/crates";
import { IdleReel } from "../themes/case-reel/IdleReel";
import { RevealThemeRenderer } from "./RevealThemeRenderer";
import { WinnerModal } from "./WinnerModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createSpinProfile } from "../themes/case-reel/spinProfile";
import { ThreeCrate } from "../three/ThreeCrate";

interface CrateStageProps {
  phase: "configuring" | "blocked" | "spinning" | "revealed";
  eligiblePool: CandidateItem[];
  nextDrawOdds?: DrawOdds;
  frozenSelection: FrozenSelection | null;
  reducedMotion: boolean;
  revealThemeId: string;
  audio: GameAudio;
  crate?: CrateDefinition;
  locationHint?: { label?: string; position?: { latitude: number; longitude: number } };
  onLanded: () => void;
  onOpen: () => void;
  onAccept: () => void;
  onRespin: () => void;
  onEditPool: () => void;
  onSelectCrate?: (crateId: string) => void;
}

/**
 * CS:GO Crate Showcase:
 * The dominant permanent stage featuring the crate container, status beacon,
 * idle items preview, high-speed spin reel, and grand victory reveal modal.
 * When theme = blindbox, displays interactive 3D Three.js crate.
 */
export function CrateStage({
  phase,
  eligiblePool,
  nextDrawOdds,
  frozenSelection,
  reducedMotion,
  revealThemeId,
  audio,
  crate,
  locationHint,
  onLanded,
  onOpen,
  onAccept,
  onRespin,
  onEditPool,
}: CrateStageProps) {
  const activeCrate = crate ?? (CRATES[0] as CrateDefinition);
  const [dismissedSelection, setDismissedSelection] = useState<FrozenSelection | null>(null);
  const modalOpen = dismissedSelection !== frozenSelection;

  const spinProfile = useMemo(
    () => createSpinProfile(reducedMotion),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reducedMotion, frozenSelection],
  );

  useEffect(() => {
    if (phase !== "spinning" || !reducedMotion) return;
    const timeout = window.setTimeout(onLanded, spinProfile.durationMs);
    return () => window.clearTimeout(timeout);
  }, [phase, reducedMotion, spinProfile.durationMs, onLanded]);

  useEffect(() => {
    if (phase === "revealed" && frozenSelection) {
      audio.playReveal(frozenSelection.winner.rarity, frozenSelection.winner.regionalSpecialty?.region);
    }
  }, [phase, audio, frozenSelection]);

  const handleTick = useCallback(() => audio.playTick(), [audio]);
  const handleLid = useCallback(() => audio.playCrateLid(), [audio]);
  const handleHover = useCallback(() => audio.playCrateHover(), [audio]);
  const handleInteract = useCallback(() => audio.recover(), [audio]);

  const idleCrate = (disabled = false) => <ThreeCrate
    key={activeCrate.id}
    crate={activeCrate}
    reducedMotion={reducedMotion}
    disabled={disabled || eligiblePool.length === 0}
    onOpen={onOpen}
    onHover={handleHover}
    onInteract={handleInteract}
  />;

  return (
    <section
      aria-label="Khu vực hòm và vòng quay"
      className="relative w-full overflow-hidden rounded-2xl border bg-[#0a0e16] shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors duration-300"
      style={{ borderColor: `${activeCrate.theme.primaryHex}45` }}
    >
      {/* Top stage lighting cone matching crate theme */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-36 w-96 rounded-full blur-3xl transition-all duration-500"
        style={{ backgroundColor: activeCrate.theme.primaryHex, opacity: 0.12 }}
      />

      {/* Stage Body - directly host the reel */}
      <div className="relative">
        {(phase === "configuring" || phase === "blocked") && (revealThemeId === "blindbox"
          ? idleCrate(phase === "blocked")
          : <IdleReel items={eligiblePool} probabilities={nextDrawOdds?.probabilities} />)}

        {phase === "spinning" && !reducedMotion && frozenSelection && (
          <RevealThemeRenderer
            themeId={revealThemeId}
            crate={activeCrate}
            frozenSelection={frozenSelection}
            decoyPool={frozenSelection.eligiblePool}
            caseReelDurationMs={spinProfile.durationMs}
            onTick={handleTick}
            onLid={handleLid}
            onLanded={onLanded}
          />
        )}

        {phase === "spinning" && reducedMotion && (
          <div
            className="flex h-52 w-full items-center justify-center rounded-xl border border-white/10 bg-canvas-50 text-sm text-gold-400 font-semibold"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <span className="animate-spin text-xl">🎲</span>
              <span>Đang chọn món ngẫu nhiên…</span>
            </div>
          </div>
        )}

        {phase === "revealed" && frozenSelection && (
          <>
            {revealThemeId === "blindbox" ? idleCrate(modalOpen) : <IdleReel items={eligiblePool} probabilities={nextDrawOdds?.probabilities} winnerItem={frozenSelection.winner} />}
            <WinnerModal
              open={modalOpen}
              winner={frozenSelection.winner}
              reducedMotion={reducedMotion}
              winningProbability={frozenSelection.probabilities[frozenSelection.eligiblePool.findIndex((item) => item.id === frozenSelection.winner.id)]}
              respinOdds={nextDrawOdds}
              locationHint={locationHint}
              onAccept={onAccept}
              onRespin={onRespin}
              onEditPool={onEditPool}
              onClose={() => setDismissedSelection(frozenSelection)}
              onHover={handleHover}
            />
          </>
        )}
      </div>
    </section>
  );
}
