export type MealTime = "AUTO" | "BREAKFAST" | "LUNCH" | "AFTERNOON" | "DINNER" | "LATE_NIGHT" | "ALL";

export type ResolvedMealTime = "BREAKFAST" | "LUNCH" | "AFTERNOON" | "DINNER" | "LATE_NIGHT";

export type WeatherCondition = "AUTO" | "SUNNY_HOT" | "RAINY_COOL" | "MILD";

export type ResolvedWeather = "SUNNY_HOT" | "RAINY_COOL" | "MILD" | "UNKNOWN";

export type DayType = "AUTO" | "WEEKDAY" | "WEEKEND";

export type ResolvedDayType = "WEEKDAY" | "WEEKEND";

export interface ContextFilters {
  mealTime: MealTime;
  weather: WeatherCondition;
  dayType: DayType;
  location: string;
  autoSyncTime: boolean;
}

export interface ResolvedContext {
  mealTime: ResolvedMealTime;
  weather: ResolvedWeather;
  dayType: ResolvedDayType;
  location: string;
  isAutoDetected: boolean;
}

export interface ContextOptionInfo {
  id: string;
  label: string;
  shortLabel?: string;
  icon: string;
  badge?: string;
  hint?: string;
}

export const MEAL_TIME_INFO: Record<ResolvedMealTime, ContextOptionInfo> = {
  BREAKFAST: {
    id: "BREAKFAST",
    label: "Ăn sáng",
    shortLabel: "Sáng",
    icon: "🍳",
    badge: "05:00 - 10:30",
    hint: "Bún, phở, bánh mì, xôi, cà phê sáng tràn đầy năng lượng",
  },
  LUNCH: {
    id: "LUNCH",
    label: "Ăn trưa",
    shortLabel: "Trưa",
    icon: "🍛",
    badge: "10:30 - 14:00",
    hint: "Cơm tấm, cơm văn phòng, bún chả, mì xào no bụng",
  },
  AFTERNOON: {
    id: "AFTERNOON",
    label: "Ăn xế / Chiều",
    shortLabel: "Xế",
    icon: "🧋",
    badge: "14:00 - 17:30",
    hint: "Trà sữa, bánh tráng, chè, kem, các món ăn vặt giải nhiệt",
  },
  DINNER: {
    id: "DINNER",
    label: "Ăn tối",
    shortLabel: "Tối",
    icon: "🍲",
    badge: "17:30 - 21:30",
    hint: "Bữa cơm gia đình ấm cúng, lẩu, nướng BBQ, tụ họp bạn bè",
  },
  LATE_NIGHT: {
    id: "LATE_NIGHT",
    label: "Ăn khuya",
    shortLabel: "Khuya",
    icon: "🌙",
    badge: "21:30 - 05:00",
    hint: "Cháo sườn đêm, mì xào khuya, ốc nóng, bánh mì dân tổ",
  },
};

export const WEATHER_INFO: Record<ResolvedWeather, ContextOptionInfo> = {
  UNKNOWN: { id: "UNKNOWN", label: "Chưa có dữ liệu thời tiết", icon: "—" },
  SUNNY_HOT: {
    id: "SUNNY_HOT",
    label: "Trời nắng oi",
    shortLabel: "Nắng oi",
    icon: "☀️",
    hint: "Ưu tiên đồ uống tươi mát, món thanh đạm, ít dầu mỡ, canh chua giải nhiệt",
  },
  RAINY_COOL: {
    id: "RAINY_COOL",
    label: "Trời mưa / Lạnh",
    shortLabel: "Mưa / Lạnh",
    icon: "🌧️",
    hint: "Ưu tiên lẩu nướng, phở bò sốt vang, cháo sườn nóng hổi, món xào cay ấm bụng",
  },
  MILD: {
    id: "MILD",
    label: "Dịu mát",
    shortLabel: "Dịu mát",
    icon: "⛅",
    hint: "Thời tiết lý tưởng, phù hợp với mọi món ăn ngon",
  },
};

export const DAY_TYPE_INFO: Record<ResolvedDayType, ContextOptionInfo> = {
  WEEKDAY: {
    id: "WEEKDAY",
    label: "Ngày thường",
    shortLabel: "Thứ 2 - 6",
    icon: "💼",
    hint: "Bữa ăn tiện lợi, nhanh gọn, tiết kiệm thời gian công sở",
  },
  WEEKEND: {
    id: "WEEKEND",
    label: "Cuối tuần",
    shortLabel: "Thứ 7 - CN",
    icon: "🎉",
    hint: "Thời gian thư thả: ăn nhậu, lẩu nướng lai rai, cà phê chill",
  },
};

export const DEFAULT_CONTEXT_FILTERS: ContextFilters = {
  mealTime: "AUTO",
  weather: "AUTO",
  dayType: "AUTO",
  location: "ALL",
  autoSyncTime: true,
};

export const POPULAR_LOCATIONS = [
  { id: "ALL", label: "Toàn quốc 🇻🇳", region: "Toàn quốc" },
  { id: "Hà Nội", label: "Hà Nội", region: "Bắc Bộ" },
  { id: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh", region: "Đông Nam Bộ" },
  { id: "Đà Nẵng", label: "Đà Nẵng", region: "Duyên hải Nam Trung Bộ" },
  { id: "Hải Phòng", label: "Hải Phòng", region: "Bắc Bộ" },
  { id: "Cần Thơ", label: "Cần Thơ", region: "Tây Nam Bộ" },
  { id: "TP. Huế", label: "TP. Huế", region: "Bắc Trung Bộ" },
  { id: "Lâm Đồng", label: "Lâm Đồng (Đà Lạt)", region: "Tây Nguyên" },
  { id: "Khánh Hòa", label: "Khánh Hòa (Nha Trang)", region: "Duyên hải Nam Trung Bộ" },
  { id: "An Giang", label: "An Giang", region: "Tây Nam Bộ" },
  { id: "Đắk Lắk", label: "Đắk Lắk", region: "Tây Nguyên" },
  { id: "Quảng Ninh", label: "Quảng Ninh", region: "Bắc Bộ" },
  { id: "Cà Mau", label: "Cà Mau", region: "Tây Nam Bộ" },
  { id: "Vĩnh Long", label: "Vĩnh Long", region: "Tây Nam Bộ" },
  { id: "Gia Lai", label: "Gia Lai", region: "Tây Nguyên" },
] as const;
