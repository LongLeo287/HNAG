import type { useSmartContext } from "../useSmartContext";
import { deviceCalendar } from "../deviceClock";

interface SmartContextBarProps {
  context: ReturnType<typeof useSmartContext>;
  matchedCount: number;
}
const timestampLabel = (value: number) => new Date(value).toLocaleString("vi-VN", {
  hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", hourCycle: "h23",
});

export function SmartContextBar({ context, matchedCount }: SmartContextBarProps) {
  const { now, enabled, place, weather, enableLocation, disableLocation, refresh } = context;
  const calendar = deviceCalendar(now);
  const loading = place.status === "loading" || weather.status === "loading";
  return (
    <section aria-label="Thông tin theo thiết bị" className="w-full max-w-3xl rounded-2xl border border-white/10 bg-canvas-100/90 p-4 text-sm shadow-md sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-ink-900">Theo thiết bị của bạn</h2>
        <span className="text-xs text-ink-500">{matchedCount} món trong bộ lọc</span>
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span data-testid="device-date" className="font-semibold capitalize text-gold-400">{calendar.dateLabel}</span>
        <span data-testid="device-time" className="font-bold tabular-nums text-ink-900">{calendar.timeLabel}</span>
        <span data-testid="device-period" className="text-ink-700">{calendar.period}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink-500">
        Giờ thiết bị · {calendar.timeZone} · tự cập nhật
      </p>
      <p data-testid="lunar-date" className="mt-1 text-xs leading-relaxed text-ink-700">
        Âm lịch Việt Nam: <strong>{calendar.lunarLabel}</strong>
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2" aria-live="polite">
        <div className="min-w-0 rounded-xl border border-white/10 bg-canvas-200/50 p-3">
          <h3 className="text-xs font-semibold text-ink-500">📍 Khu vực theo định vị</h3>
          <p data-testid="device-location" className="mt-1 break-words font-semibold text-ink-900">
            {place.status === "ready" ? place.data.label : place.status === "loading" ? "Đang xác định vị trí…"
              : place.status === "error" ? place.message : "Chưa bật vị trí thiết bị"}
          </p>
          {place.status === "ready" && <p className="mt-1 text-xs leading-relaxed text-ink-500">
            Sai số thiết bị khoảng {Math.ceil(place.data.position.accuracy).toLocaleString("vi-VN")} m · {timestampLabel(place.data.position.timestamp)}
          </p>}
        </div>
        <div className="min-w-0 rounded-xl border border-white/10 bg-canvas-200/50 p-3">
          <h3 className="text-xs font-semibold text-ink-500">Thời tiết tại vị trí thiết bị</h3>
          <p data-testid="device-weather" className="mt-1 font-semibold text-ink-900">
            {weather.status === "ready" ? `${weather.data.icon} ${weather.data.label} · ${weather.data.temperature.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}°C`
              : weather.status === "loading" ? "Đang lấy dữ liệu thời tiết…"
              : weather.status === "error" ? weather.message : "Chưa có dữ liệu — cần vị trí thiết bị"}
          </p>
          {weather.status === "ready" && <p className="mt-1 text-xs leading-relaxed text-ink-500">
            Dữ liệu lúc {timestampLabel(weather.data.validAt)} · lấy lúc {timestampLabel(weather.data.fetchedAt)}
          </p>}
        </div>
      </div>

      {!enabled ? <div className="mt-3">
        <p className="text-xs leading-relaxed text-ink-500">
          Cho phép định vị để tự lấy khu vực và thời tiết. Tọa độ sẽ được gửi tới BigDataCloud và Open-Meteo cho tính năng này; HNAG không lưu tọa độ.
        </p>
        <button type="button" onClick={enableLocation} className="mt-2 min-h-11 rounded-lg bg-gold-500 px-4 py-2 text-sm font-bold text-canvas-50 hover:bg-gold-400">
          Dùng vị trí thiết bị
        </button>
      </div> : <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={refresh} disabled={loading} className="min-h-11 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-ink-900 hover:bg-canvas-300 disabled:opacity-50">
          {loading ? "Đang cập nhật…" : "Cập nhật vị trí và thời tiết"}
        </button>
        <button type="button" onClick={disableLocation} className="min-h-11 rounded-lg px-3 py-2 text-xs text-ink-500 hover:text-ink-900">Tắt dùng vị trí</button>
      </div>}

      <details className="mt-2 text-xs leading-relaxed text-ink-500">
        <summary className="min-h-8 cursor-pointer py-1.5">Nguồn dữ liệu và độ chính xác</summary>
        <ul className="mt-1 list-disc space-y-1 pl-4">
          <li>Ngày, giờ, thứ và múi giờ lấy từ thiết bị. Buổi trong ngày phân theo giờ thiết bị; giờ sai trên máy sẽ làm lịch hiển thị sai.</li>
          <li>Âm lịch Việt Nam quy đổi ngày dương đang hiển thị theo quy tắc UTC+7, hỗ trợ năm 2000–2035; có phân biệt tháng nhuận.</li>
          <li>Định vị GPS/Wi-Fi do trình duyệt cung cấp; tên khu vực từ <a href="https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api" target="_blank" rel="noreferrer" className="underline">BigDataCloud</a>. Không suy vị trí từ IP hay múi giờ.</li>
          <li>Thời tiết khu vực từ <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Open-Meteo</a> (mô hình khí tượng, không phải cảm biến điện thoại). Tự lấy lại sau 10 phút hoặc khi quay lại trang; dữ liệu quá hạn sẽ không được coi là hiện tại.</li>
          <li>Vị trí dùng để lấy thời tiết. Tỉnh ghi trên món là xuất xứ món, không xác nhận có quán gần bạn.</li>
        </ul>
      </details>
    </section>
  );
}
