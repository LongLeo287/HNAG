import { useEffect, useRef, useState } from "react";
import type { FrozenSelection } from "@/features/randomizer/domain";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { RARITY_STYLE } from "@/lib/rarity";
import { cx } from "@/lib/cx";

interface CardFlipRevealProps {
  frozenSelection: FrozenSelection;
  onTick: () => void;
  onLanded: () => void;
}

const ANTICIPATION_MS = 550;
const FLIP_MS = 550;
const SETTLE_MS = 350;

/**
 * The "quick mode" reveal theme (user request 2026-09-11): one card, flipped once. Same
 * frozen-winner contract as every other theme (RANK-021/CODE-019) — this only decides how long
 * to wait before flipping and what the two faces look like, never the outcome.
 */
export function CardFlipReveal({ frozenSelection, onTick, onLanded }: CardFlipRevealProps) {
  const [flipped, setFlipped] = useState(false);
  const landedRef = useRef(false);
  const rarity = RARITY_STYLE[frozenSelection.winner.rarity];

  useEffect(() => {
    const flipTimer = window.setTimeout(() => {
      setFlipped(true);
      onTick();
    }, ANTICIPATION_MS);
    const landedTimer = window.setTimeout(() => {
      if (landedRef.current) return;
      landedRef.current = true;
      onLanded();
    }, ANTICIPATION_MS + FLIP_MS + SETTLE_MS);
    return () => {
      window.clearTimeout(flipTimer);
      window.clearTimeout(landedTimer);
    };
    // frozenSelection is intentionally excluded — a re-spin remounts this component fresh via key.
  }, [onTick, onLanded]);

  return (
    <div
      className="flex h-52 w-full items-center justify-center [perspective:1200px]"
      role="status"
      aria-live="polite"
      aria-label="Đang lật bài"
    >
      <div
        className={cx(
          "relative h-44 w-36 transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {/* Back face */}
        <div className="absolute inset-0 flex items-center justify-center rounded-hnag border-2 border-chili-500/40 bg-canvas-300 [backface-visibility:hidden]">
          <span className="text-4xl text-chili-500">?</span>
        </div>
        {/* Front face */}
        <div
          className={cx(
            "absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-hnag border-2 bg-canvas-200 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]",
            rarity.frameClass,
            rarity.glowClass,
          )}
        >
          <CategoryArt categoryId={frozenSelection.winner.categoryId} itemId={frozenSelection.winner.id} className="h-16 w-16" />
          <span className="line-clamp-2 text-center text-xs font-semibold text-ink-900">
            {frozenSelection.winner.name}
          </span>
        </div>
      </div>
    </div>
  );
}
