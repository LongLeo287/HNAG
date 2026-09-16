import type { ItemKind } from "@/data/catalog";
import { cx } from "@/lib/cx";

interface FoodDrinkToggleProps {
  value: ItemKind;
  foodCount?: number;
  drinkCount?: number;
  onChange: (value: ItemKind) => void;
  onHover?: () => void;
}

/** UI-004: Tactical segmented radio control for FOOD vs DRINK with live candidate counts and keyboard shortcuts [F]/[D]. */
export function FoodDrinkToggle({
  value,
  foodCount,
  drinkCount,
  onChange,
  onHover,
}: FoodDrinkToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Ăn hay uống"
      className="inline-flex rounded-xl border border-white/10 bg-canvas-300/80 p-1 backdrop-blur-md shadow-inner"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === "FOOD"}
        onClick={() => onChange("FOOD")}
        onPointerEnter={onHover}
        className={cx(
          "group flex min-h-10 items-center gap-2 rounded-lg px-4 sm:px-5 text-xs sm:text-sm font-bold transition-all",
          value === "FOOD"
            ? "bg-gradient-to-r from-gold-500 to-amber-600 text-white shadow-[0_0_16px_rgba(245,184,46,0.35)] scale-[1.02]"
            : "text-ink-400 hover:text-white hover:bg-white/5",
        )}
      >
        <span className="text-sm sm:text-base">🍱</span>
        <span>Món ăn</span>
        <kbd className={cx(
          "hidden sm:inline-block rounded px-1.5 py-0.2 text-[10px] font-mono font-bold transition-colors",
          value === "FOOD" ? "bg-black/20 text-white" : "bg-white/10 text-ink-500"
        )}>
          F
        </kbd>
        {foodCount !== undefined && (
          <span
            className={cx(
              "rounded-full px-2 py-0.5 text-[10px] font-extrabold tabular-nums transition-colors",
              value === "FOOD"
                ? "bg-white/25 text-white"
                : "bg-white/10 text-ink-500 group-hover:text-ink-300",
            )}
          >
            {foodCount}
          </span>
        )}
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={value === "DRINK"}
        onClick={() => onChange("DRINK")}
        onPointerEnter={onHover}
        className={cx(
          "group flex min-h-10 items-center gap-2 rounded-lg px-4 sm:px-5 text-xs sm:text-sm font-bold transition-all",
          value === "DRINK"
            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_16px_rgba(6,182,212,0.35)] scale-[1.02]"
            : "text-ink-400 hover:text-white hover:bg-white/5",
        )}
      >
        <span className="text-sm sm:text-base">🧋</span>
        <span>Đồ uống</span>
        <kbd className={cx(
          "hidden sm:inline-block rounded px-1.5 py-0.2 text-[10px] font-mono font-bold transition-colors",
          value === "DRINK" ? "bg-black/20 text-white" : "bg-white/10 text-ink-500"
        )}>
          D
        </kbd>
        {drinkCount !== undefined && (
          <span
            className={cx(
              "rounded-full px-2 py-0.5 text-[10px] font-extrabold tabular-nums transition-colors",
              value === "DRINK"
                ? "bg-white/25 text-white"
                : "bg-white/10 text-ink-500 group-hover:text-ink-300",
            )}
          >
            {drinkCount}
          </span>
        )}
      </button>
    </div>
  );
}
