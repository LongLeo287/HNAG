import { getVietnameseLunarDate } from "./lunarCalendar";

/** Gregorian wall date and time always use the device's current timezone. */
export function deviceCalendar(now: Date) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateLabel = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(now);
  const timeLabel = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now);
  const hour = now.getHours();
  const period = hour >= 5 && hour < 11 ? "Buổi sáng" : hour >= 11 && hour < 14 ? "Buổi trưa"
    : hour >= 14 && hour < 18 ? "Buổi chiều" : hour >= 18 && hour < 22 ? "Buổi tối" : "Đêm khuya";
  const lunar = getVietnameseLunarDate(now.getDate(), now.getMonth() + 1, now.getFullYear());
  const lunarLabel = lunar ? `${lunar.day}/${lunar.month}${lunar.isLeapMonth ? " nhuận" : ""}/${lunar.year}` : "Ngày nằm ngoài phạm vi lịch được hỗ trợ";
  return { dateLabel, timeLabel, period, timeZone, lunarLabel };
}
