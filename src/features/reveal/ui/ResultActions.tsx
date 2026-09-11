import {
  GrabFoodLogo,
  ShopeeFoodLogo,
  BeFoodLogo,
  XanhSMLogo,
  GoogleMapsLogo,
} from "@/components/icons/DeliveryLogos";

interface ResultActionsProps {
  dishName?: string;
  onAccept: () => void;
  onRespin: () => void;
  onEditPool: () => void;
}

/** UI-017/FEAT-047: Accept, Re-spin, 4 Food Delivery Apps (GrabFood, ShopeeFood, beFood, Xanh SM), and Exit controls. */
export function ResultActions({
  dishName,
  onAccept,
  onRespin,
  onEditPool,
}: ResultActionsProps) {
  const encodedName = dishName ? encodeURIComponent(dishName) : "";
  const googleMapsUrl = dishName
    ? `https://www.google.com/maps/search/${encodeURIComponent(dishName + " gần đây")}`
    : "";
  const grabFoodUrl = dishName
    ? `https://food.grab.com/vn/vi/restaurants?search=${encodedName}`
    : "";
  const shopeeFoodUrl = dishName
    ? `https://shopeefood.vn/search?keyword=${encodedName}`
    : "";
  const beFoodUrl = "https://be.com.vn";
  const xanhSmUrl = "https://www.greensm.com/vn-vi";

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

      {/* 4 Food Delivery Apps (GrabFood, ShopeeFood, beFood, Xanh SM) + Google Maps */}
      {dishName && (
        <div className="w-full rounded-2xl border border-white/10 bg-canvas-200/60 p-3.5 backdrop-blur-md shadow-lg">
          {/* Section Heading */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500 mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-white/90">
              <span>🛵</span>
              <span>Đặt món qua ứng dụng ({dishName})</span>
            </span>
            <span className="text-[10px] font-normal text-ink-500">Mở tab mới</span>
          </div>

          {/* 4 Delivery Apps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. GrabFood */}
            <a
              href={grabFoodUrl}
              target="_blank"
              rel="noopener noreferrer"
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
                <span className="text-[10px] text-emerald-400/80 font-medium">Tìm quán</span>
              </div>
            </a>

            {/* 2. ShopeeFood */}
            <a
              href={shopeeFoodUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-950/25 hover:bg-orange-900/40 p-2.5 text-center transition-all hover:scale-[1.03] hover:border-orange-400/60 hover:shadow-[0_0_16px_rgba(238,77,45,0.35)]"
              title={`Tìm và đặt ${dishName} trên ShopeeFood`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EE4D2D] text-white shadow-sm transition-transform group-hover:scale-105">
                <ShopeeFoodLogo className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                  ShopeeFood
                </span>
                <span className="text-[10px] text-orange-400/80 font-medium">Tìm quán</span>
              </div>
            </a>

            {/* 3. beFood */}
            <a
              href={beFoodUrl}
              target="_blank"
              rel="noopener noreferrer"
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
                <span className="text-[10px] text-amber-300/80 font-medium">Ứng dụng Be</span>
              </div>
            </a>

            {/* 4. Xanh SM */}
            <a
              href={xanhSmUrl}
              target="_blank"
              rel="noopener noreferrer"
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
                <span className="text-[10px] text-cyan-400/80 font-medium">Xanh SM Ngon</span>
              </div>
            </a>
          </div>

          {/* Google Maps Quick Search Bar */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
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
