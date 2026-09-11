import { useState, useMemo } from "react";
import type { CandidateItem, RarityTier } from "@/data/catalog";
import { categoryLabel } from "@/data/catalog";
import { RARITY_STYLE } from "@/lib/rarity";
import { DishImage } from "@/components/ui/DishImage";
import { cx } from "@/lib/cx";

interface CatalogExplorerProps {
  items: CandidateItem[];
  onOpenPreferences: () => void;
}

function formatPrice(priceVnd: number | null): string {
  return priceVnd === null ? "Tuỳ quán" : `${priceVnd.toLocaleString("vi-VN")}đ`;
}

function searchText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLocaleLowerCase("vi-VN").trim();
}

/**
 * CS:GO & truanayangi.com inspired case content explorer:
 * High-fidelity food cards with large circular dish photography, category tags,
 * prices, dietary flags, and colored rarity footers.
 */
export function CatalogExplorer({ items, onOpenPreferences }: CatalogExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("ALL");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        searchText(item.name).includes(searchText(searchQuery));
      const matchesRarity =
        rarityFilter === "ALL" || item.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });
  }, [items, searchQuery, rarityFilter]);

  if (items.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl border border-white/10 bg-canvas-100/80 p-4 sm:p-6 backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
            MÓN TRONG HỘP
          </div>
          <h2 className="text-lg font-bold text-white flex flex-wrap items-center gap-2">
            <span>Các lựa chọn của lượt quay</span>
            <span className="rounded-full bg-canvas-300 px-2 py-0.5 text-xs text-ink-500 font-semibold">
              {filteredItems.length} / {items.length} món
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenPreferences}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-white/10 bg-canvas-200 px-3.5 py-2 text-xs font-semibold text-ink-900 transition-colors hover:bg-canvas-300 hover:border-white/20"
        >
          <span>✏️</span>
          <span>Chọn danh mục & thêm món</span>
        </button>
      </div>

      <p className="text-xs leading-relaxed text-ink-500">
        Tìm kiếm bên dưới chỉ đổi danh sách xem trước. Bộ lọc phía trên quyết định món được quay.
        Màu thẻ chỉ là hiệu ứng, không thể hiện chất lượng hay xác suất. Giá và ảnh mang tính minh hoạ.
      </p>
      {/* Filter & Search Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-ink-500">
            🔍
          </span>
          <input
            type="text"
            aria-label="Tìm món trong danh sách xem trước"
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-canvas-200/80 py-2.5 pl-9 pr-8 text-xs text-white placeholder:text-ink-500 focus:border-gold-500/50 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Xoá tìm kiếm"
              className="absolute right-0 top-1/2 min-h-11 min-w-11 -translate-y-1/2 text-xs text-ink-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Rarity filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none]">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "HUYEN_THOAI", label: "★ Đặc biệt", color: "text-gold-400" },
            { id: "DINH", label: "★ Tím", color: "text-epic-400" },
            { id: "NGON", label: "★ Hiếm", color: "text-rare-400" },
            { id: "THUONG", label: "Thường", color: "text-steel-400" },
          ].map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setRarityFilter(tier.id)}
              aria-pressed={rarityFilter === tier.id}
              className={cx(
                "min-h-11 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
                rarityFilter === tier.id
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/40 shadow-sm"
                  : "bg-canvas-200 text-ink-500 hover:text-ink-900 border border-transparent",
              )}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Dishes matching Image 2 */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 max-h-[640px] overflow-y-auto p-1 [scrollbar-width:thin]">
        {filteredItems.map((item) => {
          const rarity = RARITY_STYLE[item.rarity as RarityTier];
          const categoryName = categoryLabel(item.categoryId);

          return (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#151c24] transition-all hover:border-white/25 hover:bg-[#1a232e] hover:shadow-xl"
            >
              {/* Top Vegetarian Badge */}
              <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                {item.vegetarianPossible && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#163a2a]/90 border border-[#22c55e]/40 px-2 py-0.5 text-[10px] font-bold text-[#4ade80] backdrop-blur-sm shadow-sm">
                    <span>🌱</span>
                    <span>Có bản chay</span>
                  </span>
                )}
              </div>

              {/* Upper Image Section with Circular Dish Plate */}
              <div className="relative flex h-36 items-center justify-center bg-gradient-to-b from-[#10151c] to-[#151c24] p-3">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06)_0%,_transparent_75%)]" />
                <DishImage
                  categoryId={item.categoryId}
                  itemId={item.id}
                  rarity={item.rarity}
                  alt={item.name}
                  className="h-28 w-28"
                />
              </div>

              {/* Lower Info Section matching Image 2 */}
              <div className="flex flex-1 flex-col justify-between p-3 bg-[#151c24] border-t border-white/5">
                <div>
                  <span className="block text-[11px] font-medium text-ink-500 mb-0.5">
                    {categoryName}
                  </span>
                  <h3
                    className="line-clamp-1 text-sm font-bold text-white group-hover:text-gold-400 transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-1">
                  <span className="text-xs sm:text-sm font-extrabold text-white tabular-nums">
                    {formatPrice(item.priceVnd)}
                  </span>
                  <span className={cx("text-[11px] font-bold tracking-tight", rarity.textClass)}>
                    {rarity.label}
                  </span>
                </div>
              </div>

              {/* Bottom Solid Rarity Stripe */}
              <div className="h-[3px] w-full bg-canvas-400">
                <div className={cx("h-full w-full", rarity.barClass)} />
              </div>
            </div>
          );
        })}
      </div>
      {filteredItems.length === 0 && <p role="status" className="py-6 text-center text-sm text-ink-500">Không có món khớp tìm kiếm. Thử tên khác hoặc chọn “Tất cả”.</p>}
    </section>
  );
}
