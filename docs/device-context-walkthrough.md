# Device-derived context correction

The previous context bar guessed weather from the hour, displayed a saved region
as if it were device context, and replaced exact weekdays with broad groups. The
new bar displays the device's actual weekday, date, time, timezone and time-of-day
period. It calculates the Vietnamese lunar date for that device-local civil date.
No example Monday, sunny weather or Ho Chi Minh City is used as a runtime default.

This is a local change on `codex/rarity-latest`, preserving the preceding rarity and
mobile app-link improvements. The original checkout is unchanged. Nothing has been
merged, pushed or deployed to the public Vercel site.

## Runtime behavior

| Information | Source and update behavior | Unavailable or invalid data |
| --- | --- | --- |
| Weekday, Gregorian date, time, timezone, period | Device clock; refresh every 15 seconds and on focus/resume | Depends on correct device clock settings, stated in the UI |
| Vietnamese lunar date | Local UTC+7 calendar rules for the displayed civil date, including leap months | Dates outside 2000–2035 are explicitly unsupported |
| Location | Permission-gated browser geolocation; BigDataCloud names the area | Never substitutes an IP estimate or saved city |
| Weather | Open-Meteo current regional model data for fresh device coordinates | Never substitutes hour-based guesses, null temperatures or stale snapshots |

The first location action explains that coordinates go to BigDataCloud and Open-Meteo.
The app stores only the opt-in preference, never coordinates or weather snapshots.
After opt-in, refresh occurs every 10 minutes while visible and on resume/online
when the last attempt was at least a minute ago. Manual refresh requests a new fix
with `maximumAge: 0`; the previous 30-second allowance could return the old location
immediately after moving in browser testing.

The current fix must have an accuracy of at most 5 km and an age of at most 10 minutes.
Weather must include a known WMO code, Celsius temperature, day/night flag and valid
timestamp no older than 45 minutes. Future timestamps beyond the small clock tolerances
are rejected. Ready weather shows its validity time and fetch time; ready location
shows the device-reported accuracy and fix time. Provider requests have a 12-second
deadline. Providers can fail independently. Disabling location, resetting settings,
or revoking browser permission clears located facts; late callbacks cannot restore them.

Weather is a regional meteorological model, not a phone sensor reading. This distinction
is visible under the source disclosure. Provider coverage and device positioning accuracy
still determine the practical accuracy. The app does not claim nearby restaurant
availability from a dish's origin province.

Suggestion filtering is explicit and uses actual device time plus weather when available.
Missing weather imposes no weather restriction. An empty intersection stays empty with
recovery guidance; the app no longer secretly widens the pool. Turning off the suggestion
filter broadens the list without changing the displayed date, location or weather.

## Sources and service constraints

- [Vietnamese lunar derivation and verification](reference-notes/vietnamese-lunar-calendar.md)
- [BigDataCloud client reverse-geocoding API](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api)
- [BigDataCloud client API fair-use policy](https://www.bigdatacloud.com/docs/article/fair-use-policy-for-free-client-side-reverse-geocoding-api): requests originate on the same device whose current permission-granted coordinates are supplied. No server proxy, batch lookup, saved-coordinate lookup or IP fallback is used.
- [Open-Meteo current conditions and WMO codes](https://open-meteo.com/en/docs)
- [Open-Meteo terms](https://open-meteo.com/en/terms): the public API is for non-commercial use within its service limits. Reassess the service plan if commercial usage is introduced.

## Validation on 2026-09-14

`pnpm verify` passed: typecheck, lint, **148 tests across 25 files**, 1,731-item catalog
validation, media budget, architecture boundaries, scope checks and production build.
The existing bundle-size warning remains: JS is 1,210.95 kB raw / 209.26 kB gzip.
No package or lockfile changes were needed for this feature.

`pnpm e2e` passed **78 tests** across desktop Chromium, mobile Chromium and reduced
motion. Nine device-context scenarios run in each project: legacy overrides ignored,
location/weather load and changed coordinates, reload after opt-in, denied permission,
partial provider failures, stale weather, permission revocation during an outstanding
response, automatic 10-minute refresh, midnight and a non-Vietnam device timezone.
Other tests cover the five crates, reveal modes, rarity, native-app target links and
game recovery. Provider responses and virtual coordinates are intercepted test fixtures
only; they do not reach the providers or enter the production bundle.

The in-app browser preview at `http://127.0.0.1:4187/` was inspected at 1280×900 and
390×844. The correct title and context region rendered, with no framework overlay,
no app console errors and no horizontal overflow. Expanding source details worked.
Turning suggestion filtering off increased the current main-meal pool from 476 to
672 while preserving the displayed facts; turning it back on restored 476.

A real Open-Meteo request at a public city reference coordinate confirmed the current
API's Unix timestamp, Celsius units and WMO response shape. It was a provider contract
check, not evidence of the user's location or weather. The end-to-end live geocoder
and GPS flow has not been verified on physical iPhone/Android hardware. Browser
emulation cannot establish real permission behavior, positioning accuracy or native
food-app launch success on those devices.

## Reproduce

Use the project's pinned Node 24 / pnpm toolchain:

```sh
pnpm verify
pnpm e2e
pnpm preview --host 127.0.0.1 --port 4187 --strictPort
```

E2E owns a separate strict preview port, 4188. To check a phone, use an HTTPS preview
served from this branch: phone localhost refers to the phone itself. On the phone,
select the explained device-location action and grant browser location permission.
Confirm the named area, accuracy, source timestamps and current conditions; test
denying/revoking permission as well. An ordinary HTTP LAN URL is not sufficient for
geolocation on mobile browsers.

TASK COMPLETED
