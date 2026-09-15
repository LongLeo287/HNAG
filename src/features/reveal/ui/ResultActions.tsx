import {
  GrabFoodLogo,
  ShopeeFoodLogo,
  BeFoodLogo,
  XanhSMLogo,
  GoogleMapsLogo,
} from "@/components/icons/DeliveryLogos";
import type { DrawOdds } from "@/features/randomizer/domain";
import { RarityOdds } from "@/components/ui/RarityOdds";
import { useState } from "react";
import { buildExternalAppLinks, detectAppPlatform, type ExternalAppId } from "@/lib/external-app-links";

interface ResultActionsProps {
  dishName?: string;
  respinOdds?: DrawOdds;
  onAccept: () => void;
  onRespin: () => void;
  onEditPool: () => void;
}

/** UI-017/FEAT-047: Accept, Re-spin, 4 Food Delivery Apps (GrabFood, ShopeeFood, beFood, Xanh SM), and Exit controls. */
export function ResultActions({
  dishName,
  respinOdds,
  onAccept,
  onRespin,
  onEditPool,
}: ResultActionsProps) {
  const [platform] = useState(() => detectAppPlatform(typeof navigator === "undefined" ? undefined : navigator));
  const [attemptedApp, setAttemptedApp] = useState<ExternalAppId | null>(null);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const links = buildExternalAppLinks(dishName ?? "", platform);
  const isMobile = platform !== "desktop";

  function appLinkProps(id: ExternalAppId) {
    return {
      href: links[id].href,
      target: links[id].target,
      rel: "noopener noreferrer",
      // Keep native navigation in this click gesture: no await, popup or timer.
      onClick: () => { if (isMobile) setAttemptedApp(id); },
    };
  }

  async function copyDishName() {
    if (!dishName) return;
    try {
      await navigator.clipboard.writeText(dishName);
      setCopiedName(dishName);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-2 w-full max-w-lg">
      {/* Primary Replay & Accept Controls */}
      <div className="flex flex-wrap justify-center gap-3 w-full">
        {/* Accept Button */}
        <button
          type="button"
          onClick={onAccept}
          className="group relative flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-neon-400 to-neon-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(98,179,39,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(98,179,39,0.6)] active:scale-[0.98]"
        >
          <span className="text-base">✅</span>
          <span>Chốt món này</span>
          <div className="pointer-events-none absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>

        {/* Respin Button */}
        <button
          type="button"
          onClick={onRespin}
          className="group relative flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-canvas-200 px-5 py-3.5 text-sm font-bold text-ink-900 shadow-md transition-all hover:bg-canvas-300 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-base">🔁</span>
          <span>Quay tiếp</span>
        </button>
      </div>

      {respinOdds && <RarityOdds odds={respinOdds} respin />}

      {/* 4 Food Delivery Apps (GrabFood, ShopeeFood, beFood, Xanh SM) + Google Maps */}
      {dishName && (
        <div className="w-full rounded-2xl border border-white/10 bg-canvas-200/60 p-3.5 backdrop-blur-md shadow-lg">
          {/* Section Heading */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500 mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-white/90">
              <span>🛵</span>
              <span>Đặt món qua ứng dụng ({dishName})</span>
            </span>
            <span className="text-[10px] font-normal text-ink-500">{isMobile ? "Mở ứng dụng" : "Mở tab mới"}</span>
          </div>

          {/* 4 Delivery Apps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. GrabFood */}
            <a
              {...appLinkProps("grab")}
              className="group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/25 hover:bg-emerald-900/40 p-2.5 text-center transition-all hover:scale-[1.03] hover:border-emerald-400/60 hover:shadow-[0_0_16px_rgba(0,177,79,0.35)]"
              title={`Tìm và đặt ${dishName} trên GrabFood`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00B14F] text-white shadow-sm transition-transform group-hover:scale-105">
                <GrabFoodLogo className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  GrabFood
                </span>
                <span className="text-[10px] text-emerald-400/80 font-medium">{isMobile ? "Tìm món trong app" : "Tìm quán"}</span>
              </div>
            </a>

            {/* 2. ShopeeFood */}
            <a
              {...appLinkProps("shopee")}
              className="group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-950/25 hover:bg-orange-900/40 p-2.5 text-center transition-all hover:scale-[1.03] hover:border-orange-400/60 hover:shadow-[0_0_16px_rgba(238,77,45,0.35)]"
              title={isMobile ? "Mở ứng dụng ShopeeFood" : "Mở ShopeeFood"}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EE4D2D] text-white shadow-sm transition-transform group-hover:scale-105">
                <ShopeeFoodLogo className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                  ShopeeFood
                </span>
                <span className="text-[10px] text-orange-400/80 font-medium">{isMobile ? "Mở ứng dụng" : "Tìm quán"}</span>
              </div>
            </a>

            {/* 3. beFood */}
            <a
              {...appLinkProps("be")}
              className="group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-950/25 hover:bg-amber-900/40 p-2.5 text-center transition-all hover:scale-[1.03] hover:border-amber-300/60 hover:shadow-[0_0_16px_rgba(255,206,0,0.35)]"
              title={`Mở ứng dụng Be để đặt món ${dishName} qua beFood`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFCE00] shadow-sm transition-transform group-hover:scale-105 overflow-hidden p-1">
                <BeFoodLogo className="h-full w-full" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  beFood
                </span>
                <span className="text-[10px] text-amber-300/80 font-medium">Mở Be → beFood</span>
              </div>
            </a>

            {/* 4. Xanh SM */}
            <a
              {...appLinkProps("xanh")}
              className="group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-950/25 hover:bg-cyan-900/40 p-2.5 text-center transition-all hover:scale-[1.03] hover:border-cyan-300/60 hover:shadow-[0_0_16px_rgba(40,189,191,0.35)]"
              title={`Mở ứng dụng Xanh SM để đặt món ${dishName} qua Xanh SM Ngon`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14303B] border border-[#28BDBF]/40 shadow-sm transition-transform group-hover:scale-105 px-1">
                <XanhSMLogo className="h-4 w-auto" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Xanh SM
                </span>
                <span className="text-[10px] text-cyan-400/80 font-medium">Mở app → Food</span>
              </div>
            </a>
          </div>

          <div className="mt-3 text-center text-xs text-ink-500">
            <button type="button" onClick={() => void copyDishName()} className="min-h-11 rounded-lg border border-white/15 px-3 py-2 font-semibold text-ink-900 hover:bg-canvas-300">
              {copiedName === dishName ? "Đã sao chép tên món ✓" : "Sao chép tên món"}
            </button>
            <p className="mt-1.5">Dán tên món vào ô tìm kiếm trong ứng dụng.</p>
            {copyFailed && (
              <label className="mt-2 block" role="status">
                Chạm và giữ để sao chép thủ công:
                <input aria-label="Tên món để sao chép" readOnly value={dishName} onFocus={(event) => event.currentTarget.select()} className="mt-1 w-full rounded-lg border border-white/20 bg-canvas-100 p-2 text-ink-900" />
              </label>
            )}
          </div>

          {isMobile && attemptedApp && (
            <div role="status" className="mt-3 rounded-lg border border-white/10 bg-canvas-100 p-3 text-xs leading-relaxed text-ink-700">
              <p>Nếu {links[attemptedApp].name} chưa mở, hãy dùng Safari/Chrome và kiểm tra ứng dụng đã được cài.</p>
              <a href={links[attemptedApp].installUrl} target="_self" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center font-semibold text-gold-400">
                Cài hoặc cập nhật {links[attemptedApp].name} ↗
              </a>
            </div>
          )}

          {/* Google Maps Quick Search Bar */}
          <a
            {...appLinkProps("maps")}
            className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-blue-500/25 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-2 text-xs font-semibold text-blue-300 transition-all hover:border-blue-500/40 hover:text-white"
            title={`Tìm quán ${dishName} gần đây trên Google Maps`}
          >
            <GoogleMapsLogo className="h-4 w-4 text-blue-400" />
            <span>Tìm quán gần bạn trên Google Maps</span>
            <span className="text-blue-400/70 text-[11px]">↗</span>
          </a>
        </div>
      )}

      {/* Auxiliary Controls: Edit Pool */}
      <div className="flex items-center justify-center text-xs font-semibold text-ink-500">
        <button
          type="button"
          onClick={onEditPool}
          className="flex items-center gap-1.5 hover:text-gold-400 transition-colors py-1"
        >
          <span>⚙️</span>
          <span>Chỉnh danh sách món trong hòm</span>
        </button>
      </div>
    </div>
  );
}
