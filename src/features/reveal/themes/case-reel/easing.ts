/**
 * Exponential ease-out, normalized so easeSpin(0) === 0 and easeSpin(1) === 1 exactly —
 * the winner must land precisely under the selector, never a fraction of a pixel off.
 * A different mathematical family from the reference project's iterative bezier search
 * (docs/reference-notes/truanayangi-mechanics.md, item #6).
 */
const EXPO_STEEPNESS = 10;

export function easeSpin(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped === 0) return 0;
  const raw = 1 - 2 ** (-EXPO_STEEPNESS * clamped);
  const rawAtOne = 1 - 2 ** -EXPO_STEEPNESS;
  return raw / rawAtOne;
}
