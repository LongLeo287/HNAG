import { useState, useRef, useEffect } from "react";

interface AppHeaderProps {
  soundEnabled: boolean;
  onSoundChange: (enabled: boolean) => void;
  onOpenPreferences: (initialTab?: "add" | "builtin") => void;
  onOpenSettings: () => void;
  onOpenOdds: () => void;
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
  onOpenOdds,
  spinCount = 0,
  preferencesDisabled = false,
}: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Stats Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-canvas-200/80 px-3 py-1 text-xs text-ink-500 md:flex">
            <span className="h-2 w-2 rounded-full bg-neon-400 animate-pulse-status" />
            <span>Trên trình duyệt này:</span>
            <strong className="text-ink-900 tabular-nums">{spinCount.toLocaleString("vi-VN")}</strong>
            <span className="text-ink-500">hòm</span>
          </div>

          {/* Quick Sound Toggle Button */}
          <button
            type="button"
            onClick={() => onSoundChange(!soundEnabled)}
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-canvas-200 px-3 text-xs font-medium text-ink-900 transition-colors hover:bg-canvas-300 hover:border-white/20 cursor-pointer"
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            <span>{soundEnabled ? "🔊" : "🔇"}</span>
            <span className="hidden sm:inline">
              {soundEnabled ? "Âm thanh" : "Tắt tiếng"}
            </span>
          </button>

          {/* Menu Dropdown Container */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Menu chức năng"
              className={`flex min-h-11 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold text-white transition-all shadow-md cursor-pointer ${
                menuOpen
                  ? "border-gold-400 bg-gold-500/20 text-gold-300 shadow-[0_0_12px_rgba(245,184,46,0.25)]"
                  : "border-white/15 bg-canvas-200 hover:bg-canvas-300 hover:border-gold-500/40"
              }`}
            >
              <span className="text-base leading-none">☰</span>
              <span>Menu</span>
              <span className={`text-[9px] transition-transform duration-200 ${menuOpen ? "rotate-180 text-gold-400" : "text-ink-500"}`}>
                ▼
              </span>
            </button>

            {/* Bảng nhỏ Menu (Floating Dropdown Panel) */}
            {menuOpen && (
              <div
                role="menu"
                aria-label="Bảng chức năng Menu"
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-white/15 bg-[#121822]/98 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Menu chức năng</span>
                  <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full">#HNAG</span>
                </div>

                <div className="flex flex-col gap-1">
                  {/* 1. Tỉ lệ mở hòm (Rarity Odds) */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenOdds();
                    }}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left text-xs transition-colors hover:bg-white/10 group cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 group-hover:scale-105 transition-transform">
                      <span className="text-base">📊</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white group-hover:text-teal-300 transition-colors">Tỉ lệ mở hòm</div>
                      <div className="text-[11px] text-ink-500 truncate">Xem xác suất rơi món theo bộ lọc</div>
                    </div>
                    <span className="text-ink-700 group-hover:text-white transition-colors text-xs">→</span>
                  </button>

                  {/* 2. Cài đặt hệ thống (Settings) */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left text-xs transition-colors hover:bg-white/10 group cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400 group-hover:scale-105 transition-transform">
                      <span className="text-base">⚙️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white group-hover:text-gold-300 transition-colors">Cài đặt hệ thống</div>
                      <div className="text-[11px] text-ink-500 truncate">Khung cảnh, chuyển động & âm thanh</div>
                    </div>
                    <span className="text-ink-700 group-hover:text-white transition-colors text-xs">→</span>
                  </button>

                  {/* 3. Thêm món riêng (Add dish) */}
                  <button
                    type="button"
                    role="menuitem"
                    disabled={preferencesDisabled}
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPreferences("add");
                    }}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left text-xs transition-colors hover:bg-white/10 disabled:opacity-50 group cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                      <span className="text-base">➕</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white group-hover:text-amber-300 transition-colors">Thêm món riêng</div>
                      <div className="text-[11px] text-ink-500 truncate">Thêm món ruột hoặc quán quen yêu thích</div>
                    </div>
                    <span className="text-ink-700 group-hover:text-white transition-colors text-xs">→</span>
                  </button>

                  {/* 4. Thực đơn của tôi (My custom/built-in menu) */}
                  <button
                    type="button"
                    role="menuitem"
                    disabled={preferencesDisabled}
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPreferences("builtin");
                    }}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left text-xs transition-colors hover:bg-white/10 disabled:opacity-50 group cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                      <span className="text-base">📋</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">Thực đơn của tôi</div>
                      <div className="text-[11px] text-ink-500 truncate">Bật / ẩn món trong kho 1.731 món</div>
                    </div>
                    <span className="text-ink-700 group-hover:text-white transition-colors text-xs">→</span>
                  </button>
                </div>

                <div className="border-t border-white/10 mt-1.5 pt-2 px-1">
                  {/* Sound toggle inside menu */}
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{soundEnabled ? "🔊" : "🔇"}</span>
                      <span className="text-xs text-white font-medium">Âm thanh hiệu ứng</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSoundChange(!soundEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        soundEnabled ? "bg-gold-500" : "bg-canvas-400"
                      }`}
                      aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          soundEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
