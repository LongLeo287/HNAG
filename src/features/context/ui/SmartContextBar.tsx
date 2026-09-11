import { useState, useRef, useEffect } from "react";
import type {
  ContextFilters,
  MealTime,
  ResolvedContext,
  ResolvedMealTime,
  WeatherCondition,
  DayType,
} from "../types";
import {
  MEAL_TIME_INFO,
  WEATHER_INFO,
  DAY_TYPE_INFO,
  POPULAR_LOCATIONS,
} from "../types";

interface SmartContextBarProps {
  filters: ContextFilters;
  resolvedContext: ResolvedContext;
  matchedCount: number;
  disabled?: boolean;
  onMealTimeChange: (mealTime: MealTime) => void;
  onWeatherChange: (weather: WeatherCondition) => void;
  onDayTypeChange: (dayType: DayType) => void;
  onLocationChange: (location: string) => void;
  onResetContext: () => void;
}

const MEAL_TIMES: ResolvedMealTime[] = [
  "BREAKFAST",
  "LUNCH",
  "AFTERNOON",
  "DINNER",
  "LATE_NIGHT",
];

export function SmartContextBar({
  filters,
  resolvedContext,
  matchedCount,
  disabled = false,
  onMealTimeChange,
  onWeatherChange,
  onDayTypeChange,
  onLocationChange,
  onResetContext,
}: SmartContextBarProps) {
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target as Node)) {
        setLocationMenuOpen(false);
      }
    }
    if (locationMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [locationMenuOpen]);

  const activeLocation =
    POPULAR_LOCATIONS.find((l) => l.id === resolvedContext.location) ?? {
      id: resolvedContext.location,
      label: resolvedContext.location,
    };

  const isCustomized =
    filters.mealTime !== "AUTO" ||
    filters.weather !== "AUTO" ||
    filters.dayType !== "AUTO" ||
    filters.location !== "ALL";

  return (
    <section
      aria-label="Bộ lọc ngữ cảnh thông minh"
      className="relative w-full rounded-2xl border border-white/10 bg-canvas-100/80 p-3.5 backdrop-blur-md shadow-xl transition-all sm:p-4"
    >
      {/* Top row: Location selector, Weather switcher, Day switcher & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-3">
        {/* Left: Location Dropdown */}
        <div className="relative" ref={locationMenuRef}>
          <button
            type="button"
            disabled={disabled}
            aria-expanded={locationMenuOpen}
            aria-haspopup="listbox"
            onClick={() => setLocationMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-canvas-200/90 px-3 py-1.5 text-xs font-medium text-white hover:border-gold-400/50 hover:bg-canvas-200 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          >
            <span className="text-sm">📍</span>
            <span className="font-semibold text-gold-400">{activeLocation.label}</span>
            <span className="text-xs text-ink-500">▼</span>
          </button>

          {locationMenuOpen && (
            <div
              role="listbox"
              className="absolute left-0 top-full z-50 mt-1.5 max-h-60 w-56 overflow-y-auto rounded-xl border border-white/15 bg-canvas-100 p-1.5 shadow-2xl backdrop-blur-xl"
            >
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Chọn Vị Trí / Vùng Miền
              </div>
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = resolvedContext.location === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onLocationChange(loc.id);
                      setLocationMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-gold-500/20 font-semibold text-gold-300"
                        : "text-ink-700 hover:bg-canvas-200 hover:text-white"
                    }`}
                  >
                    <span>{loc.label}</span>
                    {"region" in loc && (
                      <span className="text-[10px] text-ink-500">{loc.region}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Center/Right: Weather & Day Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Weather Toggle */}
          <div className="flex items-center rounded-xl border border-white/10 bg-canvas-200/60 p-0.5">
            {(["SUNNY_HOT", "RAINY_COOL", "MILD"] as const).map((wKey) => {
              const info = WEATHER_INFO[wKey];
              const isActive = resolvedContext.weather === wKey;
              return (
                <button
                  key={wKey}
                  type="button"
                  disabled={disabled}
                  title={info.hint}
                  onClick={() => onWeatherChange(filters.weather === wKey ? "AUTO" : wKey)}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all ${
                    isActive
                      ? "bg-gold-500/20 font-semibold text-gold-300 shadow-sm ring-1 ring-gold-400/40"
                      : "text-ink-500 hover:text-white"
                  }`}
                >
                  <span>{info.icon}</span>
                  <span className="hidden sm:inline">{info.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Day Type Toggle */}
          <div className="flex items-center rounded-xl border border-white/10 bg-canvas-200/60 p-0.5">
            {(["WEEKDAY", "WEEKEND"] as const).map((dKey) => {
              const info = DAY_TYPE_INFO[dKey];
              const isActive = resolvedContext.dayType === dKey;
              return (
                <button
                  key={dKey}
                  type="button"
                  disabled={disabled}
                  title={info.hint}
                  onClick={() => onDayTypeChange(filters.dayType === dKey ? "AUTO" : dKey)}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all ${
                    isActive
                      ? "bg-gold-500/20 font-semibold text-gold-300 shadow-sm ring-1 ring-gold-400/40"
                      : "text-ink-500 hover:text-white"
                  }`}
                >
                  <span>{info.icon}</span>
                  <span className="hidden sm:inline">{info.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Reset button if custom */}
          {isCustomized && (
            <button
              type="button"
              disabled={disabled}
              onClick={onResetContext}
              title="Đặt lại về chế độ tự động theo giờ thực"
              className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-ink-500 hover:border-white/30 hover:text-white"
            >
              <span>↺</span>
              <span className="hidden sm:inline">Giờ thực</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Meal Time Chips (Sáng, Trưa, Xế, Tối, Khuya, Cả ngày) */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="hidden text-xs font-semibold text-ink-500 md:inline">
          Buổi ăn:
        </span>
        {MEAL_TIMES.map((mKey) => {
          const info = MEAL_TIME_INFO[mKey];
          const isSelected = resolvedContext.mealTime === mKey;
          const isExplicit = filters.mealTime === mKey;

          return (
            <button
              key={mKey}
              type="button"
              disabled={disabled}
              title={info.hint}
              onClick={() => onMealTimeChange(filters.mealTime === mKey ? "AUTO" : mKey)}
              className={`group relative flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? "border-gold-400/60 bg-gradient-to-r from-gold-500/25 via-gold-500/15 to-transparent text-white shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-gold-400/40"
                  : "border-white/10 bg-canvas-200/50 text-ink-700 hover:border-white/20 hover:bg-canvas-200 hover:text-white"
              }`}
            >
              <span className="text-sm">{info.icon}</span>
              <span>{info.label}</span>
              {isSelected && !isExplicit && (
                <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" title="Khớp giờ thực" />
              )}
            </button>
          );
        })}

        {/* All day / Any time chip */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onMealTimeChange("ALL")}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
            filters.mealTime === "ALL"
              ? "border-gold-400/60 bg-gold-500/20 text-white ring-1 ring-gold-400/40"
              : "border-white/10 bg-canvas-200/50 text-ink-700 hover:border-white/20 hover:bg-canvas-200 hover:text-white"
          }`}
        >
          <span>🕒</span>
          <span>Tất cả</span>
        </button>

        {/* Live Matched Count Badge */}
        <div className="ml-auto hidden items-center gap-1 text-xs text-ink-500 sm:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-400" />
          <span>
            Đã lọc: <strong className="font-bold text-gold-400">{matchedCount}</strong> món
          </span>
        </div>
      </div>
    </section>
  );
}
