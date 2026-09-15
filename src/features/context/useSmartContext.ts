import { useCallback, useEffect, useMemo, useState } from "react";
import { loadPreferences, savePreferences } from "@/lib/local-preferences";
import { detectDayType, detectMealTime } from "./contextEngine";
import { getDevicePosition, loadDevicePlace, loadDeviceWeather, POSITION_MAX_AGE_MS, WEATHER_MAX_AGE_MS,
  type DataState, type DevicePlace, type DeviceWeather } from "./deviceServices";
import type { ResolvedContext } from "./types";

/** The clock works offline. Location/weather are opt-in, independent, and never invented. */
export function useSmartContext() {
  const [enabled, setEnabled] = useState(() => loadPreferences().contextDeviceEnabled);
  const [now, setNow] = useState(() => new Date());
  const [place, setPlace] = useState<DataState<DevicePlace>>({ status: "idle" });
  const [weather, setWeather] = useState<DataState<DeviceWeather>>({ status: "idle" });
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const resume = () => { if (document.visibilityState === "visible") tick(); };
    const interval = window.setInterval(tick, 15_000);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", tick);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", resume); window.removeEventListener("focus", tick); };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let inFlight = false;
    let lastAttempt = 0;
    let controller: AbortController | undefined;
    let permission: PermissionStatus | undefined;
    let permissionVersion = 0;
    const permissionChanged = () => {
      if (!active || permission?.state === "granted") return;
      permissionVersion += 1;
      controller?.abort();
      setPlace({ status: "error", message: "Quyền vị trí không còn được cấp. Hãy cho phép lại trong trình duyệt rồi cập nhật." });
      setWeather({ status: "error", message: "Đã ngừng dùng vị trí; chưa có dữ liệu thời tiết mới." });
    };
    if (navigator.permissions?.query) {
      void navigator.permissions.query({ name: "geolocation" }).then((status) => {
        if (!active) return;
        permission = status;
        permission.addEventListener("change", permissionChanged);
      }).catch(() => { /* Safari versions without this permission query still use the GPS callback. */ });
    }
    async function refresh() {
      if (inFlight || !active) return;
      inFlight = true;
      const requestPermissionVersion = permissionVersion;
      const canUseResponse = () => active && requestPermissionVersion === permissionVersion;
      lastAttempt = Date.now();
      setPlace({ status: "loading" });
      setWeather({ status: "loading" });
      try {
        const position = await getDevicePosition();
        if (!canUseResponse()) return;
        controller = new AbortController();
        const signal = controller.signal;
        const timeout = window.setTimeout(() => controller?.abort(), 12_000);
        try {
          await Promise.all([
            loadDevicePlace(position, signal).then((data) => { if (canUseResponse()) setPlace({ status: "ready", data }); })
              .catch(() => { if (canUseResponse()) setPlace({ status: "error", message: "Đã định vị nhưng chưa lấy được tên khu vực. Vui lòng thử lại." }); }),
            loadDeviceWeather(position, signal).then((data) => { if (canUseResponse()) setWeather({ status: "ready", data }); })
              .catch(() => { if (canUseResponse()) setWeather({ status: "error", message: "Chưa lấy được thời tiết hiện tại. Hãy kiểm tra mạng và ngày giờ thiết bị rồi thử lại." }); }),
          ]);
        } finally { clearTimeout(timeout); }
      } catch (error) {
        if (canUseResponse()) {
          setPlace({ status: "error", message: error instanceof Error ? error.message : "Chưa xác định được vị trí." });
          setWeather({ status: "error", message: "Chưa có vị trí thiết bị để lấy thời tiết." });
        }
      } finally { inFlight = false; }
    }
    // React StrictMode cleans up its first setup before this microtask runs.
    void Promise.resolve().then(() => { if (active) void refresh(); });
    const interval = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 10 * 60_000);
    const resume = () => { if (document.visibilityState === "visible" && Date.now() - lastAttempt >= 60_000) void refresh(); };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", resume);
    window.addEventListener("online", resume);
    return () => { active = false; controller?.abort(); clearInterval(interval);
      permission?.removeEventListener("change", permissionChanged);
      document.removeEventListener("visibilitychange", resume); window.removeEventListener("focus", resume); window.removeEventListener("online", resume); };
  }, [enabled, refreshVersion]);

  const enableLocation = useCallback(() => {
    savePreferences({ ...loadPreferences(), contextDeviceEnabled: true });
    setEnabled(true);
    setRefreshVersion((value) => value + 1);
  }, []);
  const disableLocation = useCallback(() => {
    savePreferences({ ...loadPreferences(), contextDeviceEnabled: false });
    setEnabled(false); setPlace({ status: "idle" }); setWeather({ status: "idle" });
  }, []);
  const refresh = useCallback(() => { setNow(new Date()); setRefreshVersion((value) => value + 1); }, []);

  const currentPlace: DataState<DevicePlace> = place.status === "ready" &&
    (now.getTime() - place.data.position.timestamp > POSITION_MAX_AGE_MS || place.data.position.timestamp > now.getTime() + 60_000)
    ? { status: "error", message: "Vị trí đã cũ. Đang chờ lần định vị mới; bạn có thể cập nhật ngay." } : place;
  const currentWeather: DataState<DeviceWeather> = weather.status === "ready" &&
    (now.getTime() - weather.data.validAt > WEATHER_MAX_AGE_MS || weather.data.validAt > now.getTime() + 5 * 60_000)
    ? { status: "error", message: "Dữ liệu thời tiết đã cũ. Hãy cập nhật để lấy thông tin mới." } : weather;
  const suitability = enabled && currentWeather.status === "ready" ? currentWeather.data.suitability : "UNKNOWN";
  const resolvedContext = useMemo<ResolvedContext>(() => ({ mealTime: detectMealTime(now),
    dayType: detectDayType(now), weather: suitability,
    // Catalog province is dish origin, not verified restaurant availability at the device.
    location: "ALL", isAutoDetected: true }), [now, suitability]);
  return { now, enabled, place: currentPlace, weather: currentWeather, resolvedContext, enableLocation, disableLocation, refresh };
}
