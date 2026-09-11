import { useCallback, useRef, useState } from "react";
import { currentSlotIndex, finalTranslateXPx, type ReelGeometry } from "./geometry";
import { easeSpin } from "./easing";
import { FALLBACK_CARD_GAP_PX, FALLBACK_CARD_WIDTH_PX, WINNER_SLOT_INDEX } from "./constants";

interface UseCaseReelAnimationArgs {
  containerRef: React.RefObject<HTMLDivElement | null>;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onTick: () => void;
  onLanded: () => void;
}

interface CaseReelAnimationApi {
  translateXPx: number;
  isSpinning: boolean;
  start: (durationMs: number) => void;
}

/**
 * RANK-023/025: measures real DOM geometry at spin start and drives the strip with
 * requestAnimationFrame + transform only (no per-frame layout reads beyond the one
 * measurement at start). Winner selection already happened upstream — this hook only
 * animates toward a known target index (WINNER_SLOT_INDEX).
 */
export function useCaseReelAnimation({
  containerRef,
  cardRef,
  onTick,
  onLanded,
}: UseCaseReelAnimationArgs): CaseReelAnimationApi {
  const [translateXPx, setTranslateXPx] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const frameRef = useRef<number | undefined>(undefined);
  const lastCrossedIndexRef = useRef<number>(0);

  const measureGeometry = useCallback((): ReelGeometry => {
    const viewportWidthPx = containerRef.current?.clientWidth ?? 360;
    const cardRect = cardRef.current?.getBoundingClientRect();
    const cardWidthPx = cardRect && cardRect.width > 0 ? cardRect.width : FALLBACK_CARD_WIDTH_PX;
    // Gap read from the container's computed style so it stays in sync with Tailwind's gap utility.
    const gapValue = containerRef.current ? window.getComputedStyle(containerRef.current).columnGap : "";
    const cardGapPx = gapValue && gapValue !== "normal" ? Number.parseFloat(gapValue) : FALLBACK_CARD_GAP_PX;
    return { viewportWidthPx, cardWidthPx, cardGapPx: Number.isFinite(cardGapPx) ? cardGapPx : FALLBACK_CARD_GAP_PX };
  }, [containerRef, cardRef]);

  const start = useCallback(
    (durationMs: number) => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
      const geometry = measureGeometry();
      const targetX = finalTranslateXPx(geometry);
      lastCrossedIndexRef.current = 0;
      setIsSpinning(true);
      setTranslateXPx(0);

      const startedAt = performance.now();

      const frame = (now: number) => {
        const elapsedMs = now - startedAt;
        const rawProgress = Math.min(1, elapsedMs / durationMs);
        const eased = easeSpin(rawProgress);
        const nextX = eased * targetX;
        setTranslateXPx(nextX);

        const index = currentSlotIndex(geometry, nextX);
        if (index !== lastCrossedIndexRef.current && index <= WINNER_SLOT_INDEX) {
          lastCrossedIndexRef.current = index;
          onTick();
        }

        if (rawProgress >= 1) {
          setTranslateXPx(targetX); // snap — float accumulation must never leave the winner off-center
          setIsSpinning(false);
          onLanded();
          return;
        }
        frameRef.current = requestAnimationFrame(frame);
      };

      frameRef.current = requestAnimationFrame(frame);
    },
    [measureGeometry, onLanded, onTick],
  );

  return { translateXPx, isSpinning, start };
}
