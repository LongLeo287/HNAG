import { RARITY_LABEL, RARITY_ORDER } from "@/data/catalog";
import type { DrawOdds } from "@/features/randomizer/domain";
import { RARITY_STYLE } from "@/lib/rarity";

export function RarityOdds({ odds, respin = false }: { odds: DrawOdds; respin?: boolean }) {
  if (odds.eligiblePool.length === 0) return null;
  const rows = RARITY_ORDER.map((tier) => ({
    tier,
    probability: odds.eligiblePool.reduce((sum, item, i) => sum + (item.rarity === tier ? odds.probabilities[i]! : 0), 0),
  }));
  const missingTier = rows.some((row) => row.probability === 0);
  const specialtyProbability = odds.eligiblePool.reduce((sum, item, i) => sum + (item.regionalSpecialty ? odds.probabilities[i]! : 0), 0);
  return (
    <section aria-label={respin ? "Tỉ lệ quay tiếp" : "Tỉ lệ mở hộp"} className="w-full rounded-xl border border-white/10 bg-canvas-100/80 p-3 text-xs">
      <h2 className="mb-2 font-semibold text-ink-700">{respin ? "Tỉ lệ nếu quay tiếp" : "Tỉ lệ mở theo bộ lọc hiện tại"}</h2>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {rows.map(({ tier, probability }) => (
          <div key={tier} className="flex flex-wrap items-center justify-between gap-1 rounded-lg bg-canvas-200 px-2 py-2">
            <dt className={RARITY_STYLE[tier].textClass}>{RARITY_LABEL[tier]}</dt>
            <dd className="font-semibold tabular-nums text-white">{(probability * 100).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%</dd>
          </div>
        ))}
      </dl>
      <p data-testid="specialty-odds" className="mt-2 font-semibold text-teal-300">
        Đặc sản vùng miền: {(specialtyProbability * 100).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%
      </p>
      {specialtyProbability > 0 && <p className="mt-1 leading-relaxed text-ink-500">
        Cùng hạng và mức phù hợp giá, mỗi đặc sản có trọng số bằng một nửa món thường. Tổng tỉ lệ từng hạng không tăng.
      </p>}
      <p className="mt-2 leading-relaxed text-ink-500">
        {missingTier && "Hạng không có món phù hợp là 0%; các hạng còn lại được chia lại tỉ lệ. "}
        {respin ? "Quay tiếp bỏ món vừa trúng nếu còn món khác cùng hạng. Hạng chỉ có một món có thể lặp lại. " : "Hạng thể hiện độ hiếm, không đánh giá chất lượng món. "}
        <span>Dải thẻ chỉ minh hoạ; tỉ lệ không bảo đảm số lượt để trúng.</span>
      </p>
    </section>
  );
}
