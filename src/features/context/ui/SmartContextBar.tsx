import { useState } from "react";
import type { useSmartContext } from "../useSmartContext";
import { deviceCalendar } from "../deviceClock";
import { Dialog } from "@/components/ui/Dialog";

interface SmartContextBarProps {
  context: ReturnType<typeof useSmartContext>;
  matchedCount: number;
  useContextSuggestions?: boolean;
  onContextSuggestionsChange?: (value: boolean) => void;
  disabled?: boolean;
}

const timestampLabel = (value: number) =>
  new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    hourCycle: "h23",
  });

/**
 * Ultra-Compact Streamlined Status Bar (User Feedback 2026-09-15):
 * Thiết kế tinh gọn chuẩn status bar, không chiếm nhiều diện tích màn hình.
 * - Dòng 1: Đèn beacon thời gian thực, Lịch thứ ngày, Giờ phút & Buổi, Âm lịch, Nút Lọc gợi ý, Số lượng món, Nguồn dữ liệu.
 * - Dòng 2: Ticker vị trí (Đường, Phường, Quận, TP) & Sai số, Thời tiết trực tiếp, Nút Cập nhật & Tắt vị trí.
 */
export function SmartContextBar({
  context,
  matchedCount,
  useContextSuggestions = true,
  onContextSuggestionsChange,
  disabled = false,
}: SmartContextBarProps) {
  const { now, enabled, place, weather, enableLocation, disableLocation, refresh } = context;
  const calendar = deviceCalendar(now);
  const loading = place.status === "loading" || weather.status === "loading";
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <section
      aria-label="Thông tin theo thiết bị"
      className="w-full max-w-4xl rounded-xl border border-white/10 bg-[#0d121a]/90 backdrop-blur-md px-3.5 py-2 transition-all shadow-sm"
    >
      {/* Line 1: Primary System Status (Clock, Date, Lunar, Filter Count, Suggestion Switch) */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pb-1.5 border-b border-white/6 text-xs">
        {/* Left: Time & Calendar facts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="relative flex h-2 w-2" title="Thời gian thực">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </span>

          <span data-testid="device-date" className="font-bold text-gold-400 capitalize text-xs tracking-wide">
            {calendar.dateLabel}
          </span>

          <span className="text-white/20 select-none">•</span>

          <span data-testid="device-time" className="font-mono font-bold tabular-nums text-white text-xs">
            {calendar.timeLabel}
          </span>
          <span data-testid="device-period" className="text-ink-400 text-[11px] px-1 py-0.2 rounded bg-white/5">
            {calendar.period}
          </span>

          <span className="text-white/20 select-none">•</span>

          <span data-testid="lunar-date" className="text-ink-300 text-xs flex items-center gap-1">
            <span className="text-ink-500">Âm lịch:</span>
            <strong className="text-amber-300 font-medium">{calendar.lunarLabel}</strong>
          </span>

          {/* Timezone contract check for tests */}
          <span className="hidden text-[10px] text-ink-600">{calendar.timeZone}</span>
        </div>

        {/* Right: Suggestion switch & Filter count badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-300 hover:text-white cursor-pointer select-none transition-colors">
            <input
              type="checkbox"
              checked={useContextSuggestions}
              disabled={disabled}
              onChange={(event) => onContextSuggestionsChange?.(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-white/20 bg-canvas-300 text-gold-500 focus:ring-0 cursor-pointer"
            />
            <span>Lọc gợi ý theo giờ và thời tiết đã xác định</span>
          </label>

          <span className="text-white/15 select-none hidden sm:inline">•</span>

          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {matchedCount} món
          </span>

          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            aria-label="Xem nguồn dữ liệu và độ chính xác"
            title="Xem nguồn dữ liệu và độ chính xác"
            className="flex items-center gap-1 text-[11px] text-ink-500 hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-white/5"
          >
            <span aria-hidden="true">ℹ️</span>
            <span className="sr-only sm:not-sr-only text-[10.5px]">Nguồn dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Line 2: Environment facts (Location & Weather) - Super compact horizontal ticker */}
      <div className="pt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5" aria-live="polite">
        {!enabled ? (
          /* State 1: Location not enabled */
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2 text-xs text-ink-400">
              <span className="text-teal-400 text-xs">📍</span>
              <span data-testid="device-location" className="font-medium text-ink-300">
                Chưa bật vị trí thiết bị
              </span>
              <span className="text-white/20 select-none">•</span>
              <span data-testid="device-weather" className="text-ink-500 text-[11px]">
                Chưa có dữ liệu — cần vị trí thiết bị
              </span>
            </div>

            <button
              type="button"
              onClick={enableLocation}
              className="inline-flex items-center gap-1 rounded-lg bg-gold-500 hover:bg-gold-400 text-ink-900 px-2.5 py-1 font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <span aria-hidden="true">📍</span>
              <span>Dùng vị trí thiết bị</span>
            </button>
          </div>
        ) : (
          /* State 2: Location enabled - 1-line sleek status ticker */
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 w-full">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0 flex-1 text-xs">
              {/* Location Badge */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-teal-400 text-xs shrink-0">📍</span>
                <span
                  data-testid="device-location"
                  className="font-medium text-white text-xs truncate max-w-xs sm:max-w-md"
                  title={place.status === "ready" ? place.data.label : undefined}
                >
                  {place.status === "ready"
                    ? place.data.label
                    : place.status === "loading"
                    ? "Đang xác định vị trí…"
                    : place.status === "error"
                    ? place.message
                    : "Chưa bật vị trí thiết bị"}
                </span>

                {place.status === "ready" && (
                  <span className="text-[10.5px] text-ink-500 shrink-0">
                    (Sai số thiết bị khoảng {Math.ceil(place.data.position.accuracy).toLocaleString("vi-VN")} m • {timestampLabel(place.data.position.timestamp)})
                  </span>
                )}
              </div>

              <span className="text-white/20 select-none hidden sm:inline">•</span>

              {/* Weather Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span data-testid="device-weather" className="font-semibold text-amber-300 text-xs">
                  {weather.status === "ready"
                    ? `${weather.data.icon} ${weather.data.label} · ${weather.data.temperature.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}°C`
                    : weather.status === "loading"
                    ? "Đang lấy dữ liệu thời tiết…"
                    : weather.status === "error"
                    ? weather.message
                    : "Chưa có dữ liệu — cần vị trí thiết bị"}
                </span>
                {weather.status === "ready" && (
                  <span className="hidden xl:inline text-[10px] text-ink-500">
                    ({timestampLabel(weather.data.validAt)})
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                aria-label="Cập nhật vị trí và thời tiết"
                title="Cập nhật vị trí và thời tiết"
                className="inline-flex items-center gap-1 h-6 px-2 rounded-md border border-white/10 bg-canvas-200/80 hover:bg-canvas-300 text-ink-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer disabled:opacity-50"
              >
                <span aria-hidden="true" className={loading ? "animate-spin" : ""}>🔄</span>
                <span>{loading ? "Đang cập nhật…" : "Cập nhật vị trí và thời tiết"}</span>
              </button>

              <button
                type="button"
                onClick={disableLocation}
                aria-label="Tắt dùng vị trí"
                title="Tắt dùng vị trí"
                className="inline-flex items-center h-6 px-2 rounded-md border border-white/5 bg-transparent hover:bg-chili-500/10 text-ink-500 hover:text-chili-400 text-[11px] transition-all cursor-pointer"
              >
                <span>Tắt dùng vị trí</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Popover / Modal: Nguồn dữ liệu và độ chính xác */}
      <Dialog
        open={infoOpen}
        onOpenChange={setInfoOpen}
        title="Nguồn dữ liệu & Độ chính xác"
      >
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-ink-300">
          <p className="text-ink-400">
            #HNAG sử dụng các nguồn dữ liệu mở, chuẩn hoá theo thời gian thực để phục vụ gợi ý món ăn phù hợp nhất:
          </p>

          <ul className="list-disc space-y-2 pl-4 text-ink-300">
            <li>
              <strong>Thời gian & Lịch:</strong> Ngày, giờ, thứ và múi giờ lấy trực tiếp từ thiết bị của bạn. Buổi trong ngày phân theo giờ thiết bị.
            </li>
            <li>
              <strong>Âm lịch Việt Nam:</strong> Quy đổi ngày dương đang hiển thị theo quy tắc múi giờ UTC+7, hỗ trợ từ năm 2000–2035 có tính tháng nhuận.
            </li>
            <li>
              <strong>Định vị chính xác:</strong> Tọa độ GPS/Wi-Fi do trình duyệt cung cấp khi được bạn cho phép. Giải mã địa chỉ chi tiết (tên đường, phường, quận, thành phố) qua OpenStreetMap và BigDataCloud. HNAG cam kết không lưu toạ độ của bạn lên bất kỳ máy chủ nào.
            </li>
            <li>
              <strong>Thời tiết khu vực:</strong> Dữ liệu từ <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline text-gold-400 hover:text-gold-300">Open-Meteo</a> (mô hình khí tượng theo toạ độ). Tự động làm mới sau 10 phút.
            </li>
            <li>
              <strong>Tìm quán trên bản đồ & app:</strong> Vị trí chính xác giúp mở thẳng Google Maps, GrabFood, ShopeeFood quanh khu vực bạn đang đứng.
            </li>
          </ul>

          <div className="border-t border-white/10 pt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setInfoOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-gold-500 text-ink-900 font-bold text-xs hover:bg-gold-400 transition-colors cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}

