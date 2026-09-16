import { useEffect, useState } from "react";

interface SelectorLineProps {
  tickTrigger?: number;
  isLanded?: boolean;
}

/**
 * DS-023: CS:GO signature tactical selector line.
 * Upgraded with mechanical ticker arrow spring bounce on each card crossing
 * and radiant golden laser target-lock flare on winner landing.
 */
export function SelectorLine({ tickTrigger = 0, isLanded = false }: SelectorLineProps) {
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    if (tickTrigger === 0) return;
    setBouncing(true);
    const timer = window.setTimeout(() => setBouncing(false), 85);
    return () => window.clearTimeout(timer);
  }, [tickTrigger]);

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
        className="absolute -top-1 left-1/2 -translate-x-1/2 origin-top will-change-transform"
        style={{
          transform: `translateX(-50%) rotate(${bouncing ? "18deg" : "0deg"})`,
          transition: "transform 75ms cubic-bezier(0.18, 0.89, 0.32, 1.28)",
        }}
      >
        <div className="h-0 w-0 border-x-[8px] border-t-[12px] border-x-transparent border-t-gold-400 drop-shadow-[0_2px_8px_rgba(245,184,46,0.95)]" />
      </div>

      {/* Center target-lock flare on winner landing */}
      {isLanded && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gold-300/80 blur-xs animate-ping" />
      )}

      {/* Bottom mechanical golden ticker needle */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 origin-bottom will-change-transform"
        style={{
          transform: `translateX(-50%) rotate(${bouncing ? "-18deg" : "0deg"})`,
          transition: "transform 75ms cubic-bezier(0.18, 0.89, 0.32, 1.28)",
        }}
      >
        <div className="h-0 w-0 border-x-[8px] border-b-[12px] border-x-transparent border-b-gold-400 drop-shadow-[0_-2px_8px_rgba(245,184,46,0.95)]" />
      </div>
    </div>
  );
}

