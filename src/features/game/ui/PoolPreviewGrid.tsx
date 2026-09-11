import type { CandidateItem } from "@/data/catalog";
import { RARITY_STYLE } from "@/lib/rarity";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { cx } from "@/lib/cx";

interface PoolPreviewGridProps {
  items: CandidateItem[];
}

function formatPrice(priceVnd: number | null): string {
  return priceVnd === null ? "Chưa rõ giá" : `${priceVnd.toLocaleString("vi-VN")}đ`;
}

/**
 * Secondary, supporting panel — shows the eligible pool for the *current* filters before OPEN,
 * echoing the reference "Contains one of the following" transparency pattern (user reference
 * 2026-09-11). Deliberately smaller and placed below the primary OPEN action (CODE-039): this
 * is scoped to the active game session's pool, not a persistent/searchable public catalog
 * (PV-026) — it has no sort/search/pagination and disappears once OPEN is pressed.
 *
 * The trailing "Ẩn số" card is honest, not decorative filler: OPEN always keeps the winner
 * frozen/hidden until the reveal (CODE-019), so "there's always a hidden pick" is literally
 * true of every spin, not an implied extra secret item/rarity tier.
 */
export function PoolPreviewGrid({ items }: PoolPreviewGridProps) {
  if (items.length === 0) return null;
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
        Trong hộp có thể có ({items.length})
      </span>
      <div className="hnag-scroll flex gap-2 overflow-x-auto pb-2">
        {items.map((item) => {
          const rarity = RARITY_STYLE[item.rarity];
          return (
            <div key={item.id} className="flex w-24 shrink-0 flex-col overflow-hidden rounded-hnag bg-canvas-300">
              <div className="flex h-20 items-center justify-center bg-canvas-200">
                <CategoryArt categoryId={item.categoryId} itemId={item.id} className="h-12 w-12" />
              </div>
              <span className="line-clamp-2 px-1.5 pt-1.5 text-center text-[11px] font-semibold text-ink-900">
                {item.name}
              </span>
              <span className="line-clamp-1 px-1.5 pb-1 text-center text-[10px] text-ink-500">
                {formatPrice(item.priceVnd)}
              </span>
              <span className={cx("mx-1.5 mt-0.5 mb-1.5 h-1 rounded-full", rarity.barClass, rarity.glowClass)} />
            </div>
          );
        })}

        <div className="flex w-24 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-hnag bg-canvas-300 shadow-[0_0_16px_-2px_theme(colors.turmeric.400)]">
          <div className="flex h-20 w-full items-center justify-center bg-canvas-200">
            <span aria-hidden className="text-3xl text-turmeric-500">
              ?
            </span>
          </div>
          <span className="px-1.5 pt-1.5 text-center text-[11px] font-semibold text-turmeric-500">Ẩn số</span>
          <span className="line-clamp-1 px-1.5 pb-1 text-center text-[10px] text-ink-500">Giữ bí mật đến lúc mở</span>
          <span className="mx-1.5 mt-0.5 mb-1.5 h-1 rounded-full bg-turmeric-500" />
        </div>
      </div>
    </div>
  );
}
