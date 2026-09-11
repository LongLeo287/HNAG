import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** CODE-037/RANK-030: reactive read of the OS/browser motion preference. */
function useOsReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return reduced;
}

/**
 * Combines the OS/browser setting with #HNAG's own in-app manual override (menu function
 * "Giảm chuyển động (thủ công)", user request 2026-09-11) — some users want the short reveal
 * without changing a system-wide accessibility setting just for one game. `override === null`
 * means "follow the OS", matching `DEFAULT_PREFERENCES.reducedMotionOverride`.
 */
export function useReducedMotion(override: boolean | null = null): boolean {
  const osValue = useOsReducedMotion();
  return override ?? osValue;
}
