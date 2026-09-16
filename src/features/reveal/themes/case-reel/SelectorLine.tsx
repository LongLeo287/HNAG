interface SelectorLineProps {
  tickTrigger?: number;
  isLanded?: boolean;
}

/**
 * DS-023: CS:GO signature tactical selector line.
 * Upgraded with mechanical ticker arrow spring bounce on each card crossing
 * and radiant golden laser target-lock flare on winner landing.
 *
 * The needle kick is a CSS keyframe replayed by remounting the needle on each
 * tick (`key={tickTrigger}`), so there is no state to flip and no effect to
 * schedule. `tickTrigger === 0` is the idle reel: the needles mount once with
 * no animation class and never kick.
 */
export function SelectorLine({ tickTrigger = 0, isLanded = false }: SelectorLineProps) {
  const kick = tickTrigger > 0 ? "animate-needle-kick" : "";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-20 w-[3px] -translate-x-1/2 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-400 animate-laser"
      style={{
        boxShadow: isLanded
          ? "0 0 16px rgba(245, 184, 46, 0.9), 0 0 32px rgba(245, 158, 11, 0.6)"
          : undefined,
      }}
    >
      {/* Top mechanical golden ticker needle - kicks on each card boundary */}
      <div
        key={`top-${tickTrigger}`}
        className={`absolute -top-1 left-1/2 -translate-x-1/2 origin-top will-change-transform ${kick}`}
        style={{ "--kick": "18deg" } as React.CSSProperties}
      >
        <div className="h-0 w-0 border-x-[8px] border-t-[12px] border-x-transparent border-t-gold-400 drop-shadow-[0_2px_8px_rgba(245,184,46,0.95)]" />
      </div>

      {/* Center target-lock flare on winner landing */}
      {isLanded && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gold-300/80 blur-xs animate-ping" />
      )}

      {/* Bottom mechanical golden ticker needle */}
      <div
        key={`bottom-${tickTrigger}`}
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 origin-bottom will-change-transform ${kick}`}
        style={{ "--kick": "-18deg" } as React.CSSProperties}
      >
        <div className="h-0 w-0 border-x-[8px] border-b-[12px] border-x-transparent border-b-gold-400 drop-shadow-[0_-2px_8px_rgba(245,184,46,0.95)]" />
      </div>
    </div>
  );
}
