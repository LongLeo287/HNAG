import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  desc: string;
}

interface ShortcutGroup {
  title: string;
  icon: string;
  items: ShortcutItem[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Mở Hòm & Thao Tác Chính",
    icon: "🔓",
    items: [
      { keys: ["Space", "Enter"], desc: "Bắt đầu mở hòm / Quay / Chốt kết quả" },
      { keys: ["R"], desc: "Quay lại (Re-spin) khi đang xem kết quả" },
      { keys: ["Esc"], desc: "Đóng cửa sổ / Bảng cài đặt / Thoát modal" },
    ],
  },
  {
    title: "Chọn Hòm & Danh Mục",
    icon: "📦",
    items: [
      { keys: ["1", "2", "3", "4", "5"], desc: "Chọn nhanh Hòm 1 - 5" },
      { keys: ["←", "→"], desc: "Chuyển đổi qua lại giữa các hòm tiếp tế" },
      { keys: ["F"], desc: "Chuyển sang tab Món Ăn" },
      { keys: ["D"], desc: "Chuyển sang tab Đồ Uống" },
      { keys: ["C"], desc: "Đổi kiểu mở kết quả (Reel, 3D, Vòng quay...)" },
    ],
  },
  {
    title: "Cài Đặt & Tiện Ích",
    icon: "⚙️",
    items: [
      { keys: ["S"], desc: "Bật / Tắt bảng Cài đặt & Tùy chọn" },
      { keys: ["M"], desc: "Bật / Tắt âm thanh (Mute / Unmute)" },
      { keys: ["O"], desc: "Xem bảng Tỉ lệ rớt món (Odds)" },
      { keys: ["P"], desc: "Mở kho món & Tùy biến danh sách" },
      { keys: ["?"], desc: "Bật / Tắt bảng hướng dẫn phím tắt này" },
    ],
  },
  {
    title: "Thao Tác Chuột & Cảm Ứng",
    icon: "🖱️",
    items: [
      { keys: ["Rê chuột"], desc: "Nghiêng 3D thẻ bài (Parallax) & âm thanh xúc giác" },
      { keys: ["Cuộn chuột"], desc: "Lướt chuyển đổi nhanh các hòm tiếp tế" },
      { keys: ["Kéo chuột"], desc: "Xoay tự do 360° hòm 3D Three.js trong chế độ Blindbox" },
    ],
  },
];

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bảng tra cứu phím tắt bàn phím và chuột"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-hidden"
    >
      {/* Dimmed glass backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-gold-500/40 bg-[#0c1017]/98 p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] backdrop-blur-2xl transition-all z-10 my-auto">
        {/* Radiant top aura */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-80 rounded-full bg-gold-500/20 blur-3xl"
        />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/20 text-xl text-gold-400 shadow-inner">
              ⌨️
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white uppercase">
                PHÍM TẮT & THAO TÁC CHUỘT
              </h2>
              <p className="text-xs text-ink-500">
                Điều khiển #HNAG mượt mà chuẩn Gaming Desktop & Laptop
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-canvas-200/80 hover:bg-canvas-300 text-ink-500 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Shortcuts Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SHORTCUT_GROUPS.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-white/10 bg-canvas-100/60 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <span className="text-base">{group.icon}</span>
                <h3 className="text-xs font-black tracking-wider text-gold-400 uppercase">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-2.5">
                {group.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-ink-400">{item.desc}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k) => (
                        <kbd
                          key={k}
                          className="min-w-[24px] px-2 py-0.5 rounded-md border border-white/20 bg-canvas-300/80 font-mono text-[11px] font-bold text-gold-300 text-center shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer tip */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-ink-500">
          <span>Mẹo: Bạn có thể nhấn <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-canvas-200 text-white font-mono">?</kbd> bất kỳ lúc nào để bật bảng này</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 font-bold transition-colors"
          >
            Đã hiểu (Esc)
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
