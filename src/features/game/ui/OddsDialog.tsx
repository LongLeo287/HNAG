import { Dialog } from "@/components/ui/Dialog";
import { RarityOdds } from "@/components/ui/RarityOdds";
import type { DrawOdds } from "@/features/randomizer/domain";

interface OddsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  odds: DrawOdds;
}

/**
 * Dedicated Rarity Odds Modal:
 * Tách riêng biệt khỏi Menu Cài đặt theo yêu cầu UX/UI ("menu cài đặt và tỉ lệ không nên để chung với nhau").
 */
export function OddsDialog({ open, onOpenChange, odds }: OddsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Tỉ lệ mở hòm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5 rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 text-xs text-teal-300">
          <span className="text-base shrink-0">📊</span>
          <span>
            Xác suất rơi món ăn & đồ uống theo bộ lọc hiện tại của bạn. Tỉ lệ tự động tính toán động khi thay đổi tiêu chí.
          </span>
        </div>

        {/* The Rarity Odds view */}
        <RarityOdds odds={odds} />

        <div className="rounded-xl border border-white/10 bg-canvas-100/60 p-3 text-[11px] text-ink-500 flex flex-col gap-1.5">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Cam kết minh bạch & ngẫu nhiên 100%:</span>
          </div>
          <p>
            Tất cả kết quả mở hòm được thực thi trực tiếp trên trình duyệt, không có thuật toán ngầm can thiệp hay thiên vị bất kỳ món nào.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 rounded-xl bg-gold-500 text-ink-900 font-bold text-xs hover:bg-gold-400 transition-colors cursor-pointer shadow-md"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </Dialog>
  );
}
