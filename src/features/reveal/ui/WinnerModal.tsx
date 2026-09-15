import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { CandidateItem } from "@/data/catalog";
import { RevealCard } from "./RevealCard";
import { ResultActions } from "./ResultActions";
import type { DrawOdds } from "@/features/randomizer/domain";
import { RARITY_STYLE } from "@/lib/rarity";

interface WinnerModalProps {
  open: boolean;
  winner: CandidateItem;
  reducedMotion?: boolean;
  winningProbability?: number;
  respinOdds?: DrawOdds;
  locationHint?: { label?: string; position?: { latitude: number; longitude: number } };
  onAccept: () => void;
  onRespin: () => void;
  onEditPool: () => void;
  onClose: () => void;
}

/**
 * CS:GO Victory Reveal Modal (truanayangi.com winner-dialog style):
 * Uses React Portal to mount directly into document.body, preventing any containing block
 * or overflow clipping from CrateStage.
 */
export function WinnerModal({
  open,
  winner,
  reducedMotion,
  winningProbability,
  respinOdds,
  locationHint,
  onAccept,
  onRespin,
  onEditPool,
  onClose,
}: WinnerModalProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;
  const rarity = RARITY_STYLE[winner.rarity];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kết quả mở hòm"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-hidden"
    >
      {/* Dimmed glass backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div className={`relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl border ${rarity.frameClass} ${rarity.glowClass} bg-[#0c1017]/98 p-4 sm:p-5 backdrop-blur-2xl transition-all z-10 my-auto`}>
        {/* Background Radiant Aura */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-80 max-w-full rounded-full ${rarity.barClass} opacity-20 blur-3xl`}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-canvas-200/80 hover:bg-canvas-300 text-ink-500 hover:text-white transition-colors"
          title="Đóng cửa sổ"
          aria-label="Đóng"
        >
          <span className="text-sm font-bold leading-none">✕</span>
        </button>

        {/* Content Body */}
        <div className="flex flex-col items-center justify-center">
          <RevealCard winner={winner} reducedMotion={reducedMotion} winningProbability={winningProbability} />

          <ResultActions
            dishName={winner.name}
            respinOdds={respinOdds}
            locationHint={locationHint}
            onAccept={onAccept}
            onRespin={onRespin}
            onEditPool={onEditPool}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
