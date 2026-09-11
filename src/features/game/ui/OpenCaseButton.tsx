interface OpenCaseButtonProps {
  onClick: () => void;
  disabled?: boolean;
  itemCount?: number;
  isSpinning?: boolean;
  crateName?: string;
  accentHex?: string;
}

/**
 * Tactical CS:GO style Open Case Button:
 * Neon green / crate-tinted gradient, ambient glow, shimmer animation, and tactile press feel.
 */
export function OpenCaseButton({
  onClick,
  disabled = false,
  itemCount,
  isSpinning = false,
  crateName = "Hòm Tiếp Tế",
  accentHex,
}: OpenCaseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isSpinning}
      aria-label={isSpinning ? `Đang mở hộp ${crateName}` : `Mở hộp ${crateName} / Quay`}
      className="group relative flex w-full max-w-md items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-neon-500 via-neon-400 to-neon-500 px-8 py-4 text-center font-extrabold text-white shadow-[0_0_28px_rgba(98,179,39,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(98,179,39,0.7)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      style={
        accentHex
          ? {
              boxShadow: `0 0 30px ${accentHex}55`,
            }
          : undefined
      }
    >
      {/* Shimmer sweep effect */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
      />

      <span className={`text-2xl drop-shadow ${isSpinning ? "animate-spin" : ""}`}>
        {isSpinning ? "🎰" : "🔓"}
      </span>
      <span className="text-base sm:text-lg tracking-wide uppercase text-black font-black">
        {isSpinning ? `Đang mở ${crateName}...` : `Mở ${crateName}`}
      </span>
      {itemCount !== undefined && !isSpinning && (
        <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-xs font-bold text-black shadow-sm">
          {itemCount} món
        </span>
      )}
    </button>
  );
}

