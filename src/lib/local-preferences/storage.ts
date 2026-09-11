import { DEFAULT_PREFERENCES, PreferencesSchema, type Preferences } from "./schema";

const STORAGE_KEY = "hnag:preferences";

/**
 * RS-054/CODE-011: the only module allowed to touch localStorage for game preferences.
 * Every read is validated; anything unavailable/corrupt/outdated falls back to defaults
 * instead of throwing — a broken preferences blob must never break the game.
 */
export function loadPreferences(): Preferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;

    const parsed = PreferencesSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return DEFAULT_PREFERENCES;
    return parsed.data;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: Preferences): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch {
    // STORAGE_UNAVAILABLE: quota exceeded, private mode, etc. — the game keeps running in-memory.
    return false;
  }
}

export function resetPreferences(): Preferences {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — reset() must never throw.
  }
  return DEFAULT_PREFERENCES;
}
