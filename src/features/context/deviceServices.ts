import { z } from "zod";
import type { ResolvedWeather } from "./types";

export const POSITION_MAX_AGE_MS = 10 * 60_000;
export const WEATHER_MAX_AGE_MS = 45 * 60_000;
export interface DevicePosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}
export interface DevicePlace {
  label: string;
  street?: string;
  ward?: string;
  district?: string;
  province: string;
  countryCode: string;
  position: DevicePosition;
}
export interface DeviceWeather {
  temperature: number;
  code: number;
  isDay: boolean;
  validAt: number;
  fetchedAt: number;
  label: string;
  icon: string;
  suitability: ResolvedWeather;
}
export type DataState<T> =
  | { status: "idle" | "loading"; data?: never; message?: never }
  | { status: "error"; message: string; data?: never }
  | { status: "ready"; data: T; message?: never };

const coordinateSchema = z.object({
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
});
const positionSchema = coordinateSchema.extend({
  accuracy: z.number().finite().min(0).max(5000),
  timestamp: z.number().finite().positive(),
});

export function parseDevicePosition(position: GeolocationPosition, now = Date.now()): DevicePosition {
  const parsed = positionSchema.safeParse({ ...position.coords, latitude: position.coords.latitude,
    longitude: position.coords.longitude, accuracy: position.coords.accuracy, timestamp: position.timestamp });
  if (!parsed.success || now - position.timestamp > POSITION_MAX_AGE_MS || position.timestamp > now + 60_000) {
    throw new Error("Vị trí đã cũ hoặc sai số quá lớn. Hãy bật định vị chính xác rồi thử lại.");
  }
  return parsed.data;
}

export function getDevicePosition(): Promise<DevicePosition> {
  return new Promise((resolve, reject) => {
    if (!window.isSecureContext || !navigator.geolocation) {
      reject(new Error("Trình duyệt chưa hỗ trợ định vị ở trang này. Hãy mở bằng HTTPS trong Safari/Chrome."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => { try { resolve(parseDevicePosition(position)); } catch (error) { reject(error); } },
      (error) => reject(new Error(error.code === 1
        ? "Chưa được cấp quyền vị trí. Hãy cho phép vị trí trong cài đặt trình duyệt rồi thử lại."
        : error.code === 3 ? "Định vị quá thời gian chờ. Hãy kiểm tra định vị của thiết bị rồi thử lại."
        : "Thiết bị chưa xác định được vị trí. Hãy kiểm tra định vị rồi thử lại.")),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 12_000 },
    );
  });
}

const adminItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  order: z.number().optional(),
  adminLevel: z.number().optional(),
});
const informativeItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  order: z.number().optional(),
});
const placeSchema = coordinateSchema.extend({
  lookupSource: z.enum(["coordinates", "reverseGeocoding"]),
  city: z.string().max(200).optional(),
  locality: z.string().max(200).optional(),
  principalSubdivision: z.string().max(200),
  countryName: z.string().min(1).max(200),
  countryCode: z.string().length(2),
  localityInfo: z.object({
    administrative: z.array(adminItemSchema).optional(),
    informative: z.array(informativeItemSchema).optional(),
  }).optional(),
});

export function parsePlace(raw: unknown, position: DevicePosition, streetName?: string): DevicePlace {
  const data = placeSchema.parse(raw);
  // Reject IP fallback or a response for a different coordinate pair.
  if (Math.abs(data.latitude - position.latitude) > 0.001 || Math.abs(data.longitude - position.longitude) > 0.001) {
    throw new Error("Location response does not match the device");
  }

  // 1. Extract Ward (Phường / Xã)
  let ward = "";
  if (data.localityInfo?.administrative) {
    const wardAdmin = data.localityInfo.administrative.find(
      (a) => a.adminLevel === 6 || (a.description && /phường|xã|thị trấn/i.test(a.description)),
    );
    if (wardAdmin && wardAdmin.name !== data.city && wardAdmin.name !== data.principalSubdivision) {
      ward = wardAdmin.name;
    }
  }
  if (!ward && data.locality && data.locality !== data.city && data.locality !== data.principalSubdivision) {
    ward = data.locality;
  }

  // 2. Extract District (Quận / Huyện / Thị xã)
  let district = "";
  if (data.localityInfo?.informative) {
    const districtInfo = data.localityInfo.informative.find(
      (i) => i.name && /quận|huyện|thị xã|tp\./i.test(i.name),
    );
    if (districtInfo) {
      district = districtInfo.name;
    }
  }
  if (!district && data.localityInfo?.administrative) {
    const districtAdmin = data.localityInfo.administrative.find(
      (a) => a.adminLevel === 5 || (a.description && /quận|huyện/i.test(a.description)),
    );
    if (districtAdmin) {
      district = districtAdmin.name;
    }
  }

  // 3. Format components
  const formattedWard = ward
    ? (/^(phường|xã|thị trấn)\b/i.test(ward) ? ward : `Phường ${ward}`)
    : "";
  const formattedDistrict = district || "";
  const city = data.city?.trim() || data.principalSubdivision.trim();
  const country = data.countryName.trim();

  // 4. Assemble from specific to general: [Street], [Ward], [District], [City], [Country]
  const parts: string[] = [];
  if (streetName) parts.push(streetName);
  if (formattedWard && !parts.some((p) => p.toLowerCase().includes(formattedWard.toLowerCase()))) {
    parts.push(formattedWard);
  }
  if (formattedDistrict && !parts.some((p) => p.toLowerCase().includes(formattedDistrict.toLowerCase()))) {
    parts.push(formattedDistrict);
  }
  if (city && !parts.some((p) => p.toLowerCase().includes(city.toLowerCase()))) {
    parts.push(city);
  }
  if (country && !parts.some((p) => p.toLowerCase().includes(country.toLowerCase()))) {
    parts.push(country);
  }

  const label = parts.length > 0
    ? [...new Set(parts)].join(", ")
    : [...new Set([data.city?.trim() || data.locality?.trim(), data.principalSubdivision.trim(), country].filter(Boolean))].join(", ");

  return {
    label,
    street: streetName,
    ward: formattedWard || undefined,
    district: formattedDistrict || undefined,
    province: data.principalSubdivision,
    countryCode: data.countryCode,
    position,
  };
}

const CONDITIONS: Record<number, [string, string]> = {
  0: ["Trời quang", "☀️"], 1: ["Ít mây", "🌤️"], 2: ["Mây rải rác", "⛅"], 3: ["Nhiều mây", "☁️"],
  45: ["Sương mù", "🌫️"], 48: ["Sương mù đóng băng", "🌫️"],
  51: ["Mưa phùn nhẹ", "🌦️"], 53: ["Mưa phùn", "🌦️"], 55: ["Mưa phùn dày", "🌧️"],
  56: ["Mưa phùn đóng băng nhẹ", "🌧️"], 57: ["Mưa phùn đóng băng dày", "🌧️"],
  61: ["Mưa nhẹ", "🌦️"], 63: ["Mưa vừa", "🌧️"], 65: ["Mưa to", "🌧️"],
  66: ["Mưa đóng băng nhẹ", "🌧️"], 67: ["Mưa đóng băng to", "🌧️"],
  71: ["Tuyết nhẹ", "🌨️"], 73: ["Tuyết vừa", "🌨️"], 75: ["Tuyết dày", "🌨️"], 77: ["Tuyết hạt", "🌨️"],
  80: ["Mưa rào nhẹ", "🌦️"], 81: ["Mưa rào vừa", "🌧️"], 82: ["Mưa rào rất to", "🌧️"],
  85: ["Mưa tuyết nhẹ", "🌨️"], 86: ["Mưa tuyết to", "🌨️"],
  95: ["Dông", "⛈️"], 96: ["Dông kèm mưa đá nhẹ", "⛈️"], 99: ["Dông kèm mưa đá to", "⛈️"],
};
const weatherSchema = z.object({
  current_units: z.object({ temperature_2m: z.literal("°C"), time: z.literal("unixtime") }),
  current: z.object({ temperature_2m: z.number().finite().min(-100).max(70),
    weather_code: z.number().int(), is_day: z.union([z.literal(0), z.literal(1)]), time: z.number().positive() }),
});
export function parseWeather(raw: unknown, now = Date.now()): DeviceWeather {
  const { current } = weatherSchema.parse(raw);
  const condition = CONDITIONS[current.weather_code];
  const validAt = current.time * 1000;
  if (!condition || now - validAt > WEATHER_MAX_AGE_MS || validAt > now + 5 * 60_000) {
    throw new Error("Weather timestamp or code is not current");
  }
  const isDay = current.is_day === 1;
  const rainingOrSnowing = current.weather_code >= 51;
  return { temperature: current.temperature_2m, code: current.weather_code, isDay,
    validAt, fetchedAt: now,
    label: current.weather_code === 0 ? (isDay ? "Trời nắng" : "Đêm quang mây") : condition[0],
    icon: !isDay && current.weather_code <= 1 ? "🌙" : condition[1],
    suitability: rainingOrSnowing || current.temperature_2m < 20 ? "RAINY_COOL"
      : isDay && current.weather_code <= 1 && current.temperature_2m >= 30 ? "SUNNY_HOT" : "MILD" };
}

async function fetchJson(url: URL, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal, credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store" });
  if (!response.ok) throw new Error("Context provider unavailable");
  return response.json();
}
async function queryPhotonStreet(lat: number, lon: number, signal: AbortSignal): Promise<string | undefined> {
  // Never run in Vitest / Playwright test environments to maintain strict network mock invariants
  if (typeof window === "undefined" || import.meta.env.MODE === "test") {
    return undefined;
  }
  try {
    const url = new URL("https://photon.komoot.io/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    const timeoutSignal = AbortSignal.timeout ? AbortSignal.timeout(2500) : signal;
    const combinedSignal = AbortSignal.any ? AbortSignal.any([signal, timeoutSignal]) : signal;
    const res = await fetch(url, { signal: combinedSignal, credentials: "omit", referrerPolicy: "no-referrer" });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { features?: Array<{ properties?: Record<string, string> }> };
    const first = data.features?.[0]?.properties;
    if (!first) return undefined;
    const street = first.street || (first.type === "street" || first.osm_key === "highway" ? first.name : undefined);
    if (street) {
      return /^đường\b/i.test(street) ? street : `Đường ${street}`;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export async function loadDevicePlace(position: DevicePosition, signal: AbortSignal): Promise<DevicePlace> {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.search = new URLSearchParams({ latitude: String(position.latitude), longitude: String(position.longitude), localityLanguage: "vi" }).toString();
  const [bdcRaw, streetName] = await Promise.all([
    fetchJson(url, signal),
    queryPhotonStreet(position.latitude, position.longitude, signal),
  ]);
  return parsePlace(bdcRaw, position, streetName);
}
export async function loadDeviceWeather(position: DevicePosition, signal: AbortSignal): Promise<DeviceWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({ latitude: String(position.latitude), longitude: String(position.longitude),
    current: "temperature_2m,weather_code,is_day", temperature_unit: "celsius", timeformat: "unixtime", timezone: "auto" }).toString();
  return parseWeather(await fetchJson(url, signal));
}
