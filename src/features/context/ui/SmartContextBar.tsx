import type { ResolvedContext } from "../types";
import { MEAL_TIME_INFO, WEATHER_INFO, DAY_TYPE_INFO } from "../types";

interface SmartContextBarProps {
  resolvedContext: ResolvedContext;
  matchedCount: number;
}

/**
 * Smart Context Indicator (User request 2026-09-11):
 * Hoàn toàn tự động nhận diện theo giờ thực, thời tiết và ngày trong tuần.
 * Không ép người dùng phải chọn nút bấm thủ công; hiển thị tinh tế dưới dạng badge trạng thái thông minh.
 */
export function SmartContextBar({
  resolvedContext,
  matchedCount,
}: SmartContextBarProps) {
  const mealInfo = MEAL_TIME_INFO[resolvedContext.mealTime];
  const weatherInfo = WEATHER_INFO[resolvedContext.weather];
  const dayInfo = DAY_TYPE_INFO[resolvedContext.dayType];
  const locLabel =
    resolvedContext.location === "ALL" ? "Toàn quốc" : resolvedContext.location;

  return (
    <div
      role="status"
      aria-label="Tự động nhận diện ngữ cảnh"
      className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-canvas-100/90 px-4 py-2 text-xs text-ink-500 shadow-md backdrop-blur-md transition-all hover:border-gold-400/30"
    >
      <span className="flex items-center gap-1.5 font-medium text-emerald-400">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
        <span className="font-semibold">Tự động tối ưu:</span>
      </span>

      <span className="font-bold text-gold-400">
        {mealInfo.icon} {mealInfo.label}
      </span>

      <span className="text-white/20">•</span>

      <span className="text-ink-400">
        {weatherInfo.icon} {weatherInfo.shortLabel}
      </span>

      <span className="text-white/20">•</span>

      <span className="text-ink-400">
        {dayInfo.icon} {dayInfo.shortLabel}
      </span>

      <span className="text-white/20">•</span>

      <span className="text-ink-400">
        📍 {locLabel}
      </span>

      <span className="text-white/20">•</span>

      <span className="font-bold text-ink-300">
        {matchedCount} món phù hợp
      </span>
    </div>
  );
}
