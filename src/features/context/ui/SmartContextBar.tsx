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
 * Modern Streamlined Status Bar (UX/UI Redesign):
 * - Top master line: live pulse beacon, calendar, lunar date, timezone, filter count, data sources.
 * - Middle balanced grid:
 *   + Left card: High-precision location (street, ward, district, city) + device accuracy.
 *   + Right card: Live weather snapshot + quick refresh & disconnect actions.
 * - Bottom toolbar: Integrated context suggestion switch ("Lọc gợi ý theo giờ và thời tiết đã xác định").
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
      className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-[#141b26]/95 via-[#0f141d]/95 to-[#0b0e14]/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.45)] p-3 sm:p-4 transition-all"
    >
      {/* Top subtle golden highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      {/* Row 1: Master Status Bar (Clock, Date, Lunar, Count, Source modal) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Live pulsing status beacon */}
          <span className="relative flex h-2.5 w-2.5" title="Dữ liệu thời gian thực">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
          </span>

          {/* Date */}
          <span data-testid="device-date" className="font-bold text-gold-400 capitalize text-xs tracking-wide">
            {calendar.dateLabel}
          </span>

          <span className="text-white/20 select-none">•</span>

          {/* Time & Period */}
          <div className="flex items-center gap-1.5">
            <span data-testid="device-time" className="font-mono font-bold tabular-nums text-white text-xs tracking-wider">
              {calendar.timeLabel}
            </span>
            <span data-testid="device-period" className="text-ink-400 text-[11px] font-medium px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
              {calendar.period}
            </span>
          </div>

          <span className="text-white/20 select-none">•</span>

          {/* Lunar Date */}
          <span data-testid="lunar-date" className="text-ink-300 text-xs flex items-center gap-1">
            <span className="text-ink-500">Âm lịch:</span>
            <strong className="text-amber-300 font-semibold">{calendar.lunarLabel}</strong>
          </span>

          {/* Timezone contract check for tests */}
          <span className="hidden text-[10px] text-ink-600">
            {calendar.timeZone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25 shadow-sm">
            {matchedCount} món trong bộ lọc
          </span>

          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            aria-label="Xem nguồn dữ liệu và độ chính xác"
            className="flex items-center gap-1.5 text-[11px] font-medium text-ink-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10"
          >
            <span aria-hidden="true" className="text-xs">ℹ️</span>
            <span className="hidden sm:inline">Nguồn dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Row 2: Location & Weather Environment Cards */}
      <div className="pt-3" aria-live="polite">
        {!enabled ? (
          /* State 1: Location not enabled - Clean, inviting banner */
          <div className="flex flex-wrap items-center justify-between gap-3 bg-canvas-200/50 rounded-xl px-3.5 py-2.5 border border-white/5">
            <div className="flex items-center gap-2.5 text-xs text-ink-400">
              <span className="text-base leading-none">📍</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span data-testid="device-location" className="font-semibold text-ink-300">
                  Chưa bật vị trí thiết bị
                </span>
                <span className="text-white/20">•</span>
                <span data-testid="device-weather" className="text-ink-500 text-[11px]">
                  Chưa có dữ liệu — cần vị trí thiết bị
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={enableLocation}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-ink-900 px-3.5 py-1.5 font-bold text-xs shadow-[0_0_12px_rgba(245,184,46,0.25)] transition-all cursor-pointer"
            >
              <span aria-hidden="true">📍</span>
              <span>Dùng vị trí thiết bị</span>
            </button>
          </div>
        ) : (
          /* State 2: Location enabled - Balanced 2-card grid */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            {/* Left Card: Location details (span 7) */}
            <div className="md:col-span-7 bg-canvas-200/60 border border-white/10 rounded-xl p-3 flex items-start gap-3 shadow-inner">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 text-sm shrink-0 shadow-sm mt-0.5">
                📍
              </div>
              <div className="min-w-0 flex-1">
                <div
                  data-testid="device-location"
                  className="font-semibold text-white text-xs leading-snug line-clamp-2"
                  title={place.status === "ready" ? place.data.label : undefined}
                >
                  {place.status === "ready"
                    ? place.data.label
                    : place.status === "loading"
                    ? "Đang xác định vị trí…"
                    : place.status === "error"
                    ? place.message
                    : "Chưa bật vị trí thiết bị"}
                </div>
                {place.status === "ready" && (
                  <div className="text-[10.5px] text-ink-500 font-medium mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>
                      Sai số thiết bị khoảng {Math.ceil(place.data.position.accuracy).toLocaleString("vi-VN")} m
                    </span>
                    <span className="text-white/20">•</span>
                    <span>{timestampLabel(place.data.position.timestamp)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Card: Weather status & Controls (span 5) */}
            <div className="md:col-span-5 bg-canvas-200/60 border border-white/10 rounded-xl p-3 flex flex-col justify-between gap-2.5 shadow-inner">
              {/* Weather Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 text-sm shrink-0 shadow-sm">
                  {weather.status === "ready" ? weather.data.icon : "🌤️"}
                </div>
                <div className="min-w-0 flex-1">
                  <div data-testid="device-weather" className="font-semibold text-ink-100 text-xs truncate">
                    {weather.status === "ready"
                      ? `${weather.data.label} · ${weather.data.temperature.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}°C`
                      : weather.status === "loading"
                      ? "Đang lấy dữ liệu thời tiết…"
                      : weather.status === "error"
                      ? weather.message
                      : "Chưa có dữ liệu — cần vị trí thiết bị"}
                  </div>
                  {weather.status === "ready" && (
                    <div className="text-[10px] text-ink-500 font-medium truncate">
                      Cập nhật lúc {timestampLabel(weather.data.validAt)}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                <button
                  type="button"
                  onClick={refresh}
                  disabled={loading}
                  aria-label="Cập nhật vị trí và thời tiết"
                  title="Cập nhật vị trí và thời tiết"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-7 px-2 rounded-lg border border-white/10 bg-canvas-300/80 hover:bg-canvas-400 text-ink-200 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <span aria-hidden="true" className={`text-xs ${loading ? "animate-spin" : ""}`}>🔄</span>
                  <span className="truncate">{loading ? "Đang cập nhật…" : "Cập nhật vị trí và thời tiết"}</span>
                </button>

                <button
                  type="button"
                  onClick={disableLocation}
                  aria-label="Tắt dùng vị trí"
                  title="Tắt dùng vị trí"
                  className="inline-flex items-center justify-center gap-1 h-7 px-2.5 rounded-lg border border-white/5 bg-transparent hover:bg-chili-500/10 text-ink-400 hover:text-chili-400 text-xs transition-all cursor-pointer shrink-0"
                >
                  <span aria-hidden="true">✕</span>
                  <span>Tắt dùng vị trí</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Integrated Context Suggestions Toggle Strip */}
      <div className="border-t border-white/8 mt-3 pt-2.5 flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-xs font-medium text-ink-300 hover:text-white cursor-pointer select-none transition-colors">
          <input
            type="checkbox"
            checked={useContextSuggestions}
            disabled={disabled}
            onChange={(event) => onContextSuggestionsChange?.(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-canvas-300 text-gold-500 focus:ring-gold-500/30 focus:ring-offset-0 cursor-pointer transition-all"
          />
          <span>Lọc gợi ý theo giờ và thời tiết đã xác định</span>
        </label>

        <span className="text-[11px] text-ink-500 font-mono hidden sm:inline-flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400/70 animate-pulse" />
          HNAG Context Engine
        </span>
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

