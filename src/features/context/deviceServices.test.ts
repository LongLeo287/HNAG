import { describe, expect, it, vi, afterEach } from "vitest";
import { getDevicePosition, parseDevicePosition, parsePlace, parseWeather, loadDeviceWeather, loadDevicePlace, WEATHER_MAX_AGE_MS } from "./deviceServices";

// Contract fixtures only. No coordinates or provider responses are injected into production.
const now = Date.parse("2026-09-14T01:05:00Z");
const position = { latitude: 10.77, longitude: 106.7, accuracy: 15, timestamp: now };
const place = { latitude: 10.77, longitude: 106.7, lookupSource: "reverseGeocoding", city: "Hồ Chí Minh",
  principalSubdivision: "Thành phố Hồ Chí Minh", countryName: "Việt Nam", countryCode: "VN" };
const weather = { current_units: { temperature_2m: "°C", time: "unixtime" }, current: {
  temperature_2m: 31.5, weather_code: 0, is_day: 1, time: Math.floor(now / 1000) - 300,
} };
afterEach(() => vi.unstubAllGlobals());

describe("device/provider validation", () => {
  it.each([[1, "cấp quyền"], [2, "chưa xác định"], [3, "quá thời gian"]])("reports geolocation failure %s without using defaults", async (code, message) => {
    vi.stubGlobal("isSecureContext", true);
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => error({ code } as GeolocationPositionError) } });
    await expect(getDevicePosition()).rejects.toThrow(message as string);
  });
  it("preserves real WMO conditions instead of classifying by device hour", () => {
    expect(parseWeather(weather, now)).toMatchObject({ label: "Trời nắng", temperature: 31.5, suitability: "SUNNY_HOT" });
    const rainy = parseWeather({ ...weather, current: { ...weather.current, weather_code: 63, temperature_2m: 28 } }, now);
    expect(rainy).toMatchObject({ label: "Mưa vừa", temperature: 28, suitability: "RAINY_COOL" });
    expect(parseWeather({ ...weather, current: { ...weather.current, weather_code: 3 } }, now).label).toBe("Nhiều mây");
    expect(parseWeather({ ...weather, current: { ...weather.current, is_day: 0 } }, now)).toMatchObject({ label: "Đêm quang mây", icon: "🌙", suitability: "MILD" });
  });
  it("rejects missing values, unsupported codes, wrong units and stale/future timestamps", () => {
    for (const patch of [{ temperature_2m: null }, { temperature_2m: NaN }, { weather_code: 999 }, { is_day: 2 },
      { time: (now - WEATHER_MAX_AGE_MS - 1) / 1000 }, { time: (now + 10 * 60_000) / 1000 }]) {
      expect(() => parseWeather({ ...weather, current: { ...weather.current, ...patch } }, now)).toThrow();
    }
    expect(() => parseWeather({ ...weather, current_units: { temperature_2m: "°F", time: "unixtime" } }, now)).toThrow();
    expect(() => parseWeather({}, now)).toThrow();
  });
  it("accepts current device coordinates including zero and rejects stale/imprecise fixes", () => {
    const fix = { coords: { ...position, latitude: 0, longitude: 0 }, timestamp: now } as unknown as GeolocationPosition;
    expect(parseDevicePosition(fix, now)).toMatchObject({ latitude: 0, longitude: 0 });
    expect(() => parseDevicePosition({ ...fix, timestamp: now - 11 * 60_000 }, now)).toThrow();
    expect(() => parseDevicePosition({ ...fix, coords: { ...fix.coords, accuracy: 8000 } }, now)).toThrow();
  });
  it("rejects IP fallback and results for another location", () => {
    expect(parsePlace(place, position).label).toContain("Hồ Chí Minh");
    expect(() => parsePlace({ ...place, lookupSource: "ipGeolocation" }, position)).toThrow();
    expect(() => parsePlace({ ...place, latitude: 21 }, position)).toThrow();
    expect(parsePlace({ ...place, lookupSource: "coordinates" }, position).countryCode).toBe("VN");
    expect(() => parsePlace({}, position)).toThrow();
  });
  it("extracts street, ward, and district for high-accuracy location labeling", () => {
    const detailedPlace = {
      ...place,
      locality: "Tân Bình",
      localityInfo: {
        administrative: [
          { name: "Việt Nam", adminLevel: 2 },
          { name: "Thành phố Hồ Chí Minh", adminLevel: 4 },
          { name: "Phường Tây Thạnh", adminLevel: 6 },
        ],
        informative: [
          { name: "Quận Tân Phú" },
        ],
      },
    };
    const parsed = parsePlace(detailedPlace, position, "Đường Chế Lan Viên");
    expect(parsed.street).toBe("Đường Chế Lan Viên");
    expect(parsed.ward).toBe("Phường Tây Thạnh");
    expect(parsed.district).toBe("Quận Tân Phú");
    expect(parsed.label).toContain("Đường Chế Lan Viên");
    expect(parsed.label).toContain("Phường Tây Thạnh");
    expect(parsed.label).toContain("Quận Tân Phú");
  });
  it("builds both requests from the supplied device position, with no IP-only call", async () => {
    const fetchMock = vi.fn(async (url: URL) => ({ ok: true, json: async () => url.hostname.includes("bigdatacloud")
      ? { ...place, latitude: 21.0285, longitude: 105.8542 }
      : { ...weather, current: { ...weather.current, time: Math.floor(Date.now() / 1000) } } }));
    vi.stubGlobal("fetch", fetchMock);
    const currentPosition = { ...position, latitude: 21.0285, longitude: 105.8542 };
    const signal = new AbortController().signal;
    await Promise.all([loadDevicePlace(currentPosition, signal), loadDeviceWeather(currentPosition, signal)]);
    for (const [url] of fetchMock.mock.calls) {
      expect(url.searchParams.get("latitude")).toBe("21.0285");
      expect(url.searchParams.get("longitude")).toBe("105.8542");
    }
  });
});
