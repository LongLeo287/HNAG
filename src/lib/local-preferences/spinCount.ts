// Keep the existing key so previous local counts remain available after the fix.
const KEY = "hnag_spin_count";

export function loadSpinCount(): number {
  try {
    const value = Number(window.localStorage.getItem(KEY));
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveSpinCount(value: number): boolean {
  try {
    window.localStorage.setItem(KEY, String(value));
    return true;
  } catch {
    return false;
  }
}
