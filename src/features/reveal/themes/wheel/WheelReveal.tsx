import { useEffect, useMemo, useRef, useState } from "react";
import type { CandidateItem } from "@/data/catalog";
import type { FrozenSelection } from "@/features/randomizer/domain";
import { easeSpin } from "@/features/reveal/themes/case-reel/easing";
import { RARITY_STYLE } from "@/lib/rarity";
import { cx } from "@/lib/cx";
import {
  SEGMENT_ANGLE_DEG,
  WHEEL_SEGMENT_COUNT,
  buildWheelSegments,
  currentSegmentIndex,
  finalAngleDeg,
} from "./geometry";

interface WheelRevealProps {
  frozenSelection: FrozenSelection;
  decoyPool: CandidateItem[];
  onTick: () => void;
  onLanded: () => void;
}

const DURATION_MS = 6000;

/**
 * "Vòng quay may mắn" reveal theme (user request 2026-09-11) — a generic wheel-of-fortune
 * convention, not specific to any one product. Same rules as every other theme: the winner is
 * already frozen; this only spins a fixed pointer wheel to land on it (RANK-021/CODE-019).
 */
export function WheelReveal({ frozenSelection, decoyPool, onTick, onLanded }: WheelRevealProps) {
  const [angle, setAngle] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);
  const lastIndexRef = useRef(0);
  const landedRef = useRef(false);

  const segments = useMemo(
    () => buildWheelSegments(frozenSelection.winner, decoyPool),
    [frozenSelection, decoyPool],
  );

  useEffect(() => {
    const target = finalAngleDeg();
    const startedAt = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / DURATION_MS);
      const eased = easeSpin(progress);
      const nextAngle = eased * target;
      setAngle(nextAngle);

      const index = currentSegmentIndex(nextAngle);
      if (index !== lastIndexRef.current) {
        lastIndexRef.current = index;
        onTick();
      }

      if (progress >= 1) {
        setAngle(target);
        if (!landedRef.current) {
          landedRef.current = true;
          onLanded();
        }
        return;
      }
      frameRef.current = requestAnimationFrame(frame);
    };

    frameRef.current = requestAnimationFrame(frame);
    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [onTick, onLanded]);

  return (
    <div
      className="relative flex h-64 w-full items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Đang quay vòng quay may mắn"
    >
      {/* Fixed pointer */}
      <div
        aria-hidden
        className="absolute top-2 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-chili-500"
      />

      <div
        className="relative h-52 w-52 rounded-full border-4 border-canvas-300 bg-canvas-200 will-change-transform"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        {segments.map((item, index) => {
          const rarity = RARITY_STYLE[item.rarity];
          const midAngle = index * SEGMENT_ANGLE_DEG + SEGMENT_ANGLE_DEG / 2;
          return (
            <div
              key={`${item.id}-${index}`}
              className="absolute top-1/2 left-1/2 h-0 w-0"
              style={{ transform: `rotate(${midAngle}deg)` }}
            >
              <div
                className={cx(
                  "flex -translate-x-1/2 flex-col items-center gap-0.5 rounded-full border px-1.5 py-1 text-center",
                  rarity.frameClass,
                )}
                style={{ transform: `translateY(-84px) rotate(${-midAngle}deg)` }}
              >
                <span className="text-sm leading-none">{rarity.glyph}</span>
              </div>
            </div>
          );
        })}
        {/* Divider lines between segments */}
        {segments.map((_, index) => (
          <div
            key={`divider-${index}`}
            aria-hidden
            className="absolute top-1/2 left-1/2 h-px w-[100px] origin-left bg-canvas-100/60"
            style={{ transform: `rotate(${index * SEGMENT_ANGLE_DEG}deg)` }}
          />
        ))}
        <div className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-canvas-100" />
      </div>
      <span className="sr-only">{WHEEL_SEGMENT_COUNT} ô, đang quay</span>
    </div>
  );
}
