import { Chip } from "@/components/ui/Chip";
import type { BudgetMode } from "@/features/randomizer/domain";

interface BudgetValue {
  budgetMode: BudgetMode;
  maxBudgetVnd?: number;
  targetBudgetVnd?: number;
}

interface BudgetControlProps {
  value: BudgetValue;
  onChange: (value: BudgetValue) => void;
}

const MODE_LABEL: Record<BudgetMode, string> = {
  NONE: "Không giới hạn",
  HARD_MAX: "Tối đa",
  TARGET: "Khoảng giá",
};

const PRESET_AMOUNTS = [30000, 50000, 75000, 100000, 150000];

function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}đ`;
}

/** UI-005: Tactical Budget Controls with quick presets and fine-grained range adjustment. */
export function BudgetControl({ value, onChange }: BudgetControlProps) {
  function setMode(mode: BudgetMode) {
    if (mode === "HARD_MAX") onChange({ budgetMode: mode, maxBudgetVnd: value.maxBudgetVnd ?? 50000, targetBudgetVnd: undefined });
    else if (mode === "TARGET") onChange({ budgetMode: mode, targetBudgetVnd: value.targetBudgetVnd ?? 50000, maxBudgetVnd: undefined });
    else onChange({ budgetMode: mode, maxBudgetVnd: undefined, targetBudgetVnd: undefined });
  }

  const currentAmount =
    value.budgetMode === "HARD_MAX"
      ? (value.maxBudgetVnd ?? 50000)
      : (value.targetBudgetVnd ?? 50000);

  function setAmount(amount: number) {
    if (value.budgetMode === "HARD_MAX") {
      onChange({ budgetMode: "HARD_MAX", maxBudgetVnd: amount });
    } else {
      onChange({ budgetMode: "TARGET", targetBudgetVnd: amount });
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-canvas-200/50 p-3 sm:p-3.5 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500 flex items-center gap-1.5">
          <span>💰</span>
          <span>Ngân sách món</span>
        </span>
        {value.budgetMode !== "NONE" && (
          <span className="rounded-full border border-gold-500/40 bg-gold-500/20 px-2.5 py-0.5 text-xs font-black text-gold-300 tabular-nums shadow-[0_0_10px_rgba(245,184,46,0.2)]">
            {formatVnd(currentAmount)}
          </span>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2" role="group" aria-label="Chế độ ngân sách">
        {(Object.keys(MODE_LABEL) as BudgetMode[]).map((mode) => (
          <Chip key={mode} pressed={value.budgetMode === mode} onClick={() => setMode(mode)}>
            {MODE_LABEL[mode]}
          </Chip>
        ))}
      </div>

      {/* Presets & Slider for HARD_MAX and TARGET */}
      {value.budgetMode !== "NONE" && (
        <div className="flex flex-col gap-3 pt-1 border-t border-white/5">
          {/* Quick preset buttons */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
              Mức giá nhanh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = currentAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    aria-pressed={isSelected}
                    className={`min-h-11 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "border border-gold-500/80 bg-gold-500 text-black shadow-[0_0_12px_rgba(245,184,46,0.4)] scale-105"
                        : "border border-white/10 bg-canvas-300 text-ink-300 hover:text-white hover:bg-canvas-400 hover:border-white/20"
                    }`}
                  >
                    {Math.round(amt / 1000)}k ({formatVnd(amt)})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slider with Min & Max labels */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-ink-500 tabular-nums">10k</span>
              <input
                type="range"
                aria-label={value.budgetMode === "HARD_MAX" ? "Ngân sách tối đa" : "Ngân sách mong muốn"}
                aria-valuetext={formatVnd(currentAmount)}
                min={10000}
                max={200000}
                step={5000}
                value={currentAmount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="min-w-0 flex-1 accent-gold-500 h-11 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-bold text-ink-500 tabular-nums">200k</span>
            </div>
          </div>

          <p className="text-[11px] text-ink-500/90 leading-relaxed bg-canvas-300/40 rounded-lg px-3 py-1.5 border border-white/5">
            {value.budgetMode === "HARD_MAX"
              ? `🎯 Chỉ chọn các món có giá từ ${formatVnd(currentAmount)} trở xuống.`
              : `🎲 Ưu tiên xác suất cao xuất hiện các món quanh mức ${formatVnd(currentAmount)}.`}
          </p>
        </div>
      )}
    </div>
  );
}
