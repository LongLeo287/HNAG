import { useState } from "react";
import type { useSmartContext } from "../useSmartContext";
import { deviceCalendar } from "../deviceClock";
import { Dialog } from "@/components/ui/Dialog";

interface SmartContextBarProps {
  context: ReturnType<typeof useSmartContext>;
  matchedCount: number;
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
 * Modern Streamlined Status Bar (User Redesign 2026-09-15):
 * Thay thế khung to cồng kềnh bằng thanh status bar tinh tế, hiện đại.
 * Mặc định hiển thị đồng hồ, ngày tháng, âm lịch và đếm món.
 * Người dùng cấp quyền vị trí sẽ mở ra thông tin vị trí chính xác (đường, phường, quận, TP) & thời tiết trực tiếp.
 */
export function SmartContextBar({ context, matchedCount }: SmartContextBarProps) {
  const { now, enabled, place, weather, enableLocation, disableLocation, refresh } = context;
  const calendar = deviceCalendar(now);
  const loading = place.status === "loading" || weather.status === "loading";
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <section
      aria-label="Thông tin theo thiết bị"
      className="w-full max-w-4xl rounded-2xl border border-white/12 bg-[#121822]/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] p-3 sm:p-3.5 transition-all"
    >
      {/* Row 1: Status Bar Master Line (Live Clock, Date, Lunar, Filter Count) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-white/8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Live pulsing status beacon */}
          <span className="flex h-2 w-2 relative" title="Trực tiếp theo thiết bị">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </span>

          {/* Date */}
          <span data-testid="device-date" className="font-semibold text-gold-400 capitalize">
            {calendar.dateLabel}
          </span>

          <span className="text-white/20">•</span>

          {/* Time & Period */}
          <div className="flex items-center gap-1.5">
            <span data-testid="device-time" className="font-bold tabular-nums text-white text-xs">
              {calendar.timeLabel}
            </span>
            <span data-testid="device-period" className="text-ink-500 text-[11px] font-medium">
              {calendar.period}
            </span>
          </div>

          <span className="text-white/20">•</span>

          {/* Lunar Date */}
          <span data-testid="lunar-date" className="text-ink-400 text-xs flex items-center gap-1">
            <span>Âm lịch:</span>
            <strong className="text-amber-300 font-semibold">{calendar.lunarLabel}</strong>
          </span>

          {/* Timezone contract check for tests */}
          <span className="hidden text-[10px] text-ink-600">
            {calendar.timeZone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
            {matchedCount} món trong bộ lọc
          </span>

          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            aria-label="Xem nguồn dữ liệu và độ chính xác"
            className="flex items-center gap-1 text-[11px] text-ink-500 hover:text-white transition-colors px-2 py-0.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <span aria-hidden="true">ℹ️</span>
            <span className="hidden sm:inline">Nguồn dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Row 2: Location & Weather Environment Status Line */}
      <div className="pt-2.5" aria-live="polite">
        {!enabled ? (
          /* State 1: Location not enabled - Clean invitation to enable */
          <div className="flex flex-wrap items-center justify-between gap-3 bg-canvas-200/50 rounded-xl px-3 py-2 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <span className="text-base leading-none">📍</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span data-testid="device-location" className="text-ink-400 font-medium">
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
          /* State 2: Location enabled - High-accuracy street/ward/district + live weather */
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2.5 min-w-0 flex-1">
              {/* Location Badge */}
              <div className="flex items-center gap-2 min-w-0 bg-canvas-200/70 border border-white/10 rounded-xl px-3 py-1.5 shadow-inner">
                <span className="text-teal-400 text-sm shrink-0">📍</span>
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span
                    data-testid="device-location"
                    className="font-bold text-white text-xs truncate max-w-xs sm:max-w-md"
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
                    <span className="text-[10px] text-ink-500 font-medium shrink-0">
                      Sai số thiết bị khoảng {Math.ceil(place.data.position.accuracy).toLocaleString("vi-VN")} m • {timestampLabel(place.data.position.timestamp)}
                    </span>
                  )}
                </div>
              </div>

              {/* Weather Badge */}
              <div className="flex items-center gap-1.5 bg-canvas-200/70 border border-white/10 rounded-xl px-3 py-1.5 shrink-0 shadow-inner">
                <span data-testid="device-weather" className="font-semibold text-ink-200 text-xs">
                  {weather.status === "ready"
                    ? `${weather.data.icon} ${weather.data.label} · ${weather.data.temperature.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}°C`
                    : weather.status === "loading"
                    ? "Đang lấy dữ liệu thời tiết…"
                    : weather.status === "error"
                    ? weather.message
                    : "Chưa có dữ liệu — cần vị trí thiết bị"}
                </span>

                {weather.status === "ready" && (
                  <span className="hidden lg:inline text-[10px] text-ink-500 font-medium">
                    (cập nhật {timestampLabel(weather.data.validAt)})
                  </span>
                )}
              </div>
            </div>

            {/* Quick Refresh & Power Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                title="Cập nhật vị trí và thời tiết"
                className="flex h-8 items-center gap-1 rounded-lg border border-white/10 bg-canvas-200/80 px-2.5 text-[11px] font-semibold text-ink-300 hover:bg-canvas-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                <span aria-hidden="true" className={`text-xs ${loading ? "animate-spin" : ""}`}>🔄</span>
                <span>
                  {loading ? "Đang cập nhật…" : "Cập nhật vị trí và thời tiết"}
                </span>
              </button>

              <button
                type="button"
                onClick={disableLocation}
                title="Tắt dùng vị trí"
                className="flex h-8 items-center rounded-lg border border-white/5 bg-transparent px-2.5 text-[11px] text-ink-500 hover:text-chili-400 hover:bg-chili-500/10 transition-all cursor-pointer"
              >
                Tắt dùng vị trí
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
