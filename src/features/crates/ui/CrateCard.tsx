import type { CrateDefinition } from "@/data/crates";

interface CrateCardProps {
  crate: CrateDefinition;
  isSelected: boolean;
  itemCount: number;
  disabled?: boolean;
  onSelect: (crateId: CrateDefinition["id"]) => void;
}

/**
 * CS:GO Armory / Market Weapon Case Card:
 * Renders the authentic 3D isometric military Pelican weapon case,
 * ambient theme-colored backlight, tactical stencil series, clean case title,
 * and CS:GO market-style metadata.
 */
export function CrateCard({
  crate,
  isSelected,
  itemCount,
  disabled = false,
  onSelect,
}: CrateCardProps) {
  const { theme } = crate;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`${crate.name}, ${itemCount} món, ${crate.tagline}`}
      disabled={disabled}
      onClick={() => onSelect(crate.id)}
      className={`group relative flex flex-col items-center justify-between overflow-hidden rounded-xl border p-2.5 sm:p-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 select-none ${
        isSelected
          ? `${theme.activeBorderClass} ${theme.glowClass} bg-gradient-to-b from-canvas-200/90 via-canvas-100/95 to-canvas-200/90 -translate-y-1 shadow-2xl`
          : "border-white/10 bg-canvas-200/50 hover:bg-canvas-200/85 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm opacity-85 hover:opacity-100"
      } ${disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
      style={{
        minWidth: "155px",
        flex: "1 1 0px",
      }}
    >
      {/* Top Ambient Glow Cone */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-24 w-36 rounded-full blur-2xl transition-opacity duration-300 ${
          isSelected ? "opacity-40" : "opacity-0 group-hover:opacity-20"
        }`}
        style={{ backgroundColor: theme.primaryHex }}
      />

      {/* Center 3D CS:GO Weapon Crate Image - Enlarged to fit the card nicely */}
      <div className="relative my-1 flex h-32 sm:h-36 w-full items-center justify-center overflow-hidden">
        {/* Ambient Backlight Behind Crate */}
        <div
          aria-hidden
          className={`absolute h-24 w-28 rounded-full blur-xl transition-opacity duration-300 ${
            isSelected ? "opacity-70 scale-110" : "opacity-20 group-hover:opacity-45"
          }`}
          style={{ backgroundColor: theme.primaryHex }}
        />

        {/* Photorealistic 3D Crate Image */}
        <img
          src={crate.imageSrc}
          alt={crate.name}
          className={`relative z-10 h-full w-full max-h-32 sm:max-h-36 object-contain filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-105 ${
            isSelected ? "scale-102" : "scale-100"
          }`}
          loading="lazy"
        />
      </div>

      {/* Crate Information: Clean bold title only */}
      <div className="w-full border-t border-white/10 pt-2 pb-0.5 text-center">
        <span className={`block text-xs sm:text-sm font-black tracking-wide truncate ${isSelected ? theme.textAccentClass : "text-white group-hover:text-gold-300"}`}>
          {crate.name}
        </span>
      </div>

      {/* Downward pointer triangle connecting to CrateStage when active */}
      {isSelected && (
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-solid border-t-[6px] border-x-[6px] border-x-transparent z-20"
          style={{ borderTopColor: theme.primaryHex }}
        />
      )}
    </button>
  );
}
