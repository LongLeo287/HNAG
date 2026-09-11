import { useState } from "react";
import type { ItemKind } from "@/data/catalog";
import { categoriesForKind } from "@/data/catalog";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import type { CustomItemInput } from "../types";
import type { AddCustomItemResult } from "../pool";

interface CustomItemFormProps {
  kind: ItemKind;
  onAdd: (input: CustomItemInput) => AddCustomItemResult | { ok: false; error: string };
}

/** UI-051: add a custom food/drink to the personal pool. Bound lengths, validated locally (CODE-007). */
export function CustomItemForm({ kind, onAdd }: CustomItemFormProps) {
  const categories = categoriesForKind(kind);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [price, setPrice] = useState("");
  const [vegetarianPossible, setVegetarianPossible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const priceVnd = price.trim() === "" ? null : Number.parseInt(price, 10);
    const result = onAdd({
      kind,
      name,
      categoryId,
      priceVnd: Number.isFinite(priceVnd) ? priceVnd : null,
      vegetarianPossible,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setName("");
    setPrice("");
    setVegetarianPossible(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-300">
        Tên món
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          required
          className="min-h-11 rounded-xl border border-white/15 bg-canvas-100/90 px-3.5 text-sm text-white placeholder:text-ink-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all"
          placeholder="Ví dụ: Bún đậu nhà làm"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-300">
        Loại
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="min-h-11 rounded-xl border border-white/15 bg-canvas-100/90 px-3.5 text-sm text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="bg-canvas-200 text-white">
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-300">
        Giá ước tính (VNĐ, để trống nếu chưa rõ)
        <input
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          inputMode="numeric"
          pattern="[0-9]*"
          className="min-h-11 rounded-xl border border-white/15 bg-canvas-100/90 px-3.5 text-sm text-white placeholder:text-ink-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all"
          placeholder="35000"
        />
      </label>
      <div className="py-1">
        <Switch
          id="custom-item-veg"
          checked={vegetarianPossible}
          onChange={setVegetarianPossible}
          label="Có thể ăn chay"
        />
      </div>
      {error && (
        <p role="alert" className="text-xs font-semibold text-chili-400">
          {error}
        </p>
      )}
      <Button type="submit" variant="secondary" className="w-full justify-center">
        Thêm vào danh sách
      </Button>
    </form>
  );
}
