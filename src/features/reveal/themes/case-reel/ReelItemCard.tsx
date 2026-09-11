import type { CandidateItem, RarityTier } from "@/data/catalog";
import { RARITY_STYLE } from "@/lib/rarity";
import { categoryLabel } from "@/data/catalog";
import { DishImage } from "@/components/ui/DishImage";
import { cx } from "@/lib/cx";

interface ReelItemCardProps {
  item: CandidateItem;
  isWinner: boolean;
}

function formatShortPrice(priceVnd: number | null): string {
  if (priceVnd === null) return "Tuỳ quán";
  return `${Math.round(priceVnd / 1000)}k`;
}

/**
 * CS:GO weapon crate & truanayangi.com style Reel Card:
 * Displays photorealistic dish plate on dark slate, item name, price tag, and colored rarity stripe.
 */
export function ReelItemCard({ item, isWinner }: ReelItemCardProps) {
  const rarity = RARITY_STYLE[item.rarity as RarityTier];
  const categoryName = categoryLabel(item.categoryId);

  return (
    <div
      className={cx(
        "group relative flex h-48 w-36 shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#151c24] shadow-lg transition-transform",
        isWinner
          ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-black shadow-[0_0_28px_rgba(245,184,46,0.7)] scale-[1.02]"
          : "hover:border-white/20",
      )}
    >
      {/* Top Badges: Veg & Price */}
      <div className="absolute top-2 inset-x-2 z-10 flex items-center justify-between pointer-events-none">
        {item.vegetarianPossible ? (
          <span className="rounded-full bg-[#163a2a]/90 border border-[#22c55e]/40 px-1.5 py-0.5 text-[9px] font-bold text-[#4ade80] backdrop-blur-sm">
            🌱 Có bản chay
          </span>
        ) : (
          <span />
        )}
        <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-ink-500 backdrop-blur-sm tabular-nums">
          {formatShortPrice(item.priceVnd)}
        </span>
      </div>

      {/* Plate Image Section */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-[#10151c] to-[#151c24] p-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06)_0%,_transparent_70%)]" />
        <DishImage
          categoryId={item.categoryId}
          itemId={item.id}
          rarity={item.rarity}
          alt={item.name}
          className="h-24 w-24"
        />
      </div>

      {/* Dish Name & Subtitle */}
      <div className="bg-[#121820] px-2 py-2 border-t border-white/5">
        <span className="block truncate text-center text-xs font-bold text-white" title={item.name}>
          {item.name}
        </span>
        <span className="block truncate text-center text-[10px] text-ink-500">
          {categoryName}
        </span>
      </div>

      {/* Rarity Bottom Stripe */}
      <div className="h-[3px] w-full bg-canvas-400">
        <div className={cx("h-full w-full", rarity.barClass, isWinner && rarity.glowClass)} />
      </div>
    </div>
  );
}
