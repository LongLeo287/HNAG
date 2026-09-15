import { Dialog } from "@/components/ui/Dialog";
import { RarityOdds } from "@/components/ui/RarityOdds";
import {
  ODDS_PRESETS,
  type DrawOdds,
  type OddsPreset,
} from "@/features/randomizer/domain";

interface OddsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  odds: DrawOdds;
  oddsPreset: OddsPreset;
  onOddsPresetChange: (preset: OddsPreset) => void;
  specialtyBoost: boolean;
  onSpecialtyBoostChange: (boost: boolean) => void;
  onResetOdds: () => void;
}

const PRESET_KEYS: OddsPreset[] = ["STANDARD", "BALANCED", "PREMIUM", "EQUAL"];

/**
 * Dedicated Rarity Odds & Odds Settings Modal:
 * Hoàn toàn tách biệt khỏi Cài đặt hệ thống theo yêu cầu:
 * "Tỉ lệ nên tách riêng ra. không nên để chung với cài đặt. Phần tỉ lệ thì có setting riêng"
 */
export function OddsDialog({
  open,
  onOpenChange,
  odds,
  oddsPreset,
  onOddsPresetChange,
  specialtyBoost,
  onSpecialtyBoostChange,
  onResetOdds,
}: OddsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Tỉ lệ & Cài đặt tỉ lệ">
      <div className="flex flex-col gap-5">
        {/* Section 1: Real-time Rarity Odds breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500 flex items-center gap-1.5">
              <span>📊</span>
              <span>Xác suất mở trúng theo bộ lọc hiện tại</span>
            </h3>
            <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
              {ODDS_PRESETS[oddsPreset]?.label || "Tiêu chuẩn"}
            </span>
          </div>

          <RarityOdds odds={odds} />
        </div>

        {/* Section 2: Cài đặt tỉ lệ riêng (Odds Settings / Presets) */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
              <span>⚙️</span>
              <span>Cài đặt chế độ tỉ lệ</span>
            </h3>
            <p className="text-[11px] text-ink-500 mt-0.5">
              Tùy chỉnh xác suất phân bổ giữa các bậc món ăn theo sở thích của bạn:
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="Chọn chế độ tỉ lệ mở hòm"
          >
            {PRESET_KEYS.map((key) => {
              const preset = ODDS_PRESETS[key];
              const isSelected = oddsPreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onOddsPresetChange(key)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-gold-400 bg-gold-500/15 shadow-[0_0_12px_rgba(245,184,46,0.2)] text-white"
                      : "border-white/10 bg-canvas-100/60 hover:border-white/20 hover:bg-canvas-200/80 text-ink-900"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>{preset.icon}</span>
                      <span className={isSelected ? "text-gold-300" : "text-white"}>
                        {preset.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-gold-400 bg-gold-500/20 px-1.5 py-0.5 rounded">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-500 leading-snug">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Cài đặt ưu tiên Đặc sản vùng miền */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-canvas-100/60 p-3">
            <div className="flex flex-col pr-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>🏮</span>
                <span>Ưu tiên đặc sản vùng miền</span>
              </span>
              <span className="text-[11px] text-ink-500 mt-0.5">
                Tăng gấp đôi xác suất xuất hiện các món đặc sản 3 miền được chứng nhận
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSpecialtyBoostChange(!specialtyBoost)}
              role="switch"
              aria-checked={specialtyBoost}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                specialtyBoost ? "bg-teal-500" : "bg-canvas-400"
              }`}
              aria-label="Bật hoặc tắt ưu tiên đặc sản vùng miền"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  specialtyBoost ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 4: Footer actions & reset */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetOdds}
            className="text-xs text-ink-500 hover:text-white transition-colors underline cursor-pointer"
          >
            Đặt lại tỉ lệ chuẩn
          </button>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 rounded-xl bg-gold-500 text-ink-900 font-bold text-xs hover:bg-gold-400 transition-colors cursor-pointer shadow-md"
          >
            Xong & Đóng
          </button>
        </div>
      </div>
    </Dialog>
  );
}
