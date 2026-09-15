import type { CandidateItem, RarityTier } from "@/data/catalog";
import { categoryLabel } from "@/data/catalog";
import { RARITY_STYLE } from "@/lib/rarity";
import { DishImage } from "@/components/ui/DishImage";
import { cx } from "@/lib/cx";

interface RevealCardProps {
  winner: CandidateItem;
  reducedMotion?: boolean;
  winningProbability?: number;
}

function formatPrice(priceVnd: number | null): string {
  if (priceVnd === null) return "Chưa rõ giá";
  return `${priceVnd.toLocaleString("vi-VN")}đ`;
}

/** UI-011/FEAT-009: The grand payoff — CS:GO style victory unboxing presentation. */
export function RevealCard({ winner, reducedMotion = false, winningProbability }: RevealCardProps) {
  const rarity = RARITY_STYLE[winner.rarity as RarityTier];
  const categoryName = categoryLabel(winner.categoryId);
  const specialty = winner.regionalSpecialty;

  return (
    <div data-testid="winner-card" data-item-kind={winner.kind} data-category-id={winner.categoryId} data-item-id={winner.id} data-specialty-region={specialty?.region}
      className={cx("relative flex w-full flex-col items-center text-center", !reducedMotion && "animate-reveal-in",
        specialty && "specialty-card rounded-2xl border p-3", specialty && !reducedMotion && "specialty-reveal")}>
      {specialty && <div className="specialty-seal mb-3 flex w-full flex-col items-center rounded-xl border px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">✦ Đặc sản vùng miền ✦</span>
        <span className="mt-1 text-lg font-black">{specialty.locality}</span>
        <span className="text-[10px]">{specialty.region === "NORTH" ? "Miền Bắc" : specialty.region === "CENTRAL" ? "Miền Trung" : "Miền Nam"}</span>
      </div>}
      {/* Background Victory Beams / Rays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -inset-y-10 -z-10 flex items-center justify-center opacity-70"
      >
        <div
          className={cx(
            "h-72 w-72 rounded-full blur-3xl opacity-35",
            winner.rarity === "HUYEN_THOAI" && "bg-gold-500 opacity-60 animate-pulse-status",
            winner.rarity === "DINH" && "bg-purple-500 opacity-40",
            winner.rarity === "NGON" && "bg-blue-500 opacity-40",
            winner.rarity === "THUONG" && "bg-slate-500 opacity-25",
          )}
        />
      </div>

      {/* Header Badges Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        <span className="rounded-full bg-gold-500/20 border border-gold-500/30 px-3 py-0.5 text-[11px] font-bold tracking-wider text-gold-400 uppercase">
          🎉 KẾT QUẢ MỞ HÒM
        </span>
        <div className={cx("flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-extrabold uppercase backdrop-blur-sm shadow-sm", rarity.bgBadgeClass)}>
          <span>{rarity.glyph}</span>
          <span>{rarity.label}</span>
        </div>
        {winner.vegetarianPossible && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#163a2a]/90 border border-[#22c55e]/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#4ade80]">
            <span>🌱</span>
            <span>Có bản chay</span>
          </span>
        )}
      </div>

      {/* Winner Title & Category */}
      <div className="mb-2">
        <span className="text-[11px] font-bold text-ink-500 uppercase tracking-widest">
          {categoryName}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md mt-0.5">
          {winner.name}
        </h2>
        <p className="text-base font-extrabold text-gold-400 mt-0.5">
          {formatPrice(winner.priceVnd)}
        </p>
      </div>

      {/* Hero Showcase Dish Plate */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Radial Rarity Glow */}
        <div
          aria-hidden
          className={cx(
            "absolute h-36 w-36 rounded-full blur-2xl",
            winner.rarity === "HUYEN_THOAI" && "bg-gold-500 opacity-70 animate-pulse",
            winner.rarity === "DINH" && "bg-purple-500 opacity-50",
            winner.rarity === "NGON" && "bg-blue-500 opacity-50",
            winner.rarity === "THUONG" && "bg-slate-400 opacity-30",
          )}
        />
        <DishImage
          categoryId={winner.categoryId}
          itemId={winner.id}
          rarity={winner.rarity}
          alt={winner.name}
          className="h-32 w-32 sm:h-36 sm:w-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* Contextual location & characteristics */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-1.5">
        {winner.province && (
          <span className="rounded-lg bg-gold-500/15 border border-gold-500/30 px-2.5 py-0.5 text-xs font-semibold text-gold-300">
            📍 {winner.province}
          </span>
        )}
        {winner.mealTimes && winner.mealTimes.length > 0 && (
          <span className="rounded-lg bg-white/10 px-2.5 py-0.5 text-xs text-ink-300">
            🕒 {winner.mealTimes.slice(0, 2).join(" • ")}
          </span>
        )}
      </div>

      {winner.description && (
        <p className="max-w-md text-xs italic text-ink-400 mb-2 px-3 line-clamp-2">
          "{winner.description}"
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-ink-500 mb-2">
        Giá tham khảo, ảnh minh hoạ.
        {winner.vegetarianPossible && " Chọn phiên bản chay khi gọi món."}
      </p>
      {winningProbability !== undefined && <p data-testid="winner-probability" className="mb-2 text-xs text-ink-500">
        Tỉ lệ món này ở lượt vừa mở: {(winningProbability * 100).toLocaleString("vi-VN", { maximumFractionDigits: 3 })}%
      </p>}
      {specialty && <a href={specialty.sourceUrl} target="_blank" rel="noreferrer" className="mb-2 text-xs text-teal-300 underline">
        Tìm hiểu nguồn gốc món · Vietnam Tourism
      </a>}
    </div>
  );
}
