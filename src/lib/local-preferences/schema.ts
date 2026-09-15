import { z } from "zod";
import { CandidateItemSchema } from "@/data/catalog";
import { DEFAULT_LANDMARK_ID, LANDMARK_IDS } from "@/data/backgrounds";
import { DEFAULT_REVEAL_THEME_ID, REVEAL_THEME_IDS } from "@/data/revealThemes";

// RS-054/FEAT-051: versioned local preferences. Bump SCHEMA_VERSION and add a migration
// in storage.ts whenever this shape changes — never silently drop a user's saved pool.
export const SCHEMA_VERSION = 1;

export const FiltersSchema = z.object({
  kind: z.enum(["FOOD", "DRINK"]),
  categoryIds: z.array(z.string()),
  vegetarianOnly: z.boolean(),
  budgetMode: z.enum(["NONE", "HARD_MAX", "TARGET"]),
  maxBudgetVnd: z.number().int().positive().optional(),
  targetBudgetVnd: z.number().int().positive().optional(),
});
export type PersistedFilters = z.infer<typeof FiltersSchema>;

export const PreferencesSchema = z.object({
  version: z.literal(SCHEMA_VERSION),
  soundEnabled: z.boolean().default(true),
  filters: FiltersSchema,
  disabledBuiltInIds: z.array(z.string()),
  customItems: z.array(CandidateItemSchema),
  selectedCrateId: z.enum(["crate_food", "crate_drink", "crate_alcohol", "crate_snack", "crate_drinking", "crate_vegetarian"]).optional(),
  // Purely cosmetic backdrop choice (user request 2026-09-11) — additive/defaulted field, so
  // preferences saved before this existed still parse without a version bump.
  backgroundId: z.enum(LANDMARK_IDS).default(DEFAULT_LANDMARK_ID),
  // Which RevealTheme (case-reel/blindbox/wheel/slot-machine/card-flip) OPEN uses — additive.
  revealThemeId: z.enum(REVEAL_THEME_IDS).default(DEFAULT_REVEAL_THEME_ID),
  // Follow OS by default; explicit in-app choices may override it.
  reducedMotionOverride: z.boolean().nullable().default(null),
  // Device context consent only; coordinates and weather are never persisted.
  contextDeviceEnabled: z.boolean().default(false),
  // Legacy manual fields remain readable for migration, but no longer drive live context.
  contextLocation: z.string().default("ALL"),
  contextWeather: z.enum(["AUTO", "SUNNY_HOT", "RAINY_COOL", "MILD"]).default("AUTO"),
  contextMealTime: z.enum(["AUTO", "BREAKFAST", "LUNCH", "AFTERNOON", "DINNER", "LATE_NIGHT", "ALL"]).default("AUTO"),
  contextDayType: z.enum(["AUTO", "WEEKDAY", "WEEKEND"]).default("AUTO"),
  contextAutoSyncTime: z.boolean().default(true),
  // Odds settings ("Phần tỉ lệ thì có setting riêng")
  oddsPreset: z.enum(["STANDARD", "BALANCED", "PREMIUM", "EQUAL"]).default("STANDARD"),
  specialtyBoost: z.boolean().default(false),
  // 3D Crate graphics tier: AUTO (device-adaptive), MOBILE (lightweight procedural), DESKTOP (high-fidelity cinematic)
  graphicsQuality: z.enum(["AUTO", "MOBILE", "DESKTOP"]).default("AUTO"),
});
export type Preferences = z.infer<typeof PreferencesSchema>;

export const DEFAULT_PREFERENCES: Preferences = {
  version: SCHEMA_VERSION,
  // User request 2026-09-15: "các hiệu ứng trên HNAG đều mặc định mở" -> Sound effects default ON
  soundEnabled: true,
  filters: {
    kind: "FOOD",
    categoryIds: [],
    vegetarianOnly: false,
    budgetMode: "NONE",
  },
  disabledBuiltInIds: [],
  customItems: [],
  backgroundId: DEFAULT_LANDMARK_ID,
  revealThemeId: DEFAULT_REVEAL_THEME_ID,
  reducedMotionOverride: null,
  contextDeviceEnabled: false,
  contextLocation: "ALL",
  contextWeather: "AUTO",
  contextMealTime: "AUTO",
  contextDayType: "AUTO",
  contextAutoSyncTime: true,
  oddsPreset: "STANDARD",
  specialtyBoost: false,
  graphicsQuality: "AUTO",
};
