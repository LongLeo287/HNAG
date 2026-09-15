import { Switch } from "@/components/ui/Switch";
import type { CrateDefinition } from "@/data/crates";
import { categoriesForCrate } from "../crateFilters";
import { CategoryChips } from "./CategoryChips";
import { BudgetControl } from "./BudgetControl";
import type { GameState } from "../types";

interface GameControlsProps {
  filters: GameState["draftFilters"];
  disabled: boolean;
  crate: CrateDefinition;
  countsByCategory?: Record<string, number>;
  onChange: (patch: Partial<GameState["draftFilters"]>) => void;
}

/** UI-003: Tactical Control Dock for adjusting food/drink kind, categories, vegetarian, and budget. */
export function GameControls({
  filters,
  disabled,
  crate,
  countsByCategory,
  onChange,
}: GameControlsProps) {
  return (
    <fieldset
      aria-label={`Bộ lọc trong ${crate.name}`}
      disabled={disabled}
      className="flex w-full flex-col gap-4 rounded-2xl border border-white/15 bg-canvas-100/85 p-3.5 sm:p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] disabled:opacity-60 transition-all"
    >
      <p className="text-sm font-semibold text-ink-900">Bộ lọc trong {crate.name}</p>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4">
        {filters.kind === "FOOD" && !crate.filter.vegetarianOnly && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 px-3.5 py-1 transition-colors shadow-sm">
          <Switch
            id="vegetarian-only"
            checked={filters.vegetarianOnly}
            onChange={(vegetarianOnly) => onChange({ vegetarianOnly })}
            label="Có lựa chọn chay 🌱"
          />
        </div>}
        {crate.filter.vegetarianOnly && <p className="text-xs text-emerald-400">Chọn phiên bản chay khi gọi món; xác nhận thành phần với quán.</p>}
      </div>

      {/* Middle: Category Chips */}
      <CategoryChips
        categories={categoriesForCrate(crate)}
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
