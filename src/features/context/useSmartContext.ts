import { useCallback, useEffect, useMemo, useState } from "react";
import { loadPreferences, savePreferences } from "@/lib/local-preferences";
import { resolveContext } from "./contextEngine";
import type {
  ContextFilters,
  DayType,
  MealTime,
  ResolvedContext,
  WeatherCondition,
} from "./types";

export function useSmartContext() {
  const [filters, setFiltersState] = useState<ContextFilters>(() => {
    const prefs = loadPreferences();
    return {
      mealTime: (prefs.contextMealTime as MealTime) || "AUTO",
      weather: (prefs.contextWeather as WeatherCondition) || "AUTO",
      dayType: (prefs.contextDayType as DayType) || "AUTO",
      location: prefs.contextLocation || "ALL",
      autoSyncTime: prefs.contextAutoSyncTime ?? true,
    };
  });

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Minute ticker to keep meal time synced with reality when autoSyncTime is enabled
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const persistFilters = useCallback((next: ContextFilters) => {
    const currentPrefs = loadPreferences();
    savePreferences({
      ...currentPrefs,
      contextMealTime: next.mealTime,
      contextWeather: next.weather,
      contextDayType: next.dayType,
      contextLocation: next.location,
      contextAutoSyncTime: next.autoSyncTime,
    });
  }, []);

  const updateFilters = useCallback(
    (patch: Partial<ContextFilters>) => {
      setFiltersState((prev) => {
        const next: ContextFilters = { ...prev, ...patch };
        persistFilters(next);
        return next;
      });
    },
    [persistFilters],
  );

  const setMealTime = useCallback((mealTime: MealTime) => updateFilters({ mealTime }), [updateFilters]);
  const setWeather = useCallback((weather: WeatherCondition) => updateFilters({ weather }), [updateFilters]);
  const setDayType = useCallback((dayType: DayType) => updateFilters({ dayType }), [updateFilters]);
  const setLocation = useCallback((location: string) => updateFilters({ location }), [updateFilters]);
  const setAutoSyncTime = useCallback((autoSyncTime: boolean) => updateFilters({ autoSyncTime }), [updateFilters]);

  const resetContext = useCallback(() => {
    const reset: ContextFilters = {
      mealTime: "AUTO",
      weather: "AUTO",
      dayType: "AUTO",
      location: "ALL",
      autoSyncTime: true,
    };
    setFiltersState(reset);
    persistFilters(reset);
  }, [persistFilters]);

  const resolvedContext: ResolvedContext = useMemo(
    () => resolveContext(filters, currentTime),
    [filters, currentTime],
  );

  return {
    filters,
    resolvedContext,
    setMealTime,
    setWeather,
    setDayType,
    setLocation,
    setAutoSyncTime,
    resetContext,
  };
}
