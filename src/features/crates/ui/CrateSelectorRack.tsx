import { cratesForKind, type CrateId } from "@/data/crates";
import type { ItemKind } from "@/data/catalog";
import { CrateCard } from "./CrateCard";

interface CrateSelectorRackProps {
  kind: ItemKind;
  selectedCrateId: CrateId;
  countsByCrate: Record<CrateId, number>;
  disabled?: boolean;
  onSelectCrate: (crateId: CrateId) => void;
}

/**
 * CS:GO Case Selector Rack:
 * Displays the 5 tactical supply cases (Bữa Chính, Giải Khát, Ăn Vặt, Ăn Nhậu, Đồ Chay).
 * Users pick which case they want to open before inspecting the candidate reel.
 */
export function CrateSelectorRack({
  kind,
  selectedCrateId,
  countsByCrate,
  disabled = false,
  onSelectCrate,
}: CrateSelectorRackProps) {
  return (
    <section
      aria-label="Kho hòm tiếp tế hôm nay ăn gì"
      className="relative w-full rounded-2xl border border-white/10 bg-canvas-100/70 p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md"
    >
      {/* Clean Header */}
      <div className="mb-3 flex items-center border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gold-500/20 text-xs text-gold-400">
            📦
          </span>
          <h2 className="text-xs sm:text-sm font-black tracking-widest text-ink-700 uppercase">
            {kind === "FOOD" ? "CHỌN HÒM MÓN ĂN" : "CHỌN HÒM ĐỒ UỐNG"}
          </h2>
        </div>
      </div>

      {/* 5 Crate Cards Grid / Horizontal Rail */}
      <div
        role="radiogroup"
        aria-label="Danh sách hòm tiếp tế"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-1 pt-1"
      >
        {cratesForKind(kind).map((crate) => (
          <CrateCard
            key={crate.id}
            crate={crate}
            isSelected={crate.id === selectedCrateId}
            itemCount={countsByCrate[crate.id] ?? 0}
            disabled={disabled}
            onSelect={onSelectCrate}
          />
        ))}
      </div>
    </section>
  );
}
