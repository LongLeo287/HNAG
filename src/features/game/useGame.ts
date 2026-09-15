import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import { bundledItemsForKind, type CandidateItem } from "@/data/catalog";
import { combinePool, type PoolProfile, type CustomItemInput } from "@/features/pool";
import { addCustomItem, createCustomItem, removeCustomItem, toggleBuiltIn } from "@/features/pool";
import {
  applyHardFilters,
  createCryptoUniformRng,
  runRandomizer,
  type RandomizerContext,
  type OddsPreset,
} from "@/features/randomizer/domain";
import { loadPreferences, resetPreferences, savePreferences } from "@/lib/local-preferences";
import { loadSpinCount, saveSpinCount } from "@/lib/local-preferences/spinCount";
import {
  INITIAL_GAME_STATE,
  acceptResult,
  applyRandomizerResult,
  landReel,
  updateDraftFilters,
} from "./gameMachine";
import type { GameState } from "./types";

type Action =
  | { type: "SET_FILTERS"; patch: Partial<GameState["draftFilters"]> }
  | { type: "RESULT"; result: ReturnType<typeof runRandomizer> }
  | { type: "LANDED" }
  | { type: "ACCEPT" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_FILTERS":
      return updateDraftFilters(state, action.patch);
    case "RESULT":
      return applyRandomizerResult(state, action.result);
    case "LANDED":
      return landReel(state);
    case "ACCEPT":
      return acceptResult(state);
    default:
      return state;
  }
}

// FEAT-051/RS-054: hydrate synchronously from versioned local storage via lazy initializers —
// no mount effect, so there is no extra render pass and nothing to cascade.
function initialGameState(): GameState {
  return { ...INITIAL_GAME_STATE, draftFilters: loadPreferences().filters };
}

export function useGame() {
  const [game, dispatch] = useReducer(reducer, undefined, initialGameState);
  const [profile, setProfile] = useState<PoolProfile>(() => {
    const preferences = loadPreferences();
    return { disabledBuiltInIds: preferences.disabledBuiltInIds, customItems: preferences.customItems };
  });
  const [soundEnabled, setSoundEnabled] = useState(() => loadPreferences().soundEnabled);
  const [backgroundId, setBackgroundId] = useState(() => loadPreferences().backgroundId);
  const [revealThemeId, setRevealThemeIdState] = useState(() => loadPreferences().revealThemeId);
  const [reducedMotionOverride, setReducedMotionOverrideState] = useState(
    () => loadPreferences().reducedMotionOverride,
  );
  const [oddsPreset, setOddsPresetState] = useState<OddsPreset>(
    () => loadPreferences().oddsPreset ?? "STANDARD",
  );
  const [specialtyBoost, setSpecialtyBoostState] = useState<boolean>(
    () => loadPreferences().specialtyBoost ?? false,
  );
  const [previousWinnerId, setPreviousWinnerId] = useState<string | null>(null);
  const profileRef = useRef(profile);
  const spinInFlight = useRef(false);
  const [spinCount, setSpinCount] = useState(loadSpinCount);
  const spinCountRef = useRef(spinCount);
  const [preferencesSaved, setPreferencesSaved] = useState(true);
  const [countSaved, setCountSaved] = useState(true);
  const [spinError, setSpinError] = useState<string | null>(null);
  const rng = useMemo(() => createCryptoUniformRng(), []);

  const persist = useCallback(
    (next: {
      profile?: PoolProfile;
      soundEnabled?: boolean;
      filters?: GameState["draftFilters"];
      backgroundId?: string;
      revealThemeId?: string;
      reducedMotionOverride?: boolean | null;
      oddsPreset?: OddsPreset;
      specialtyBoost?: boolean;
    }) => {
      const current = loadPreferences();
      const saved = savePreferences({
        ...current,
        soundEnabled: next.soundEnabled ?? soundEnabled,
        filters: next.filters ?? game.draftFilters,
        disabledBuiltInIds: (next.profile ?? profile).disabledBuiltInIds,
        customItems: (next.profile ?? profile).customItems,
        backgroundId: next.backgroundId ?? backgroundId,
        revealThemeId: next.revealThemeId ?? revealThemeId,
        reducedMotionOverride:
          next.reducedMotionOverride !== undefined ? next.reducedMotionOverride : reducedMotionOverride,
        oddsPreset: next.oddsPreset !== undefined ? next.oddsPreset : oddsPreset,
        specialtyBoost: next.specialtyBoost !== undefined ? next.specialtyBoost : specialtyBoost,
      });
      setPreferencesSaved(saved);
    },
    [backgroundId, game.draftFilters, profile, reducedMotionOverride, revealThemeId, soundEnabled, oddsPreset, specialtyBoost],
  );

  const setFilters = useCallback(
    (patch: Partial<GameState["draftFilters"]>) => {
      if (spinInFlight.current) return;
      setSpinError(null);
      dispatch({ type: "SET_FILTERS", patch });
      persist({ filters: { ...game.draftFilters, ...patch } });
    },
    [game.draftFilters, persist],
  );

  const setSound = useCallback(
    (value: boolean) => {
      setSoundEnabled(value);
      persist({ soundEnabled: value });
    },
    [persist],
  );

  const setBackground = useCallback(
    (value: string) => {
      if (spinInFlight.current) return;
      setBackgroundId(value);
      persist({ backgroundId: value });
    },
    [persist],
  );

  const setRevealTheme = useCallback(
    (value: string) => {
      if (spinInFlight.current) return;
      setRevealThemeIdState(value);
      persist({ revealThemeId: value });
    },
    [persist],
  );

  const setReducedMotionOverride = useCallback(
    (value: boolean | null) => {
      if (spinInFlight.current) return;
      setReducedMotionOverrideState(value);
      persist({ reducedMotionOverride: value });
    },
    [persist],
  );

  const setOddsPreset = useCallback(
    (value: OddsPreset) => {
      if (spinInFlight.current) return;
      setOddsPresetState(value);
      persist({ oddsPreset: value });
    },
    [persist],
  );

  const setSpecialtyBoost = useCallback(
    (value: boolean) => {
      if (spinInFlight.current) return;
      setSpecialtyBoostState(value);
      persist({ specialtyBoost: value });
    },
    [persist],
  );

  const spin = useCallback(
    (previousWinnerId: string | null, poolOverride?: CandidateItem[]) => {
      if (spinInFlight.current) return;
      setSpinError(null);
      const bundled = bundledItemsForKind(game.draftFilters.kind);
      const pool = poolOverride ?? combinePool(bundled, profileRef.current);
      const context: RandomizerContext = {
        ...game.draftFilters,
        previousWinnerId,
        oddsPreset,
        specialtyBoost,
      };
      try {
        const result = runRandomizer({ pool, context, rng });
        if (result.status === "OK") {
          setPreviousWinnerId(result.selection.winner.id);
          spinInFlight.current = true;
        }
        dispatch({ type: "RESULT", result });
      } catch {
        setSpinError("Chưa thể chọn món ngẫu nhiên. Hãy thử mở hộp lại.");
      }
    },
    [game.draftFilters, rng, oddsPreset, specialtyBoost],
  );

  const open = useCallback(
    (poolOverride?: CandidateItem[]) => spin(previousWinnerId, poolOverride),
    [spin, previousWinnerId],
  );
  const respin = useCallback(
    (poolOverride?: CandidateItem[]) => spin(previousWinnerId, poolOverride),
    [spin, previousWinnerId],
  );
  const landed = useCallback(() => {
    if (!spinInFlight.current) return;
    spinInFlight.current = false;
    const count = Math.min(Number.MAX_SAFE_INTEGER, spinCountRef.current + 1);
    spinCountRef.current = count;
    setSpinCount(count);
    setCountSaved(saveSpinCount(count));
    dispatch({ type: "LANDED" });
  }, []);
  const accept = useCallback(() => {
    if (spinInFlight.current) return;
    dispatch({ type: "ACCEPT" });
  }, []);

  const toggleBuiltInItem = useCallback(
    (itemId: string, enabled: boolean) => {
      if (spinInFlight.current) return;
      const next = toggleBuiltIn(profileRef.current, itemId, enabled);
      profileRef.current = next;
      setProfile(next);
      persist({ profile: next });
      dispatch({ type: "SET_FILTERS", patch: {} });
    },
    [persist],
  );

  const addCustom = useCallback(
    (input: CustomItemInput) => {
      if (spinInFlight.current) return { ok: false as const, error: "Chờ lượt quay kết thúc để sửa món." };
      const created = createCustomItem(input);
      if (!created.ok) return created;
      const outcome = addCustomItem(profileRef.current, created.item);
      if (outcome.ok) {
        profileRef.current = outcome.profile;
        setProfile(outcome.profile);
        persist({ profile: outcome.profile });
        dispatch({ type: "SET_FILTERS", patch: {} });
      }
      return outcome;
    },
    [persist],
  );

  const removeCustom = useCallback(
    (itemId: string) => {
      if (spinInFlight.current) return;
      const next = removeCustomItem(profileRef.current, itemId);
      profileRef.current = next;
      setProfile(next);
      persist({ profile: next });
      dispatch({ type: "SET_FILTERS", patch: {} });
    },
    [persist],
  );

  const resetAll = useCallback(() => {
    if (spinInFlight.current) return;
    const defaults = resetPreferences();
    const nextProfile = { disabledBuiltInIds: defaults.disabledBuiltInIds, customItems: defaults.customItems };
    profileRef.current = nextProfile;
    setProfile(nextProfile);
    setSpinError(null);
    setPreviousWinnerId(null);
    spinCountRef.current = 0;
    setSpinCount(0);
    setCountSaved(saveSpinCount(0));
    setPreferencesSaved(savePreferences(defaults));
    setSoundEnabled(defaults.soundEnabled);
    setBackgroundId(defaults.backgroundId);
    setRevealThemeIdState(defaults.revealThemeId);
    setReducedMotionOverrideState(defaults.reducedMotionOverride);
    setOddsPresetState(defaults.oddsPreset);
    setSpecialtyBoostState(defaults.specialtyBoost);
    dispatch({ type: "ACCEPT" });
    dispatch({ type: "SET_FILTERS", patch: defaults.filters });
  }, []);

  const bundledForCurrentKind = useMemo(
    () => bundledItemsForKind(game.draftFilters.kind),
    [game.draftFilters.kind],
  );
  const combinedPool = useMemo(
    () => combinePool(bundledForCurrentKind, profile),
    [bundledForCurrentKind, profile],
  );

  // Preview-only: the same hard-eligibility rules as the real draw (RANK-004..010), minus the
  // re-spin exclusion, so "Trong hộp có thể có" always matches what OPEN could actually land on.
  const eligiblePreviewPool = useMemo(
    () => applyHardFilters(combinedPool, { ...game.draftFilters, previousWinnerId: null }).eligible,
    [combinedPool, game.draftFilters],
  );

  return {
    game,
    spinCount,
    previousWinnerId,
    storageAvailable: preferencesSaved && countSaved,
    spinError,
    profile,
    soundEnabled,
    backgroundId,
    revealThemeId,
    reducedMotionOverride,
    oddsPreset,
    specialtyBoost,
    combinedPool,
    eligiblePreviewPool,
    setFilters,
    setSound,
    setBackground,
    setRevealTheme,
    setReducedMotionOverride,
    setOddsPreset,
    setSpecialtyBoost,
    open,
    respin,
    landed,
    accept,
    toggleBuiltInItem,
    addCustom,
    removeCustom,
    resetAll,
  };
}
