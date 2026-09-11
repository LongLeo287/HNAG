import { describe, expect, it } from "vitest";
import {
  detectDayType,
  detectMealTime,
  filterItemsByContext,
  matchesLocation,
  matchesMealTime,
  resolveContext,
} from "./contextEngine";
import type { CandidateItem } from "@/data/catalog";
import type { ContextFilters } from "./types";

const makeMockItem = (overrides: Partial<CandidateItem> = {}): CandidateItem => ({
  id: "test-item-1",
  name: "Phở bò Hà Nội",
  kind: "FOOD",
  categoryId: "pho-mi",
  vegetarianPossible: false,
  priceVnd: 45000,
  rarity: "NGON",
  origin: "BUNDLED",
  enabled: true,
  province: "Hà Nội",
  region: "Bắc Bộ",
  mealTimes: ["Ăn sáng", "Ăn trưa", "Ăn tối"],
  weatherSuitability: "ANY",
  daySuitability: "ANY",
  ...overrides,
});

describe("contextEngine - pure time & day detection", () => {
  it("accurately detects meal times based on 24h clock", () => {
    expect(detectMealTime(new Date("2026-09-11T07:15:00"))).toBe("BREAKFAST");
    expect(detectMealTime(new Date("2026-09-11T10:15:00"))).toBe("BREAKFAST");
    expect(detectMealTime(new Date("2026-09-11T12:00:00"))).toBe("LUNCH");
    expect(detectMealTime(new Date("2026-09-11T13:45:00"))).toBe("LUNCH");
    expect(detectMealTime(new Date("2026-09-11T15:30:00"))).toBe("AFTERNOON");
    expect(detectMealTime(new Date("2026-09-11T17:00:00"))).toBe("AFTERNOON");
    expect(detectMealTime(new Date("2026-09-11T19:30:00"))).toBe("DINNER");
    expect(detectMealTime(new Date("2026-09-11T21:00:00"))).toBe("DINNER");
    expect(detectMealTime(new Date("2026-09-11T22:30:00"))).toBe("LATE_NIGHT");
    expect(detectMealTime(new Date("2026-09-11T02:00:00"))).toBe("LATE_NIGHT");
  });

  it("accurately detects weekday vs weekend", () => {
    // 2026-09-07 is Monday
    expect(detectDayType(new Date("2026-09-07T10:00:00"))).toBe("WEEKDAY");
    // 2026-09-11 is Friday 14:00 (before 17:00)
    expect(detectDayType(new Date("2026-09-11T14:00:00"))).toBe("WEEKDAY");
    // 2026-09-11 is Friday 18:00 (party starts!)
    expect(detectDayType(new Date("2026-09-11T18:00:00"))).toBe("WEEKEND");
    // 2026-09-12 is Saturday
    expect(detectDayType(new Date("2026-09-12T12:00:00"))).toBe("WEEKEND");
    // 2026-09-13 is Sunday
    expect(detectDayType(new Date("2026-09-13T20:00:00"))).toBe("WEEKEND");
  });

  it("resolves context with overrides or auto-defaults", () => {
    const filters: ContextFilters = {
      mealTime: "BREAKFAST",
      weather: "RAINY_COOL",
      dayType: "WEEKEND",
      location: "Hà Nội",
      autoSyncTime: false,
    };
    const resolved = resolveContext(filters, new Date("2026-09-11T12:00:00"));
    expect(resolved.mealTime).toBe("BREAKFAST");
    expect(resolved.weather).toBe("RAINY_COOL");
    expect(resolved.dayType).toBe("WEEKEND");
    expect(resolved.location).toBe("Hà Nội");
    expect(resolved.isAutoDetected).toBe(false);
  });
});

describe("contextEngine - item filtering & matching", () => {
  it("matches location for exact province and national items", () => {
    const hanoiDish = makeMockItem({ province: "Hà Nội" });
    const saigonDish = makeMockItem({ province: "TP. Hồ Chí Minh" });
    const nationalDish = makeMockItem({ province: "Toàn quốc" });

    expect(matchesLocation(hanoiDish, "Hà Nội")).toBe(true);
    expect(matchesLocation(saigonDish, "Hà Nội")).toBe(false);
    expect(matchesLocation(nationalDish, "Hà Nội")).toBe(true);
    expect(matchesLocation(hanoiDish, "ALL")).toBe(true);
  });

  it("matches meal times properly", () => {
    const breakfastOnly = makeMockItem({ mealTimes: ["Ăn sáng"] });
    const lateNightOnly = makeMockItem({ mealTimes: ["Ăn khuya"] });

    expect(matchesMealTime(breakfastOnly, "BREAKFAST")).toBe(true);
    expect(matchesMealTime(breakfastOnly, "DINNER")).toBe(false);
    expect(matchesMealTime(lateNightOnly, "LATE_NIGHT")).toBe(true);
  });

  it("gracefully falls back when filters are extremely narrow so pool is never empty", () => {
    const sampleItems = [
      makeMockItem({ id: "1", province: "Hà Nội", mealTimes: ["Ăn sáng"] }),
      makeMockItem({ id: "2", province: "TP. Hồ Chí Minh", mealTimes: ["Ăn trưa"] }),
    ];

    const result = filterItemsByContext(sampleItems, {
      mealTime: "LATE_NIGHT",
      weather: "RAINY_COOL",
      dayType: "WEEKDAY",
      location: "Cao Bằng",
      isAutoDetected: false,
    });

    expect(result.length).toBeGreaterThan(0);
  });
});
