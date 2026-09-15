export interface VietnameseLunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

export const VIETNAMESE_LUNAR_MIN_YEAR = 2000;
export const VIETNAMESE_LUNAR_MAX_YEAR = 2035;

const DAY_MS = 86_400_000;

/**
 * Factual UTC+7 calendar data, derived from NASA/GSFC new-moon ephemerides.
 * Each row: Gregorian Tet date, repeated month (0 = none), month lengths
 * in chronological order (0 = 29 days, 1 = 30 days, including leap months).
 * The 1999 row covers January 2000. These are calendar facts, not sample
 * runtime dates. Derivation, sources and independent verification:
 * docs/reference-notes/vietnamese-lunar-calendar.md
 */
const LUNAR_YEARS = [
  ["1999-02-16", 0, "100100101110"],
  ["2000-02-05", 0, "110010010110"],
  ["2001-01-24", 4, "1101010010101"],
  ["2002-02-12", 0, "110101001010"],
  ["2003-02-01", 0, "110110100101"],
  ["2004-01-22", 2, "0101101010101"],
  ["2005-02-09", 0, "010101101010"],
  ["2006-01-29", 7, "1010011011010"],
  ["2007-02-17", 0, "101001011101"],
  ["2008-02-07", 0, "100100101011"],
  ["2009-01-26", 5, "1010100101011"],
  ["2010-02-14", 0, "101010010101"],
  ["2011-02-03", 0, "101101001010"],
  ["2012-01-23", 4, "1011010101010"],
  ["2013-02-10", 0, "101011010101"],
  ["2014-01-31", 9, "0101010110101"],
  ["2015-02-19", 0, "010010111010"],
  ["2016-02-08", 0, "101001011011"],
  ["2017-01-28", 6, "0101001010111"],
  ["2018-02-16", 0, "010100100111"],
  ["2019-02-05", 0, "011010010011"],
  ["2020-01-25", 4, "0111010010011"],
  ["2021-02-12", 0, "011010101010"],
  ["2022-02-01", 0, "101011010101"],
  ["2023-01-22", 2, "0100110110101"],
  ["2024-02-10", 0, "010010110110"],
  ["2025-01-29", 6, "1010010101110"],
  ["2026-02-17", 0, "101001001110"],
  ["2027-02-06", 0, "110100100110"],
  ["2028-01-26", 5, "1110100100110"],
  ["2029-02-13", 0, "110101010010"],
  ["2030-02-02", 0, "110110101010"],
  ["2031-01-23", 3, "0101101101010"],
  ["2032-02-11", 0, "010101101101"],
  ["2033-01-31", 11, "0100101011101"],
  ["2034-02-19", 0, "010010011101"],
  ["2035-02-08", 0, "101001001101"],
] as const;

/**
 * Convert a Gregorian civil date to the Vietnamese calendar (UTC+7 rules).
 * The caller supplies the device-local day/month/year; this function never
 * reads or invents today's date. UTC arithmetic only avoids DST dependence.
 * Unsupported years and impossible Gregorian dates return null.
 */
export function getVietnameseLunarDate(
  day: number,
  month: number,
  year: number,
): VietnameseLunarDate | null {
  if (
    ![day, month, year].every(Number.isInteger) ||
    year < VIETNAMESE_LUNAR_MIN_YEAR || year > VIETNAMESE_LUNAR_MAX_YEAR ||
    month < 1 || month > 12 || day < 1 || day > 31
  ) return null;

  const timestamp = Date.UTC(year, month - 1, day);
  if (new Date(timestamp).getUTCDate() !== day) return null;

  const row = LUNAR_YEARS.findLast(([newYear]) => Date.parse(newYear) <= timestamp);
  if (!row) return null;
  const [newYear, leapMonth, monthLengths] = row;
  let remainingDays = (timestamp - Date.parse(newYear)) / DAY_MS;

  for (let index = 0; index < monthLengths.length; index++) {
    const length = monthLengths[index] === "1" ? 30 : 29;
    if (remainingDays < length) {
      return {
        day: remainingDays + 1,
        month: index + 1 - (leapMonth > 0 && index >= leapMonth ? 1 : 0),
        year: Number(newYear.slice(0, 4)),
        isLeapMonth: leapMonth > 0 && index === leapMonth,
      };
    }
    remainingDays -= length;
  }
  return null;
}
