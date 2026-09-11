import { Switch } from "@/components/ui/Switch";
import { FoodDrinkToggle } from "./FoodDrinkToggle";
import { CategoryChips } from "./CategoryChips";
import { BudgetControl } from "./BudgetControl";
import type { GameState } from "../types";

interface GameControlsProps {
  filters: GameState["draftFilters"];
  disabled: boolean;
  foodCount?: number;
  drinkCount?: number;
  countsByCategory?: Record<string, number>;
  onChange: (patch: Partial<GameState["draftFilters"]>) => void;
}

/** UI-003: Tactical Control Dock for adjusting food/drink kind, categories, vegetarian, and budget. */
export function GameControls({
  filters,
  disabled,
  foodCount,
  drinkCount,
  countsByCategory,
  onChange,
}: GameControlsProps) {
  return (
    <fieldset
      disabled={disabled}
      className="flex w-full flex-col gap-4 rounded-2xl border border-white/15 bg-canvas-100/85 p-3.5 sm:p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] disabled:opacity-60 transition-all"
    >
      {/* Top Row: Kind Toggle & Vegetarian Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4">
        <FoodDrinkToggle
          value={filters.kind}
          foodCount={foodCount}
          drinkCount={drinkCount}
          onChange={(kind) => onChange({ kind, categoryIds: [] })}
        />

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 px-3.5 py-1 transition-colors shadow-sm">
          <Switch
            id="vegetarian-only"
            checked={filters.vegetarianOnly}
            onChange={(vegetarianOnly) => onChange({ vegetarianOnly })}
            label="Chỉ món chay 🌱"
          />
        </div>
      </div>

      {/* Middle: Category Chips */}
      <CategoryChips
        kind={filters.kind}
        selected={filters.categoryIds}
        countsByCategory={countsByCategory}
        onChange={(categoryIds) => onChange({ categoryIds })}
      />

      {/* Bottom: Budget Control */}
      <BudgetControl
        value={{
          budgetMode: filters.budgetMode,
          maxBudgetVnd: filters.maxBudgetVnd,
          targetBudgetVnd: filters.targetBudgetVnd,
        }}
        onChange={(next) => onChange(next)}
      />
    </fieldset>
  );
}
