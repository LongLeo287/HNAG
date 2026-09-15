import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { SfxToggle } from "@/features/audio/SfxToggle";
import { RarityOdds } from "@/components/ui/RarityOdds";
import type { DrawOdds } from "@/features/randomizer/domain";
import { BackgroundPicker } from "./BackgroundPicker";
import { MotionModePicker } from "./MotionModePicker";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  soundEnabled: boolean;
  onSoundChange: (enabled: boolean) => void;
  backgroundId: string;
  onBackgroundChange: (id: string) => void;
  reducedMotionOverride: boolean | null;
  onReducedMotionOverrideChange: (value: boolean | null) => void;
  onOpenPreferences: () => void;
  onReset: () => void;
  odds?: DrawOdds;
}

/**
 * Slide-over Settings Drawer (User request 2026-09-11):
 * Trượt mượt mà từ cạnh phải trình duyệt ra khi bấm Cài đặt, và trượt ngược lại vào mép phải khi đóng.
 * Sử dụng 2-phase animation (shouldRender + active) để đảm bảo cả hiệu ứng mở và đóng đều trượt 100%.
 */
export function SettingsDrawer({
  open,
  onOpenChange,
  disabled = false,
  soundEnabled,
  onSoundChange,
  backgroundId,
  onBackgroundChange,
  reducedMotionOverride,
  onReducedMotionOverrideChange,
  onOpenPreferences,
  onReset,
  odds,
}: SettingsDrawerProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Esc key listener to slide back out
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={`drawer-container fixed inset-0 z-50 overflow-hidden ${
        open ? "drawer-open" : ""
      }`}
    >
      {/* Backdrop with fade in/out */}
      <div
        onClick={() => onOpenChange(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Slide-over Drawer Panel - Slides in from right and slides back to right */}
      <aside
        role="dialog"
        aria-label="Cài đặt hệ thống"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-canvas-100/98 backdrop-blur-2xl shadow-[-16px_0_40px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-in-out will-change-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-canvas-200/80 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/20 text-base text-gold-400 shadow-sm">
              ⚙️
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-wide text-white uppercase">
                CÀI ĐẶT & TUỲ CHỌN
              </h2>
              <p className="text-[11px] text-ink-500">
                Khung cảnh, chuyển động và âm thanh
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Đóng cài đặt"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-canvas-300/80 text-ink-700 hover:bg-canvas-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {disabled && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-gold-500/40 bg-gold-500/10 p-3 text-xs font-semibold text-gold-400"
            >
              <span>🔒</span>
              <span>Đang mở hòm • Cài đặt tạm khóa cho đến khi quay xong</span>
            </div>
          )}

          <fieldset
            disabled={disabled}
            className="flex flex-col gap-6 disabled:opacity-50"
          >
            {/* Section: Rarity Odds (Moved into Menu per UX/UI request) */}
            {odds && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📊</span>
                  <span className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                    Tỉ lệ mở hòm (Rarity Odds)
                  </span>
                </div>
                <RarityOdds odds={odds} />
              </div>
            )}

            {/* Section 1: Background Landmark */}
            <div className="flex flex-col gap-2.5 border-t border-white/10 pt-5">
              <BackgroundPicker
                value={backgroundId}
                onChange={onBackgroundChange}
              />
            </div>

            {/* Section 2: Motion Mode */}
            <div className="flex flex-col gap-2.5 border-t border-white/10 pt-5">
              <MotionModePicker
                value={reducedMotionOverride}
                onChange={onReducedMotionOverrideChange}
              />
            </div>

            {/* Section 3: Audio & System */}
            <div className="flex flex-col gap-4 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  Âm thanh trò chơi
                </span>
                <SfxToggle enabled={soundEnabled} onChange={onSoundChange} />
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenPreferences();
                  }}
                  disabled={disabled}
                  className="w-full justify-center"
                >
                  Thực đơn của tôi
                </Button>
                <Button
                  variant="ghost"
                  onClick={onReset}
                  disabled={disabled}
                  className="w-full justify-center text-chili-400 hover:text-chili-300"
                >
                  Đặt lại tất cả
                </Button>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-white/10 bg-canvas-200/50 p-4">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="w-full justify-center"
          >
            Xong & Đóng
          </Button>
        </div>
      </aside>
    </div>,
    document.body
  );
}
