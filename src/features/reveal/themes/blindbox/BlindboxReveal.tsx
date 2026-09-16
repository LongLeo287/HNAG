import { useEffect, useRef, useState } from "react";
import type { FrozenSelection } from "@/features/randomizer/domain";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { RARITY_STYLE } from "@/lib/rarity";
import { cx } from "@/lib/cx";
import { CRATES, type CrateDefinition } from "@/data/crates";
import { ThreeCrate } from "../../three/ThreeCrate";

interface BlindboxRevealProps {
  frozenSelection: FrozenSelection;
  onTick: () => void;
  onLid?: () => void;
  onLanded: () => void;
  crate?: CrateDefinition;
}

type Phase = "idle" | "shaking" | "opening" | "revealed";

const SHAKE_MS = 1400;
const LID_MS = 450;
const POP_MS = 500;
const START_DELAY_MS = 200;

/**
 * Blindbox reveal theme (user request 2026-09-11, referencing the *genre* of sealed
 * blind-box unboxing used by many toy/gacha products generally — not a specific product's
 * assets/animation curve). A single sealed box shakes, its lid flies off, and the already-frozen
 * winner pops out — RANK-021/CODE-019 still apply: this component only presents `frozenSelection`.
 */
export function BlindboxReveal({ frozenSelection, onTick, onLid, onLanded, crate = CRATES[0]! }: BlindboxRevealProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const landedRef = useRef(false);
  const rarity = RARITY_STYLE[frozenSelection.winner.rarity];

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase("shaking"), START_DELAY_MS));
    // A tick per shake wobble — 4 wobbles over SHAKE_MS (matches .animate-blindbox-shake's 4 iterations).
    for (let i = 0; i < 4; i += 1) {
      timers.push(window.setTimeout(() => onTick(), START_DELAY_MS + ((i + 1) * SHAKE_MS) / 4));
    }
    timers.push(window.setTimeout(() => { setPhase("opening"); onLid?.(); }, START_DELAY_MS + SHAKE_MS));
    timers.push(window.setTimeout(() => setPhase("revealed"), START_DELAY_MS + SHAKE_MS + LID_MS));
    timers.push(
      window.setTimeout(() => {
        if (landedRef.current) return;
        landedRef.current = true;
        onLanded();
      }, START_DELAY_MS + SHAKE_MS + LID_MS + POP_MS + 250),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onTick, onLid, onLanded]);

  return (
    <div
      className="relative flex min-h-72 w-full items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Đang mở hộp bí ẩn"
    >
      <ThreeCrate crate={crate} pose={phase} />

      {phase === "revealed" && (
        <div
          className={cx(
            "absolute top-2 animate-blindbox-pop flex flex-col items-center gap-2 rounded-hnag border-2 bg-canvas-200 p-4",
            rarity.frameClass,
            rarity.glowClass,
          )}
        >
          <CategoryArt categoryId={frozenSelection.winner.categoryId} itemId={frozenSelection.winner.id} className="h-16 w-16" />
          <span className="line-clamp-2 max-w-28 text-center text-xs font-semibold text-ink-900">
            {frozenSelection.winner.name}
          </span>
        </div>
      )}
    </div>
  );
}
