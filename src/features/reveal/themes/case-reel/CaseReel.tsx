import { useEffect, useMemo, useRef } from "react";
import type { FrozenSelection } from "@/features/randomizer/domain";
import type { CandidateItem } from "@/data/catalog";
import { buildReelSlots } from "./geometry";
import { WINNER_SLOT_INDEX } from "./constants";
import { ReelItemCard } from "./ReelItemCard";
import { SelectorLine } from "./SelectorLine";
import { useCaseReelAnimation } from "./useCaseReelAnimation";

interface CaseReelProps {
  frozenSelection: FrozenSelection;
  decoyPool: CandidateItem[];
  durationMs: number;
  onTick: () => void;
  onLanded: () => void;
}

/** RS-053/UI-046: CS:GO signature case-opening reel. Presentation only — winner arrives already frozen. */
export function CaseReel({ frozenSelection, decoyPool, durationMs, onTick, onLanded }: CaseReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const slots = useMemo(
    () => buildReelSlots(frozenSelection.winner, decoyPool),
    [frozenSelection, decoyPool],
  );

  const { translateXPx, start } = useCaseReelAnimation({ containerRef, cardRef, onTick, onLanded });

  useEffect(() => {
    // No "only once" ref guard here on purpose: React 18/19 StrictMode (dev only) mounts this
    // effect, cleans it up, then mounts it again — a guard that only allows the *first*
    // invocation to schedule work means the one invocation that survives (the second one) never
    // does, so the reel silently never starts in `pnpm dev` (production builds have no double
    // invoke, so this bug never showed up in `pnpm build`/E2E). `start`/`durationMs` are stable
    // for the lifetime of one spin (see CrateStage's memoized onTick/onLanded), so this still
    // fires exactly once per real spin, both in dev and in production.
    const raf = requestAnimationFrame(() => start(durationMs));
    return () => cancelAnimationFrame(raf);
  }, [durationMs, start]);

  return (
    <div
      ref={containerRef}
      className="relative h-52 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      role="status"
      aria-live="polite"
      aria-label="Đang quay chọn món"
    >
      <SelectorLine />
      <div
        className="absolute top-2 left-0 flex gap-3 will-change-transform"
        style={{ transform: `translate3d(${translateXPx}px, 0, 0)` }}
      >
        {slots.map((item, index) => (
          <div key={`${item.id}-${index}`} ref={index === 0 ? cardRef : undefined}>
            <ReelItemCard item={item} isWinner={index === WINNER_SLOT_INDEX} />
          </div>
        ))}
      </div>
    </div>
  );
}
