# Vietnamese lunar calendar provenance

The runtime converts the device's current Gregorian civil date to a Vietnamese
lunar date. It does not substitute a sample date, use the Chinese calendar, or
infer a date from location. Gregorian date, weekday, time and timezone come from
the device. Lunar months follow the Vietnamese UTC+7 calendar convention for that
displayed civil date, including when the device is outside Vietnam.

## Data and derivation

`src/features/context/lunarCalendar.ts` contains 37 factual calendar rows for
lunar years 1999 through 2035. Each row records the Gregorian Tet date, leap month
number and chronological sequence of 29/30-day month lengths. The 1999 row is
needed to convert January 2000. Supported Gregorian input is 2000–2035 inclusive;
invalid or unsupported dates return `null` and the UI reports the limitation.

Sources reviewed on 2026-09-14:

- [NASA/GSFC phases of the Moon, 1901–2000](https://eclipse.gsfc.nasa.gov/phase/phase1901gmt.html)
- [NASA/GSFC phases of the Moon, 2001–2100](https://eclipse.gsfc.nasa.gov/phase/phase2001gmt.html)
- [Ho Ngoc Duc's Vietnamese calendar rules](https://www.informatik.uni-leipzig.de/~duc/amlich/calrules_en.html)
- [Sydney Local Health District's 2026 Vietnamese community calendar](https://slhd.health.nsw.gov.au/sites/default/files/2026-04/Vietnamese-Calendar-2026-En.pdf)

An independent research calculation read 494 NASA new-moon entries spanning
1998–2037. It converted UT instants into UTC+7 civil dates, identified month 11
by the winter solstice, and identified a repeated month by the missing principal
solar term in a 13-month interval. Adjacent new-moon dates determine month lengths.
The resulting 37 rows were compared against Ho Ngoc Duc's published calendar facts:
no Tet-date, leap-month or month-length differences were found.

No downloaded calendar program was executed or copied into the application, and
no calendar package was added. The runtime lookup and conversion code were written
for this project. The rows encode calendar facts; they do not fix the runtime clock.

## Verification and maintenance

Unit tests cover all civil days in 2000–2035 for continuity, legal month lengths and
year transitions. Independent fixtures cover Tet 2026, all 2026 new-moon month starts,
the 2023 and 2025 leap months, and the exceptional leap month 11 in 2033.

The 2007 and 2030 tests distinguish Vietnam's UTC+7 new-moon day from China's UTC+8
day. For example, NASA's new moon on 2007-02-17 at 16:14 UT occurs at 23:14 in Vietnam
but after midnight in China. Browser tests cover midnight rollover and a device
timezone outside Vietnam. Published 2026 calendar checks include 2026-09-14 = lunar
4/8/2026 and 2026-09-25 = lunar 15/8/2026.

Extend the verified factual table and independent boundary fixtures before supporting
Gregorian years after 2035. Never approximate an unsupported date or substitute a
Chinese-calendar result silently. Device clock errors remain device clock errors;
the application makes this dependency explicit rather than claiming an authoritative
network clock.
