import { RARITY_LABEL, type RarityTier } from "@/data/catalog";

/**
 * Shared visual tokens for v2 drop-frequency tiers; never a food quality ranking.
 */
export const RARITY_STYLE: Record<
  RarityTier,
  {
    frameClass: string;
    barClass: string;
    glowClass: string;
    glyph: string;
    textClass: string;
    label: string;
    bgBadgeClass: string;
  }
> = {
  THUONG: {
    frameClass: "border-steel-500",
    barClass: "bg-steel-500",
    glowClass: "",
    glyph: "●",
    textClass: "text-steel-400",
    label: RARITY_LABEL.THUONG,
    bgBadgeClass: "bg-steel-500/20 text-steel-400 border-steel-500/30",
  },
  NGON: {
    frameClass: "border-rare-500",
    barClass: "bg-rare-500",
    glowClass: "shadow-[0_0_14px_-2px_theme(colors.rare.400)]",
    glyph: "◆",
    textClass: "text-rare-400",
    label: RARITY_LABEL.NGON,
    bgBadgeClass: "bg-rare-500/20 text-rare-400 border-rare-500/30",
  },
  DINH: {
    frameClass: "border-epic-500",
    barClass: "bg-epic-500",
    glowClass: "shadow-[0_0_18px_-2px_theme(colors.epic.400)]",
    glyph: "★",
    textClass: "text-epic-400",
    label: RARITY_LABEL.DINH,
    bgBadgeClass: "bg-epic-500/20 text-epic-400 border-epic-500/30",
  },
  HUYEN_THOAI: {
    frameClass: "border-gold-500",
    barClass: "bg-gold-500",
    glowClass: "shadow-[0_0_28px_-2px_theme(colors.gold.400)]",
    glyph: "✦",
    textClass: "text-gold-400",
    label: RARITY_LABEL.HUYEN_THOAI,
    bgBadgeClass: "bg-gold-500/20 text-gold-400 border-gold-500/30",
  },
};
