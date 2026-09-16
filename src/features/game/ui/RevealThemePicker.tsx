import { REVEAL_THEMES } from "@/data/revealThemes";

interface RevealThemePickerProps {
  value: string;
  onChange: (themeId: string) => void;
  onHover?: () => void;
  disabled?: boolean;
}

/**
 * Menu Kiểu Mở Kết Quả (Game Mode / Unboxing Style Menu):
 * Dedicated standalone menu per user request:
 * Allows user to pick their unboxing style (or press [C] to cycle):
 * 🎰 Case Reel (CS:GO) • 📦 Blindbox (Popmart) • 🎡 Vòng quay (Lucky Wheel) • 🎲 Slot Machine • 🃏 Lật bài (Card Flip)
 */
export function RevealThemePicker({
  value,
  onChange,
  onHover,
  disabled = false,
}: RevealThemePickerProps) {
  return (
    <nav
      aria-label="Kiểu mở kết quả"
      className="w-full max-w-4xl min-w-0 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-canvas-200/50 p-2.5 sm:p-4 backdrop-blur-md shadow-lg transition-all"
    >
      {/* Menu Header */}
      <div className="flex w-full items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gold-500/20 text-xs text-gold-400">
            ✨
          </span>
          <span className="text-xs font-black tracking-widest text-ink-700 uppercase">
            KIỂU MỞ KẾT QUẢ
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-ink-500 font-mono">
            <span>Phím</span>
            <kbd className="rounded border border-white/20 bg-canvas-200 px-1 py-0.5 text-[10px] text-gold-400 font-bold">C</kbd>
            <span>để đổi</span>
          </span>
          <span className="text-[11px] text-ink-500">
            5 kiểu
          </span>
        </div>
      </div>

      {/* Mode Buttons Grid */}
      <div
        role="radiogroup"
        aria-label="Chọn kiểu mở kết quả"
        className="grid w-full min-w-0 grid-cols-2 gap-1.5 sm:gap-2 sm:grid-cols-5"
      >
        {REVEAL_THEMES.map((theme) => {
          const isSelected = value === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(theme.id)}
              onPointerEnter={onHover}
              title={theme.blurb}
              className={`group relative min-w-0 flex flex-col items-center justify-center gap-1 rounded-xl border py-2 sm:py-2.5 px-2 text-center transition-all ${
                isSelected
                  ? "border-gold-500/80 bg-gradient-to-b from-gold-500/20 to-canvas-200/90 text-white shadow-[0_0_16px_rgba(245,158,11,0.22)] scale-[1.02]"
                  : "border-white/10 bg-canvas-100/60 text-ink-700 hover:border-white/25 hover:bg-canvas-200 hover:text-white"
              } disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]`}
            >
              {/* Active top beacon glow */}
              {isSelected && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-gold-400 shadow-[0_0_8px_#F59E0B]"
                />
              )}

              <span
                className={`text-2xl transition-transform duration-200 ${
                  isSelected ? "scale-110 drop-shadow" : "group-hover:scale-105"
                }`}
              >
                {theme.glyph}
              </span>

              <span
                className={`text-xs sm:text-sm font-extrabold tracking-wide ${
                  isSelected ? "text-gold-400" : "text-white"
                }`}
              >
                {theme.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
