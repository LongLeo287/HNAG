import { useEffect, useMemo, useRef, useState } from "react";
import type { CandidateItem } from "@/data/catalog";
import type { FrozenSelection } from "@/features/randomizer/domain";
import { easeSpin } from "@/features/reveal/themes/case-reel/easing";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { RARITY_STYLE } from "@/lib/rarity";
import { cx } from "@/lib/cx";

interface SlotMachineRevealProps {
  frozenSelection: FrozenSelection;
  decoyPool: CandidateItem[];
  onTick: () => void;
  onLanded: () => void;
}

const STRIP_LENGTH = 20;
const WINNER_ROW_INDEX = 16;
const ITEM_HEIGHT_PX = 48;
const GAP_PX = 8;
const STEP_PX = ITEM_HEIGHT_PX + GAP_PX;
const VIEWPORT_HEIGHT_PX = 176; // matches the h-44 column below
const FINAL_Y_PX = VIEWPORT_HEIGHT_PX / 2 - ITEM_HEIGHT_PX / 2 - WINNER_ROW_INDEX * STEP_PX;

// Staggered so the columns stop left→right, escalating suspense — original #HNAG timings.
const COLUMN_DURATIONS_MS = [2600, 3800, 5000];

/** Same shape as case-reel's buildReelSlots (RANK-022) — only WINNER_ROW_INDEX carries meaning. */
function buildColumnStrip(winner: CandidateItem, decoyPool: CandidateItem[]): CandidateItem[] {
  const pool = decoyPool.length > 0 ? decoyPool : [winner];
  return Array.from({ length: STRIP_LENGTH }, (_, index) => {
    if (index === WINNER_ROW_INDEX) return winner;
    const decoy = pool[Math.floor(Math.random() * pool.length)];
    return decoy ?? winner;
  });
}

function currentRowIndex(translateYPx: number): number {
  const raw = (VIEWPORT_HEIGHT_PX / 2 - ITEM_HEIGHT_PX / 2 - translateYPx) / STEP_PX;
  return Math.round(raw);
}

function Column({
  strip,
  durationMs,
  onTick,
  onStopped,
}: {
  strip: CandidateItem[];
  durationMs: number;
  onTick: () => void;
  onStopped: () => void;
}) {
  const [translateY, setTranslateY] = useState(0);
  const lastRowRef = useRef(0);
  const stoppedRef = useRef(false);

  useEffect(() => {
    const startedAt = performance.now();
    let frameId: number;

    const frame = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = easeSpin(progress);
      const nextY = eased * FINAL_Y_PX;
      setTranslateY(nextY);

      const row = currentRowIndex(nextY);
      if (row !== lastRowRef.current && row <= WINNER_ROW_INDEX) {
        lastRowRef.current = row;
        onTick();
      }

      if (progress >= 1) {
        setTranslateY(FINAL_Y_PX);
        if (!stoppedRef.current) {
          stoppedRef.current = true;
          onStopped();
        }
        return;
      }
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [durationMs, onTick, onStopped]);

  return (
    <div className="relative h-44 w-20 overflow-hidden rounded-hnag border border-ink-900/10 bg-canvas-100 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <div
        className="absolute top-0 left-0 flex w-full flex-col items-center gap-2 will-change-transform"
        style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
      >
        {strip.map((item, index) => {
          const rarity = RARITY_STYLE[item.rarity];
          return (
            <div
              key={`${item.id}-${index}`}
              className={cx(
                "flex h-12 w-16 shrink-0 items-center justify-center rounded-hnag border bg-canvas-200",
                rarity.frameClass,
              )}
            >
              <CategoryArt categoryId={item.categoryId} itemId={item.id} className="h-8 w-8" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Slot Machine reveal theme (user request 2026-09-11) — 3 columns stop left→right, all
 * converging on the *same* already-frozen winner (never 3 independent draws): showing different
 * items per column would read as a match-3 gambling mechanic, which BR-035/RANK-029 rule out.
 * This is presentation escalation only — RANK-021/CODE-019 still apply.
 */
export function SlotMachineReveal({ frozenSelection, decoyPool, onTick, onLanded }: SlotMachineRevealProps) {
  const strips = useMemo(
    () => COLUMN_DURATIONS_MS.map(() => buildColumnStrip(frozenSelection.winner, decoyPool)),
    [frozenSelection, decoyPool],
  );
  const stoppedCountRef = useRef(0);
  const landedRef = useRef(false);

  function handleColumnStopped() {
    stoppedCountRef.current += 1;
    if (stoppedCountRef.current >= COLUMN_DURATIONS_MS.length && !landedRef.current) {
      landedRef.current = true;
      onLanded();
    }
  }

  return (
    <div
      className="flex h-52 w-full items-center justify-center gap-3"
      role="status"
      aria-live="polite"
      aria-label="Đang quay máy xèng"
    >
      {COLUMN_DURATIONS_MS.map((durationMs, index) => (
        <Column
          key={index}
          strip={strips[index] ?? []}
          durationMs={durationMs}
          onTick={onTick}
          onStopped={handleColumnStopped}
        />
      ))}
    </div>
  );
}
