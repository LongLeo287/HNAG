import { useMemo, useRef, useState, useEffect } from "react";
import type { CandidateItem } from "@/data/catalog";
import { ReelItemCard } from "./ReelItemCard";
import { SelectorLine } from "./SelectorLine";
import { buildIdleSlots } from "./geometry";

interface IdleReelProps {
  items: CandidateItem[];
  winnerItem?: CandidateItem | null;
}

/**
 * CS:GO style idle crate preview:
 * Shows the items currently loaded inside the crate awaiting the OPEN command,
 * or stays landed on the winnerItem when the spin has completed.
 */
export function IdleReel({ items, winnerItem }: IdleReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [offsetPx, setOffsetPx] = useState(0);

  // Generate a balanced, dynamically randomized strip for preview
  const displayItems = useMemo(
    () => buildIdleSlots(items, winnerItem),
    [items, winnerItem],
  );

  const winnerIndex = useMemo(() => {
    if (!winnerItem) return -1;
    return displayItems.findIndex((item) => item.id === winnerItem.id);
  }, [displayItems, winnerItem]);

  useEffect(() => {
    if (!containerRef.current || displayItems.length === 0) return;
    const containerWidth = containerRef.current.clientWidth;
    const cardWidth = cardRef.current?.getBoundingClientRect().width || 144;
    const gap = 12;
    const step = cardWidth + gap;
    // Center target index: landed winner or random dish from the shuffled pool
    const centerIndex = winnerIndex >= 0 ? winnerIndex : Math.min(3, Math.floor(displayItems.length / 2));
    const targetOffset = containerWidth / 2 - cardWidth / 2 - centerIndex * step;
    setOffsetPx(targetOffset);
  }, [displayItems, winnerIndex]);

  return (
    <div
      ref={containerRef}
      className="relative h-52 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      role="region"
      aria-label="Các món có trong hòm"
    >
      <SelectorLine />
      <div
        className="absolute top-2 left-0 flex gap-3 transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${offsetPx}px, 0, 0)` }}
      >
        {displayItems.map((item, index) => (
          <div key={`${item.id}-${index}`} ref={index === 0 ? cardRef : undefined}>
            <ReelItemCard item={item} isWinner={winnerIndex >= 0 && index === winnerIndex} />
          </div>
        ))}
      </div>
    </div>
  );
}
