import type { CandidateItem } from "@/data/catalog";
import type {
  ContextFilters,
  ResolvedContext,
  ResolvedDayType,
  ResolvedMealTime,
  ResolvedWeather,
} from "./types";

/** Pure time detection: Maps 24h clock to Vietnamese dining routines */
export function detectMealTime(date: Date = new Date()): ResolvedMealTime {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // 05:00 - 10:30 (300 to 630 min)
  if (totalMinutes >= 300 && totalMinutes < 630) {
    return "BREAKFAST";
  }
  // 10:30 - 14:00 (630 to 840 min)
  if (totalMinutes >= 630 && totalMinutes < 840) {
    return "LUNCH";
  }
  // 14:00 - 17:30 (840 to 1050 min)
  if (totalMinutes >= 840 && totalMinutes < 1050) {
    return "AFTERNOON";
  }
  // 17:30 - 21:30 (1050 to 1290 min)
  if (totalMinutes >= 1050 && totalMinutes < 1290) {
    return "DINNER";
  }
  // 21:30 - 05:00
  return "LATE_NIGHT";
}

/** Calendar weekdays: Friday remains Friday, including its evening. */
export function detectDayType(date: Date = new Date()): ResolvedDayType {
  const day = date.getDay(); // 0 = Sunday, 1 = Mon, ..., 5 = Fri, 6 = Sat
  if (day === 0 || day === 6) return "WEEKEND";
  return "WEEKDAY";
}

export function resolveContext(filters: ContextFilters, now: Date = new Date()): ResolvedContext {
  const isAuto = filters.mealTime === "AUTO" || filters.dayType === "AUTO" || filters.weather === "AUTO";

  const resolvedMealTime: ResolvedMealTime =
    filters.mealTime === "AUTO" || filters.mealTime === "ALL"
      ? detectMealTime(now)
      : (filters.mealTime as ResolvedMealTime);

  const resolvedDayType: ResolvedDayType =
    filters.dayType === "AUTO" ? detectDayType(now) : filters.dayType;

  const resolvedWeather: ResolvedWeather =
    filters.weather === "AUTO" ? "UNKNOWN" : filters.weather;

  return {
    mealTime: resolvedMealTime,
    weather: resolvedWeather,
    dayType: resolvedDayType,
    location: filters.location || "ALL",
    isAutoDetected: isAuto,
  };
}

const MEAL_TIME_TAG_MAP: Record<ResolvedMealTime, string[]> = {
  BREAKFAST: ["ăn sáng", "điểm tâm", "sáng"],
  LUNCH: ["ăn trưa", "trưa"],
  AFTERNOON: ["ăn xế", "ăn chiều", "ăn vặt", "giải khát", "chiều", "xế", "tráng miệng"],
  DINNER: ["ăn tối", "ăn nhậu", "tiệc / tụ họp", "tụ họp", "tối"],
  LATE_NIGHT: ["ăn khuya", "khuya", "đêm"],
};

export function matchesMealTime(item: CandidateItem, mealTime: ResolvedMealTime): boolean {
  if (item.mealTimes && item.mealTimes.length > 0) {
    const targetTags = MEAL_TIME_TAG_MAP[mealTime];
    const itemTags = item.mealTimes.map((t) => t.toLowerCase());

    for (const tag of itemTags) {
      for (const target of targetTags) {
        if (tag.includes(target) || target.includes(tag)) return true;
      }
    }
    return false;
  }

  // Fallback heuristics when item has no explicit mealTimes
  const name = item.name.toLowerCase();
  if (mealTime === "BREAKFAST") {
    if (["pho-mi", "bun", "com", "banh", "chao-sup"].includes(item.categoryId)) return true;
    if (item.categoryId === "cafe") return true;
  } else if (mealTime === "LUNCH") {
    if (["com", "bun", "pho-mi", "fastfood"].includes(item.categoryId)) return true;
    if (item.kind === "DRINK") return true;
  } else if (mealTime === "AFTERNOON") {
    if (["an-vat", "banh", "tra-sua", "tra", "ep-sinh-to", "da-xay"].includes(item.categoryId)) return true;
  } else if (mealTime === "DINNER") {
    if (["com", "lau-nuong", "pho-mi", "bun"].includes(item.categoryId)) return true;
  } else if (mealTime === "LATE_NIGHT") {
    if (name.includes("cháo") || name.includes("phở") || name.includes("mì") || name.includes("bánh mì") || name.includes("ốc")) {
      return true;
    }
    if (item.categoryId === "chao-sup" || item.categoryId === "pho-mi" || item.categoryId === "lau-nuong") return true;
  }

  return true;
}

export function matchesLocation(item: CandidateItem, location: string): boolean {
  if (!location || location === "ALL") return true;
  if (!item.province || item.province === "Toàn quốc" || item.province === "Nhiều tỉnh/thành") return true;
  
  const normLocation = location.toLowerCase();
  const itemProv = item.province.toLowerCase();

  return itemProv.includes(normLocation) || normLocation.includes(itemProv);
}

export function matchesWeather(item: CandidateItem, weather: ResolvedWeather): boolean {
  if (weather === "MILD" || weather === "UNKNOWN") return true;
  if (!item.weatherSuitability || item.weatherSuitability === "ANY") return true;
  return item.weatherSuitability === weather;
}

export function matchesDayType(item: CandidateItem, dayType: ResolvedDayType): boolean {
  if (!item.daySuitability || item.daySuitability === "ANY") return true;
  return item.daySuitability === dayType;
}

/** An empty intersection stays empty; the UI can explicitly disable suggestion filters. */
export function filterItemsByContext(items: CandidateItem[], context: ResolvedContext): CandidateItem[] {
  return items.filter((item) => {
    if (!matchesLocation(item, context.location)) return false;
    if (!matchesMealTime(item, context.mealTime)) return false;
    if (!matchesWeather(item, context.weather)) return false;
    return true;
  });

}

/** Format a high-end contextual badge summary for the header/UI */
export function formatContextSummary(context: ResolvedContext, count: number): string {
  const locLabel = context.location === "ALL" ? "Không lọc xuất xứ món" : context.location;
  const mealLabel =
    context.mealTime === "BREAKFAST"
      ? "Ăn sáng"
      : context.mealTime === "LUNCH"
      ? "Ăn trưa"
      : context.mealTime === "AFTERNOON"
      ? "Ăn xế"
      : context.mealTime === "DINNER"
      ? "Ăn tối"
      : "Ăn khuya";
  
  const weatherLabel =
    context.weather === "UNKNOWN" ? "Chưa có dữ liệu thời tiết" : context.weather === "RAINY_COOL"
      ? "Trời mưa / Lạnh 🌧️"
      : context.weather === "SUNNY_HOT"
      ? "Trời nắng ☀️"
      : "Dịu mát ⛅";

  return `📍 ${locLabel} • ${mealLabel} • ${weatherLabel} (${count} món)`;
}
