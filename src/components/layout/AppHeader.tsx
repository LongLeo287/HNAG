interface AppHeaderProps {
  soundEnabled: boolean;
  onSoundChange: (enabled: boolean) => void;
  onOpenPreferences: () => void;
  onOpenSettings: () => void;
  /** This browser's own spin count only — #HNAG has no backend/M0-M1, so there is no real
   * cross-user total to show (DS-029: never present a fabricated number as a live statistic). */
  spinCount?: number;
  preferencesDisabled?: boolean;
}

export function AppHeader({
  soundEnabled,
  onSoundChange,
  onOpenPreferences,
  onOpenSettings,
  spinCount = 0,
  preferencesDisabled = false,
}: AppHeaderProps) {

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-canvas-100/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-600 shadow-[0_0_16px_rgba(245,184,46,0.35)]">
            <span className="text-lg sm:text-xl" role="img" aria-label="Hộp cơm mở hòm">
              🍱
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold tracking-wider text-white text-base sm:text-lg">
                #HNAG
              </span>
              <span className="hidden xs:inline rounded bg-gold-500/20 px-1.5 py-0.5 text-[10px] font-bold text-gold-400">
                CASE OPENING
              </span>
            </div>
            <p className="hidden text-[11px] text-ink-500 sm:block">
              Hôm Nay Ăn Gì? • Trợ lý chọn món ngẫu nhiên
            </p>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Stats Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-canvas-200/80 px-3 py-1 text-xs text-ink-500 md:flex">
            <span className="h-2 w-2 rounded-full bg-neon-400 animate-pulse-status" />
            <span>Trên trình duyệt này:</span>
            <strong className="text-ink-900 tabular-nums">{spinCount.toLocaleString("vi-VN")}</strong>
            <span className="text-ink-500">hòm</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={() => onSoundChange(!soundEnabled)}
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-canvas-200 px-3 text-xs font-medium text-ink-900 transition-colors hover:bg-canvas-300 hover:border-white/20"
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            <span>{soundEnabled ? "🔊" : "🔇"}</span>
            <span className="hidden sm:inline">
              {soundEnabled ? "Âm thanh" : "Tắt tiếng"}
            </span>
          </button>

          {/* Edit Pool / Preferences Drawer Button */}
          <button
            type="button"
            onClick={onOpenPreferences}
            disabled={preferencesDisabled}
            aria-label="Thực đơn của tôi"
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-gold-500/30 bg-gold-500/10 px-3 text-xs font-semibold text-gold-400 transition-all hover:bg-gold-500/20 hover:border-gold-500/50 disabled:opacity-50"
            title="Tuỳ chỉnh danh sách món của bạn"
          >
            <span>📋</span>
            <span className="hidden sm:inline">Thực đơn</span>
          </button>

          {/* Settings Drawer Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Cài đặt hệ thống"
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-canvas-200 px-2.5 sm:px-3 text-xs font-medium text-ink-900 transition-colors hover:bg-canvas-300 hover:border-white/20"
            title="Mở cài đặt hệ thống"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Cài đặt</span>
          </button>
        </div>
      </div>
    </header>
  );
}
