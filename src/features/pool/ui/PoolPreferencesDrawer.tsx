import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import type { CandidateItem, ItemKind } from "@/data/catalog";
import { BuiltInItemToggleList } from "./BuiltInItemToggleList";
import { CustomItemForm } from "./CustomItemForm";
import type { CustomItemInput } from "../types";
import type { AddCustomItemResult } from "../pool";

interface PoolPreferencesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: ItemKind;
  combinedPool: CandidateItem[];
  onToggleBuiltIn: (itemId: string, enabled: boolean) => void;
  onAddCustom: (input: CustomItemInput) => AddCustomItemResult;
  onRemoveCustom: (itemId: string) => void;
  onReset: () => void;
}

/** UI-050: manage the personal pool without leaving the game — cleanly separated into Add Custom Dish and Built-in Disables tabs. */
export function PoolPreferencesDrawer({
  open,
  onOpenChange,
  kind,
  combinedPool,
  onToggleBuiltIn,
  onAddCustom,
  onRemoveCustom,
  onReset,
}: PoolPreferencesDrawerProps) {
  const [activeTab, setActiveTab] = useState<"add" | "builtin">("add");
  const builtIns = combinedPool.filter((item) => item.origin === "BUNDLED" && item.kind === kind);
  const custom = combinedPool.filter((item) => item.origin === "CUSTOM" && item.kind === kind);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Danh sách món của bạn">
      <div className="flex flex-col gap-4">
        {/* Navigation Tabs separating Add Custom vs Built-in Toggles */}
        <div className="flex border-b border-white/10" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "add"}
            onClick={() => setActiveTab("add")}
            className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "add"
                ? "border-gold-400 text-gold-400"
                : "border-transparent text-ink-500 hover:text-white"
            }`}
          >
            <span>➕</span>
            <span>Thêm món riêng</span>
            {custom.length > 0 && (
              <span className="rounded-full bg-gold-500/20 text-gold-400 text-[10px] px-2 py-0.5 font-bold">
                {custom.length}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "builtin"}
            onClick={() => setActiveTab("builtin")}
            className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "builtin"
                ? "border-gold-400 text-gold-400"
                : "border-transparent text-ink-500 hover:text-white"
            }`}
          >
            <span>⚙️</span>
            <span>Ẩn/Hiện món có sẵn</span>
          </button>
        </div>

        {/* TAB 1: ADD CUSTOM DISHES */}
        {activeTab === "add" && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-ink-500">
              Thêm món ăn hoặc quán quen yêu thích của bạn vào danh sách quay thưởng.
            </p>

            <CustomItemForm key={kind} kind={kind} onAdd={onAddCustom} />

            {/* List of user added dishes */}
            <div className="border-t border-white/10 pt-4 mt-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>📋</span>
                  <span>Món bạn đã thêm</span>
                  <span className="text-xs text-ink-500 font-normal">({custom.length})</span>
                </h3>
              </div>

              {custom.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-ink-500">
                  Chưa có món riêng nào. Hãy điền form bên trên để thêm món bạn thích!
                </div>
              ) : (
                <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  {custom.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-canvas-100/60 p-2.5 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{item.name}</span>
                        <div className="flex items-center gap-2 text-[11px] text-ink-500">
                          {item.priceVnd ? (
                            <span>{item.priceVnd.toLocaleString("vi-VN")}đ</span>
                          ) : null}
                          {item.vegetarianPossible && (
                            <span className="text-emerald-400 font-medium">• Chay</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveCustom(item.id)}
                        className="min-h-9 px-3 rounded-lg border border-chili-500/20 bg-chili-500/10 text-xs font-semibold text-chili-400 hover:bg-chili-500/20 transition-colors"
                      >
                        Xoá
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BUILT-IN DISHES TOGGLE LIST */}
        {activeTab === "builtin" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-gold-500/20 bg-gold-500/10 p-3 text-xs text-gold-400">
              💡 <strong>Mẹo:</strong> Tắt bớt những món bạn không thích ăn hoặc bị dị ứng để vòng quay không bao giờ chọn trúng món đó.
            </div>

            <section>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">
                  Danh sách món hệ thống ({builtIns.length} món)
                </h3>
              </div>
              <BuiltInItemToggleList items={builtIns} onToggle={onToggleBuiltIn} />
            </section>

            <div className="border-t border-white/10 pt-3 flex justify-end">
              <Button
                variant="ghost"
                onClick={onReset}
                className="text-xs text-chili-400 hover:text-chili-300"
              >
                Đặt lại về mặc định
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
