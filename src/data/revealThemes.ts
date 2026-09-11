export interface RevealThemeMeta {
  id: string;
  label: string;
  blurb: string;
  glyph: string;
}

/**
 * FEAT-052/UI-052: the reveal-theme registry. Every theme in here renders against the exact same
 * `FrozenSelection` contract (RANK-021/CODE-019) — only the presentation choreography differs.
 * "case-reel" is the M1 signature theme; the rest are user-selectable alternates added
 * 2026-09-11 per user request, each an original #HNAG implementation (no genre is exclusively
 * ownable — spinning wheels, slot reels, card flips and blind-box unboxings are generic game
 * conventions used across many unrelated products, not something copied from one specific site).
 */
export const REVEAL_THEMES: RevealThemeMeta[] = [
  { id: "case-reel", label: "Case Reel", blurb: "Dải cuộn ngang, dừng đúng ô giữa", glyph: "🎰" },
  { id: "blindbox", label: "Blindbox", blurb: "Hộp bí ẩn rung lắc rồi bật nắp", glyph: "📦" },
  { id: "wheel", label: "Vòng quay", blurb: "Vòng quay may mắn, kim chỉ ở trên", glyph: "🎡" },
  { id: "slot-machine", label: "Slot Machine", blurb: "3 cột quay dừng lần lượt", glyph: "🎲" },
  { id: "card-flip", label: "Lật bài", blurb: "Nhanh gọn — lật một lần lộ kết quả", glyph: "🃏" },
];

export const DEFAULT_REVEAL_THEME_ID = "case-reel";
export const REVEAL_THEME_IDS = REVEAL_THEMES.map((t) => t.id) as [string, ...string[]];
