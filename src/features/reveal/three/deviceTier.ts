export type GraphicsQualityPreference = "AUTO" | "MOBILE" | "DESKTOP";
export type ResolvedCrateTier = "mobile" | "desktop";

/**
 * Resolves whether to render the lightweight mobile procedural crate (Tier 1)
 * or the high-fidelity desktop cinematic crate (Tier 2).
 * If user preference is "MOBILE" or "DESKTOP", respects the explicit override.
 * If "AUTO", probes screen width, coarse pointer (touch screen), and hardware capabilities.
 */
export function resolveCrateTier(preference: GraphicsQualityPreference = "AUTO"): ResolvedCrateTier {
  if (preference === "MOBILE") return "mobile";
  if (preference === "DESKTOP") return "desktop";

  if (typeof window === "undefined") return "mobile";

  // Check if touch device or mobile screen width
  const isTouch = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const isNarrowScreen = window.innerWidth < 768;

  if (isTouch || isNarrowScreen) {
    return "mobile";
  }

  return "desktop";
}
