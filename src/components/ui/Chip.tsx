import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  count?: number;
}

/** UI-003: Tactical Chip with CS:GO gold/dark theme, hover glow, and optional counter badge. */
export function Chip({
  pressed,
  count,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx(
        "group inline-flex min-h-9 items-center justify-center rounded-xl border px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all",
        pressed
          ? "border-gold-500/70 bg-gradient-to-b from-gold-500/25 to-gold-600/15 text-gold-300 shadow-[0_0_14px_rgba(245,184,46,0.3)] font-bold scale-[1.02]"
          : "border-white/10 bg-canvas-200/70 text-ink-300 hover:text-white hover:bg-canvas-300/80 hover:border-white/20 active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={cx(
            "ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors",
            pressed
              ? "bg-gold-500/30 text-gold-200"
              : "bg-white/10 text-ink-500 group-hover:text-ink-300",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
