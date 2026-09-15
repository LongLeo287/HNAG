# Device context correction

The user requires device-derived location, weather, calendar date, weekday, time and
Vietnamese lunar date. This explicitly supersedes the M0/M1 prohibition on geolocation
and read-only weather requests, only within `src/features/context`.

- Remove hour-based weather guesses and ignore legacy manual context overrides.
- Read the device clock and timezone, refreshing every 15 seconds and on page resume.
- Calculate the Vietnamese lunar date locally from the actual device calendar date.
- Obtain device coordinates only after an explained location opt-in and browser permission.
  Remember only this preference, never coordinates or weather snapshots in local storage.
- Use BigDataCloud's client-only reverse geocoder and Open-Meteo current weather. Never
  use IP fallback, an example city, cached stale conditions or a hardcoded sunny default.
- Show source, update time, positioning accuracy and independent failure states. Weather
  is regional model data, not a sensor reading from the phone.
- Keep location as device context, not evidence that a dish's origin province identifies
  a nearby restaurant. Apply only actual available weather to meal suggestions.
- Test denial, timeout, malformed/stale responses, partial service failure, midnight,
  timezone differences, lunar boundaries, refresh and the existing game/app-link loop.

Test-only fixtures emulate device/provider contracts without contacting providers with
invented device coordinates. They never ship as a runtime fallback.
