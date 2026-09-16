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
  onAirRelease?: () => void;
  onMechanicalClack?: () => void;
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
const STYLE_BADGE: Record<string, { label: string; icon: string; badgeClass: string; shockwaveClass: string }> = {
  csgo: {
    label: "CS:GO TACTICAL DROP",
    icon: "🎖️",
    badgeClass: "bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    shockwaveClass: "shadow-[0_0_40px_rgba(245,158,11,0.4)]",
  },
  overwatch: {
    label: "OVERWATCH LOOT POP",
    icon: "✨",
    badgeClass: "bg-cyan-950/90 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)]",
    shockwaveClass: "shadow-[0_0_50px_rgba(6,182,212,0.5)]",
  },
  apex: {
    label: "APEX BEACON DROP",
    icon: "⚡",
    badgeClass: "bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(239,68,68,0.4)]",
    shockwaveClass: "shadow-[0_0_50px_rgba(239,68,68,0.5)]",
  },
};

export function BlindboxReveal({
  frozenSelection,
  onTick,
  onLid,
  onAirRelease,
  onMechanicalClack,
  onLanded,
  crate = CRATES[0]!,
}: BlindboxRevealProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const landedRef = useRef(false);
  const rarity = RARITY_STYLE[frozenSelection.winner.rarity];
  const styleConfig = STYLE_BADGE[crate.openingStyle] ?? STYLE_BADGE.csgo!;

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase("shaking"), START_DELAY_MS));
    // A tick per shake wobble — 4 wobbles over SHAKE_MS (matches .animate-blindbox-shake's 4 iterations).
    for (let i = 0; i < 4; i += 1) {
      timers.push(window.setTimeout(() => onTick(), START_DELAY_MS + ((i + 1) * SHAKE_MS) / 4));
    }
    // Pneumatic air pressure release ("psssht") right before lid pops
    timers.push(
      window.setTimeout(() => onAirRelease?.(), Math.max(0, START_DELAY_MS + SHAKE_MS - 260)),
    );
    // Mechanical latch clack & lid pop open
    timers.push(
      window.setTimeout(() => {
        setPhase("opening");
        onMechanicalClack?.();
        onLid?.();
      }, START_DELAY_MS + SHAKE_MS),
    );
    timers.push(window.setTimeout(() => setPhase("revealed"), START_DELAY_MS + SHAKE_MS + LID_MS));
    timers.push(
      window.setTimeout(() => {
        if (landedRef.current) return;
        landedRef.current = true;
        onLanded();
      }, START_DELAY_MS + SHAKE_MS + LID_MS + POP_MS + 250),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onTick, onLid, onAirRelease, onMechanicalClack, onLanded]);

  return (
    <div
      className={cx(
        "relative flex min-h-72 w-full items-center justify-center transition-all duration-300",
        phase === "opening" && "scale-[1.02] filter brightness-110",
      )}
      role="status"
      aria-live="polite"
      aria-label="Đang mở hộp bí ẩn"
    >
      {/* Radiant skyward light pillar matching crate theme */}
      {phase === "revealed" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-1/2 top-0 -translate-x-1/2 w-64 h-full bg-gradient-to-t from-transparent via-current to-transparent opacity-30 blur-2xl transition-opacity duration-700 animate-pulse"
          style={{ color: crate.theme.primaryHex }}
        />
      )}

      <ThreeCrate crate={crate} pose={phase} />

      {phase === "revealed" && (
        <div
          className={cx(
            "absolute top-2 animate-blindbox-pop flex flex-col items-center gap-2 rounded-hnag border-2 bg-canvas-200/95 backdrop-blur-md p-4 shadow-2xl",
            rarity.frameClass,
            rarity.glowClass,
            styleConfig.shockwaveClass,
          )}
        >
          {/* Game-inspired style badge */}
          <span className={cx("text-[9px] font-mono px-2 py-0.5 rounded-full border tracking-widest uppercase font-bold", styleConfig.badgeClass)}>
            {styleConfig.icon} {styleConfig.label}
          </span>
          <CategoryArt categoryId={frozenSelection.winner.categoryId} itemId={frozenSelection.winner.id} className="h-16 w-16" />
          <span className="line-clamp-2 max-w-28 text-center text-xs font-semibold text-ink-900">
            {frozenSelection.winner.name}
          </span>
        </div>
      )}
    </div>
  );
}
