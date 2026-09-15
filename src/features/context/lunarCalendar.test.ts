import { describe, expect, it } from "vitest";
import { getVietnameseLunarDate } from "./lunarCalendar";

const lunar = (day: number, month: number, year: number, isLeapMonth = false) => ({
  day, month, year, isLeapMonth,
});

describe("Vietnamese lunar calendar (UTC+7)", () => {
  // Published calendar fixtures; never injected into the runtime device clock.
  // Sources and full ephemeris validation are in reference-notes/vietnamese-lunar-calendar.md.
  it("matches the published Vietnamese calendar on 14 September 2026", () => {
    expect(getVietnameseLunarDate(14, 9, 2026)).toEqual(lunar(4, 8, 2026));
    expect(getVietnameseLunarDate(25, 9, 2026)).toEqual(lunar(15, 8, 2026));
  });

  it("changes the lunar year at Tet, rather than on Gregorian 1 January", () => {
    expect(getVietnameseLunarDate(1, 1, 2026)).toEqual(lunar(13, 11, 2025));
    expect(getVietnameseLunarDate(16, 2, 2026)).toEqual(lunar(29, 12, 2025));
    expect(getVietnameseLunarDate(17, 2, 2026)).toEqual(lunar(1, 1, 2026));
    expect(getVietnameseLunarDate(18, 2, 2026)).toEqual(lunar(2, 1, 2026));
  });

  it("uses Vietnam's new-moon day when China starts one day later", () => {
    // NASA: 2007-02-17 16:14 UT = 23:14 UTC+7, 00:14 next day UTC+8.
    expect(getVietnameseLunarDate(17, 2, 2007)).toEqual(lunar(1, 1, 2007));
    expect(getVietnameseLunarDate(18, 2, 2007)).toEqual(lunar(2, 1, 2007));
    // NASA: 2030-02-02 16:07 UT gives the same Vietnam/China day split.
    expect(getVietnameseLunarDate(2, 2, 2030)).toEqual(lunar(1, 1, 2030));
  });

  it("distinguishes ordinary, leap and following months in 2023 and 2025", () => {
    expect(getVietnameseLunarDate(20, 2, 2023)).toEqual(lunar(1, 2, 2023));
    expect(getVietnameseLunarDate(21, 3, 2023)).toEqual(lunar(30, 2, 2023));
    expect(getVietnameseLunarDate(22, 3, 2023)).toEqual(lunar(1, 2, 2023, true));
    expect(getVietnameseLunarDate(19, 4, 2023)).toEqual(lunar(29, 2, 2023, true));
    expect(getVietnameseLunarDate(20, 4, 2023)).toEqual(lunar(1, 3, 2023));
    expect(getVietnameseLunarDate(25, 7, 2025)).toEqual(lunar(1, 6, 2025, true));
    expect(getVietnameseLunarDate(23, 8, 2025)).toEqual(lunar(1, 7, 2025));
  });

  it("handles the exceptional leap month 11 in 2033", () => {
    expect(getVietnameseLunarDate(22, 11, 2033)).toEqual(lunar(1, 11, 2033));
    expect(getVietnameseLunarDate(21, 12, 2033)).toEqual(lunar(30, 11, 2033));
    expect(getVietnameseLunarDate(22, 12, 2033)).toEqual(lunar(1, 11, 2033, true));
    expect(getVietnameseLunarDate(20, 1, 2034)).toEqual(lunar(1, 12, 2033));
    expect(getVietnameseLunarDate(19, 2, 2034)).toEqual(lunar(1, 1, 2034));
  });

  it("matches all new-moon dates in NASA's 2026 ephemeris after UTC+7 conversion", () => {
    const monthStarts = [
      [19, 1, 12, 2025], [17, 2, 1, 2026], [19, 3, 2, 2026],
      [17, 4, 3, 2026], [17, 5, 4, 2026], [15, 6, 5, 2026],
      [14, 7, 6, 2026], [13, 8, 7, 2026], [11, 9, 8, 2026],
      [10, 10, 9, 2026], [9, 11, 10, 2026], [9, 12, 11, 2026],
    ] as const;
    for (const [day, month, lunarMonth, lunarYear] of monthStarts) {
      expect(getVietnameseLunarDate(day, month, 2026)).toEqual(lunar(1, lunarMonth, lunarYear));
    }
  });

  it("returns null for dates outside the verified range and invalid civil dates", () => {
    expect(getVietnameseLunarDate(1, 1, 2000)).toEqual(lunar(25, 11, 1999));
    expect(getVietnameseLunarDate(31, 12, 2035)).not.toBeNull();
    for (const [day, month, year] of [
      [31, 12, 1999], [1, 1, 2036], [29, 2, 2025], [31, 4, 2026],
      [0, 9, 2026], [14, 0, 2026], [1, 13, 2026], [1.5, 9, 2026],
      [Number.NaN, 9, 2026], [1, 9, Infinity],
    ]) expect(getVietnameseLunarDate(day!, month!, year!)).toBeNull();
    expect(getVietnameseLunarDate(29, 2, 2024)).toEqual(lunar(20, 1, 2024));
  });

  it("has continuous days, valid month boundaries and year transitions across the supported range", () => {
    const start = Date.UTC(2000, 0, 1);
    const end = Date.UTC(2035, 11, 31);
    let previous = getVietnameseLunarDate(1, 1, 2000)!;
    for (let value = start + 86_400_000; value <= end; value += 86_400_000) {
      const date = new Date(value);
      const next = getVietnameseLunarDate(date.getUTCDate(), date.getUTCMonth() + 1, date.getUTCFullYear());
      expect(next, date.toISOString()).not.toBeNull();
      if (!next) continue;
      if (next.day === 1) {
        expect([29, 30]).toContain(previous.day);
        expect(next.month).toBe(next.isLeapMonth ? previous.month : previous.month % 12 + 1);
        expect(next.year).toBe(previous.year + (next.month === 1 ? 1 : 0));
      } else {
        expect(next).toEqual({ ...previous, day: previous.day + 1 });
      }
      previous = next;
    }
  });
});
