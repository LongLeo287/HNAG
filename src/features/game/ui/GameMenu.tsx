import { Button } from "@/components/ui/Button";
import { SfxToggle } from "@/features/audio/SfxToggle";
import { BackgroundPicker } from "./BackgroundPicker";
import { MotionModePicker } from "./MotionModePicker";

interface GameMenuProps {
  disabled?: boolean;
  soundEnabled: boolean;
  onSoundChange: (enabled: boolean) => void;
  backgroundId: string;
  onBackgroundChange: (id: string) => void;
  reducedMotionOverride: boolean | null;
  onReducedMotionOverrideChange: (value: boolean | null) => void;
  onOpenPreferences: () => void;
  onReset: () => void;
}

/**
 * Phần Cài Đặt Hệ Thống (#HNAG Settings Panel):
 * Gom các tuỳ chọn khung cảnh, hiệu ứng chuyển động, âm thanh và dữ liệu vào một khối
 * cài đặt chuyên nghiệp, riêng biệt (user request 2026-09-11).
 */
export function GameMenu({
  disabled = false,
  soundEnabled,
  onSoundChange,
  backgroundId,
  onBackgroundChange,
  reducedMotionOverride,
  onReducedMotionOverrideChange,
  onOpenPreferences,
  onReset,
}: GameMenuProps) {
  return (
    <section
      id="settings-section"
      aria-label="Cài đặt hệ thống #HNAG"
      className="flex w-full flex-col gap-6 rounded-2xl border border-white/10 bg-canvas-200/60 p-5 sm:p-7 backdrop-blur-md shadow-xl transition-all"
    >
      {/* Settings Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-500/20 text-sm text-gold-400 shadow-sm">
            ⚙️
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-wide text-white uppercase">
              CÀI ĐẶT & TUỲ CHỌN
            </h3>
            <p className="text-[11px] text-ink-500">
              Khung cảnh thành phố, hiệu ứng chuyển động và dữ liệu trò chơi
            </p>
          </div>
        </div>

        {disabled && (
          <span
            role="status"
            className="rounded-full bg-gold-500/15 border border-gold-500/30 px-3 py-1 text-[11px] font-semibold text-gold-400 self-start sm:self-auto"
          >
            🔒 Đang mở hòm (Cài đặt tạm khóa)
          </span>
        )}
      </div>

      <fieldset
        disabled={disabled}
        className="flex w-full min-w-0 flex-col gap-6 disabled:opacity-50"
      >
        {/* Background Landmark Picker */}
        <div className="flex flex-col items-center gap-2">
          <BackgroundPicker value={backgroundId} onChange={onBackgroundChange} />
        </div>

        {/* Motion Accessibility Picker */}
        <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-5">
          <MotionModePicker
            value={reducedMotionOverride}
            onChange={onReducedMotionOverrideChange}
          />
        </div>
      </fieldset>

      {/* Audio & Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-5">
        <SfxToggle enabled={soundEnabled} onChange={onSoundChange} />
        <Button
          variant="secondary"
          onClick={onOpenPreferences}
          disabled={disabled}
        >
          Thực đơn của tôi
        </Button>
        <Button
          variant="ghost"
          onClick={onReset}
          disabled={disabled}
        >
          Đặt lại tất cả
        </Button>
      </div>
    </section>
  );
}
