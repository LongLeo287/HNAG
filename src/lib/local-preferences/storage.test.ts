import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PREFERENCES } from "./schema";
import { loadPreferences, resetPreferences, savePreferences } from "./storage";

beforeEach(() => {
  window.localStorage.clear();
});

describe("local preferences storage", () => {
  it("returns defaults when nothing is stored", () => {
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
  });

  it("round-trips a saved value", () => {
    const preferences = { ...DEFAULT_PREFERENCES, soundEnabled: true };
    expect(savePreferences(preferences)).toBe(true);
    expect(loadPreferences()).toEqual(preferences);
  });

  it("falls back to defaults on corrupt JSON instead of throwing", () => {
    window.localStorage.setItem("hnag:preferences", "{not json");
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
  });

  it("falls back to defaults when the schema no longer matches (e.g. old version)", () => {
    window.localStorage.setItem("hnag:preferences", JSON.stringify({ version: 0 }));
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
  });

  it("reset clears storage and returns defaults", () => {
    savePreferences({ ...DEFAULT_PREFERENCES, soundEnabled: true });
    expect(resetPreferences()).toEqual(DEFAULT_PREFERENCES);
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
  });

  it("STORAGE_UNAVAILABLE: save() degrades gracefully instead of throwing", () => {
    const spy = vi.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => savePreferences(DEFAULT_PREFERENCES)).not.toThrow();
    expect(savePreferences(DEFAULT_PREFERENCES)).toBe(false);
    spy.mockRestore();
  });
});
