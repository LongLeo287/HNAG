/**
 * #HNAG-original case-reel constants (DS-010/DS-022, RANK-024).
 * Independent of the reference project's timing/friction/tick-table values —
 * see docs/reference-notes/truanayangi-mechanics.md, item #6.
 */
export const REEL_LENGTH = 48;
export const WINNER_SLOT_INDEX = 40;

export const SPIN_DURATION_MIN_MS = 5500;
export const SPIN_DURATION_MAX_MS = 7500;
export const REDUCED_MOTION_DURATION_MS = 550;

export const FALLBACK_CARD_WIDTH_PX = 128;
export const FALLBACK_CARD_GAP_PX = 12;

export const TICK_GAIN_START_RATIO = 0.15; // no ticks during the first 15% (feels like wind-up)
