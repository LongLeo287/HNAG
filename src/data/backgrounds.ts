export interface Landmark {
  id: string;
  label: string;
  place: string;
}

/**
 * User-selectable backdrop scenes (per user request 2026-09-11: "nền sẽ được thay thế bằng các
 * địa danh ở Việt Nam, user có thể tùy chọn"). Rendered as original flat-illustration silhouettes
 * (src/components/ui/LandmarkScene.tsx) — no photography, so there is no licensing/rights
 * question (DS-011/DS-025) and no dependency on any external image host.
 */
export const LANDMARKS: Landmark[] = [
  { id: "ho-guom", label: "Hồ Gươm", place: "Hà Nội" },
  { id: "ben-thanh", label: "Chợ Bến Thành", place: "TP.HCM" },
  { id: "cau-rong", label: "Cầu Rồng", place: "Đà Nẵng" },
  { id: "ha-long", label: "Vịnh Hạ Long", place: "Quảng Ninh" },
  { id: "hoi-an", label: "Phố cổ Hội An", place: "Quảng Nam" },
  { id: "cho-noi", label: "Chợ nổi Cái Răng", place: "Cần Thơ" },
];

export const DEFAULT_LANDMARK_ID = "ho-guom";
export const LANDMARK_IDS = LANDMARKS.map((l) => l.id) as [string, ...string[]];
