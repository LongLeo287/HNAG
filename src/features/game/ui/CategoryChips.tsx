import type { Category } from "@/data/catalog";
import { Chip } from "@/components/ui/Chip";

interface CategoryChipsProps {
  categories: Category[];
  selected: string[];
  countsByCategory?: Record<string, number>;
  onChange: (categoryIds: string[]) => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  com: "🍚",
  bun: "🍜",
  "pho-mi": "🍲",
  "chao-sup": "🥣",
  "lau-nuong": "🥘",
  banh: "🥖",
  "an-vat": "🍢",
  fastfood: "🍔",
  cafe: "☕",
  "tra-sua": "🧋",
  tra: "🍵",
  "ep-sinh-to": "🥤",
  "da-xay": "🍧",
  "banh-mi": "🥖", "mon-man": "🍽️", "trang-mieng": "🍮", "nuoc-khac": "🥛", "co-con": "🍷",
};

/** UI: FEAT-006. Multi-select category narrowing with emoji visual cues and real-time counts. */
export function CategoryChips({
  categories,
  selected,
  countsByCategory,
  onChange,
}: CategoryChipsProps) {

  function toggle(categoryId: string) {
    onChange(
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId],
    );
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500 flex items-center gap-1.5">
          <span>🏷️</span>
          <span>Nhóm món</span>
          {selected.length > 0 && (
            <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-bold text-gold-400">
              {selected.length} đang chọn
            </span>
          )}
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition-colors py-0.5"
          >
            ✕ Bỏ lọc tất cả
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2" role="group" aria-label="Lọc theo loại món">
        {categories.map((category) => {
          const emoji = CATEGORY_EMOJIS[category.id] ?? "";
          const count = countsByCategory?.[category.id];
          const isSelected = selected.includes(category.id);
          return (
            <Chip
              key={category.id}
              pressed={isSelected}
              count={count}
              onClick={() => toggle(category.id)}
            >
              {emoji} {category.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
}
