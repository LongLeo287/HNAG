import { cratesForKind, type CrateId } from "@/data/crates";
import type { ItemKind } from "@/data/catalog";
import { CrateCard } from "./CrateCard";

interface CrateSelectorRackProps {
  kind: ItemKind;
  selectedCrateId: CrateId;
  countsByCrate: Record<CrateId, number>;
  disabled?: boolean;
  onSelectCrate: (crateId: CrateId) => void;
  onHoverCrate?: () => void;
}

/**
 * CS:GO Case Selector Rack:
 * Displays the 5 tactical supply cases (Bữa Chính, Giải Khát, Ăn Vặt, Ăn Nhậu, Đồ Chay).
 * Supports mouse clicks, 3D card tilt, mouse wheel scrolling, and keyboard shortcuts [1-5].
 */
export function CrateSelectorRack({
  kind,
  selectedCrateId,
  countsByCrate,
  disabled = false,
  onSelectCrate,
  onHoverCrate,
}: CrateSelectorRackProps) {
  const crates = cratesForKind(kind);

  const handleWheel = (e: React.WheelEvent) => {
    if (disabled || crates.length <= 1) return;
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 25) return;
    const currentIndex = crates.findIndex((c) => c.id === selectedCrateId);
    if (currentIndex === -1) return;
    const direction = delta > 0 ? 1 : -1;
    const nextIndex = (currentIndex + direction + crates.length) % crates.length;
    const targetCrate = crates[nextIndex];
    if (targetCrate) {
      onSelectCrate(targetCrate.id);
    }
  };

  return (
    <section
      aria-label="Kho hòm tiếp tế hôm nay ăn gì"
      onWheel={handleWheel}
      className="relative w-full rounded-2xl border border-white/10 bg-canvas-100/70 p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md"
    >
      {/* Clean Header */}
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gold-500/20 text-xs text-gold-400">
            📦
          </span>
          <h2 className="text-xs sm:text-sm font-black tracking-widest text-ink-700 uppercase">
            {kind === "FOOD" ? "CHỌN HÒM MÓN ĂN" : "CHỌN HÒM ĐỒ UỐNG"}
          </h2>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-ink-500 font-mono">
          <span>Phím tắt</span>
          <kbd className="rounded border border-white/20 bg-canvas-200 px-1 py-0.5 text-[10px] text-gold-400 font-bold">1-4</kbd>
          <span>hoặc cuộn chuột</span>
        </span>
      </div>

      {/* 5 Crate Cards Grid / Horizontal Rail */}
      <div
        role="radiogroup"
        aria-label="Danh sách hòm tiếp tế"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-1 pt-1"
      >
        {crates.map((crate, idx) => (
          <CrateCard
            key={crate.id}
            crate={crate}
            isSelected={crate.id === selectedCrateId}
            itemCount={countsByCrate[crate.id] ?? 0}
            disabled={disabled}
            shortcutIndex={idx + 1}
            onSelect={onSelectCrate}
            onHover={onHoverCrate}
          />
        ))}
      </div>
    </section>
  );
}
