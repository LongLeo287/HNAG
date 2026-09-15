import { useMemo, useState } from "react";
import { useGame } from "../useGame";
import { useGameAudio } from "@/features/audio/useGameAudio";
import { CrateStage } from "@/features/reveal/ui/CrateStage";
import { CrateSelectorRack } from "@/features/crates/ui/CrateSelectorRack";
import { CRATES, type CrateId, getCrateById, filterItemsForCrate, DEFAULT_CRATE_ID } from "@/data/crates";
import { PoolPreferencesDrawer } from "@/features/pool/ui/PoolPreferencesDrawer";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { LandmarkScene } from "@/components/ui/LandmarkScene";
import { AppHeader } from "@/components/layout/AppHeader";
import { HNAGHero } from "./HNAGHero";
import { GameControls } from "./GameControls";
import { OpenCaseButton } from "./OpenCaseButton";
import { CatalogExplorer } from "./CatalogExplorer";
import { SettingsDrawer } from "./SettingsDrawer";
import { RevealThemePicker } from "./RevealThemePicker";
import { bundledItemsForKind } from "@/data/catalog";
import { combinePool } from "@/features/pool";
import { useSmartContext, filterItemsByContext, SmartContextBar } from "@/features/context";
import { applyHardFilters, applyRespinExclusion, computeWeights, stableSortById } from "@/features/randomizer/domain";
import { FoodDrinkToggle } from "./FoodDrinkToggle";
import { eligibleForCrate, filtersForCrate, initialCrateId } from "../crateFilters";
import { loadPreferences, savePreferences } from "@/lib/local-preferences";

const BLOCKER_MESSAGE: Record<string, string> = {
  NO_CANDIDATES_KIND: "Chưa có món nào cho lựa chọn này.",
  NO_CANDIDATES_CATEGORY: "Không có món nào khớp bộ lọc loại món. Thử bỏ bớt bộ lọc.",
  NO_CANDIDATES_VEGETARIAN: "Không có món chay khớp bộ lọc hiện tại.",
  NO_CANDIDATES_BUDGET: "Không có món nào trong mức ngân sách này. Thử tăng ngân sách.",
};

/** UI-045: CS:GO style wide tactical layout with permanent Crate Stage, Smart Context Bar, and Catalog Explorer. */
export function GameShell() {
  const {
    game,
    spinCount,
    previousWinnerId,
    storageAvailable,
    spinError,
    profile,
    combinedPool,
    soundEnabled,
    backgroundId,
    revealThemeId,
    reducedMotionOverride,
    setFilters,
    setSound,
    setBackground,
    setRevealTheme,
    setReducedMotionOverride,
    open,
    respin,
    landed,
    accept,
    toggleBuiltInItem,
    addCustom,
    removeCustom,
    resetAll,
  } = useGame();

  const audio = useGameAudio(soundEnabled);
  const reducedMotion = useReducedMotion(reducedMotionOverride);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [poolPreviewOpen, setPoolPreviewOpen] = useState(false);

  const deviceContext = useSmartContext();
  const { resolvedContext } = deviceContext;
  const [useContextSuggestions, setUseContextSuggestions] = useState(true);

  // CS:GO Case selection state
  const [selectedCrateId, setSelectedCrateId] = useState<CrateId>(() => {
    const saved = loadPreferences().selectedCrateId;
    return saved && getCrateById(saved).filter.kind === game.draftFilters.kind ? saved : initialCrateId(game.draftFilters);
  });

  const currentCrate = getCrateById(selectedCrateId);

  // Live item pools for FOOD and DRINK
  const foodPool = useMemo(
    () => combinePool(bundledItemsForKind("FOOD"), profile).filter((item) => item.enabled && item.kind === "FOOD"),
    [profile],
  );
  const drinkPool = useMemo(
    () => combinePool(bundledItemsForKind("DRINK"), profile).filter((item) => item.enabled && item.kind === "DRINK"),
    [profile],
  );

  // Context-filtered base pools based on Location, Meal Time, Weather, and Day
  const contextFoodPool = useMemo(
    () => useContextSuggestions ? filterItemsByContext(foodPool, resolvedContext) : foodPool,
    [foodPool, resolvedContext, useContextSuggestions],
  );
  const contextDrinkPool = useMemo(
    () => useContextSuggestions ? filterItemsByContext(drinkPool, resolvedContext) : drinkPool,
    [drinkPool, resolvedContext, useContextSuggestions],
  );

  // Live counts for each of the 5 crates (under active context)
  const countsByCrate = useMemo(() => {
    const counts: Record<CrateId, number> = {
      crate_food: 0,
      crate_drink: 0,
      crate_alcohol: 0,
      crate_snack: 0,
      crate_drinking: 0,
      crate_vegetarian: 0,
    };
    for (const crate of CRATES) {
      const pool = crate.filter.kind === "FOOD" ? contextFoodPool : contextDrinkPool;
      counts[crate.id] = eligibleForCrate(pool, crate,
        crate.id === selectedCrateId ? game.draftFilters : filtersForCrate(crate, game.draftFilters)).length;
    }
    return counts;
  }, [contextFoodPool, contextDrinkPool, game.draftFilters, selectedCrateId]);

  // Contextual pool for the currently selected crate
  const activeCratePool = useMemo(() => {
    const basePool = currentCrate.filter.kind === "FOOD" ? contextFoodPool : contextDrinkPool;
    return filterItemsForCrate(basePool, currentCrate);
  }, [currentCrate, contextFoodPool, contextDrinkPool]);

  // Combined eligible pool matching Crate + Context + any active user filters
  const currentEligiblePool = useMemo(() => {
    return applyHardFilters(activeCratePool, game.draftFilters).eligible;
  }, [activeCratePool, game.draftFilters]);

  // Match the real draw after crate/context filters and same-tier repeat exclusion.
  const nextDrawOdds = useMemo(() => {
    const context = { ...game.draftFilters, previousWinnerId };
    const { eligible } = applyHardFilters(currentEligiblePool, context);
    const eligiblePool = stableSortById(applyRespinExclusion(eligible, previousWinnerId));
    return { eligiblePool, probabilities: computeWeights(eligiblePool, context) };
  }, [currentEligiblePool, game.draftFilters, previousWinnerId]);

  const countsByCategory = useMemo(() => {
    const filteredPool = applyHardFilters(activeCratePool, { ...game.draftFilters, categoryIds: [] }).eligible;
    const counts: Record<string, number> = {};
    for (const item of filteredPool) {
      counts[item.categoryId] = (counts[item.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [activeCratePool, game.draftFilters]);

  function handleSelectCrate(crateId: CrateId) {
    if (game.phase === "spinning") return;
    audio.recover();
    audio.playEquipCrate();
    setSelectedCrateId(crateId);
    savePreferences({ ...loadPreferences(), selectedCrateId: crateId });
    const targetCrate = getCrateById(crateId);
    setFilters(filtersForCrate(targetCrate, game.draftFilters));
  }

  function handleReset() {
    deviceContext.disableLocation();
    setSelectedCrateId(DEFAULT_CRATE_ID);
    resetAll();
  }

  function handleOpen() {
    audio.recover(); // first-gesture unlock, per DS-024.
    audio.playCrateOpen();
    open(currentEligiblePool);
  }

  function handleRespin() {
    audio.recover();
    audio.playCrateOpen();
    respin(currentEligiblePool);
  }

  return (
    <div className="relative min-h-dvh flex flex-col bg-canvas-50 text-ink-900 selection:bg-gold-500 selection:text-black">
      {/* Background Landmark Silhouette */}
      <LandmarkScene
        landmarkId={backgroundId}
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[45vh] w-full opacity-35"
      />
      {/* Ambient background vignette */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-canvas-50/40 to-canvas-50/95" />

      {/* Top Application Bar */}
      <AppHeader
        soundEnabled={soundEnabled}
        onSoundChange={setSound}
        onOpenPreferences={() => setDrawerOpen(true)}
        onOpenSettings={() => setSettingsOpen((prev) => !prev)}
        spinCount={spinCount}
        preferencesDisabled={game.phase === "spinning"}
      />

      {/* Main Game Surface */}
      <main className="safe-area-px safe-area-pb relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-5 sm:gap-6 px-4 py-5 sm:py-6">
        {/* Hero Title */}
        <HNAGHero />

        {/* Device facts remain visible even if suggestion filtering is disabled. */}
        <SmartContextBar
          context={deviceContext}
          matchedCount={currentEligiblePool.length}
        />
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-ink-700">
          <input type="checkbox" checked={useContextSuggestions} disabled={game.phase === "spinning"}
            onChange={(event) => setUseContextSuggestions(event.target.checked)} />
          Lọc gợi ý theo giờ và thời tiết đã xác định
        </label>

        {!storageAvailable && (
          <p role="status" className="rounded-xl border border-gold-500/40 bg-gold-500/10 p-3 text-sm text-gold-400">
            Trình duyệt chưa lưu được thay đổi. Bạn vẫn chơi được, nhưng dữ liệu mới có thể mất khi tải lại trang.
          </p>
        )}
        {spinError && <p role="alert" className="text-sm text-chili-400">{spinError}</p>}

        {/* Standalone Menu Kiểu Mở Kết Quả (Reveal Modes Menu) */}
        <RevealThemePicker
          value={revealThemeId}
          disabled={game.phase === "spinning"}
          onChange={(themeId) => {
            audio.playEquipCrate();
            setRevealTheme(themeId);
          }}
        />

        <fieldset disabled={game.phase === "spinning"} className="w-full space-y-2 disabled:opacity-60">
          <legend className="mb-2 text-sm font-semibold text-ink-900">Bạn muốn chọn món ăn hay đồ uống?</legend>
          <FoodDrinkToggle value={game.draftFilters.kind} onChange={(kind) => {
            if (kind !== game.draftFilters.kind) handleSelectCrate(kind === "DRINK" ? "crate_drink" : DEFAULT_CRATE_ID);
          }} />
        </fieldset>

        <CrateSelectorRack
          kind={game.draftFilters.kind}
          selectedCrateId={selectedCrateId}
          countsByCrate={countsByCrate}
          disabled={game.phase === "spinning"}
          onSelectCrate={handleSelectCrate}
        />

        {/* Central Crate Showcase Stage (CS:GO style case opening) */}
        <CrateStage
          phase={game.phase}
          eligiblePool={nextDrawOdds.eligiblePool}
          nextDrawOdds={nextDrawOdds}
          frozenSelection={game.frozenSelection}
          reducedMotion={reducedMotion}
          revealThemeId={revealThemeId}
          audio={audio}
          crate={currentCrate}
          onLanded={landed}
          onAccept={accept}
          onRespin={handleRespin}
          onEditPool={() => setDrawerOpen(true)}
        />

        {/* Primary Action Button & Controls: Always mounted so the page never collapses! */}
        <div className="flex w-full flex-col items-center gap-6">
          <OpenCaseButton
            onClick={handleOpen}
            itemCount={currentEligiblePool.length}
            isSpinning={game.phase === "spinning"}
            disabled={currentEligiblePool.length === 0 || game.phase === "spinning"}
            crateName={currentCrate.name}
            accentHex={currentCrate.theme.primaryHex}
          />

          {/* Subtle quick access pill to view odds in menu */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Xem tỉ lệ mở theo bộ lọc hiện tại"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-canvas-200/80 px-4 py-1.5 text-xs font-medium text-ink-500 hover:border-gold-500/40 hover:bg-canvas-300 hover:text-white transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-sm">📊</span>
            <span>Tỉ lệ mở theo bộ lọc</span>
            <span className="text-[10px] text-ink-700 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all">→</span>
          </button>

          <GameControls
            crate={currentCrate}
            filters={game.draftFilters}
            disabled={game.phase === "spinning"}
            countsByCategory={countsByCategory}
            onChange={(patch) => {
              setFilters(patch);
            }}
          />

          <div className="w-full">
            <button
              type="button"
              aria-expanded={poolPreviewOpen}
              aria-controls="pool-preview"
              onClick={() => setPoolPreviewOpen((value) => !value)}
              className="min-h-11 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-ink-700 hover:bg-canvas-200"
            >
              {poolPreviewOpen ? "Ẩn món trong hộp" : `Xem ${currentEligiblePool.length} món có thể quay trúng`} {poolPreviewOpen ? "−" : "+"}
            </button>
            <div id="pool-preview" hidden={!poolPreviewOpen}>
              {poolPreviewOpen && <CatalogExplorer items={currentEligiblePool} onOpenPreferences={() => setDrawerOpen(true)} />}
            </div>
          </div>
        </div>

        {/* Blocked State Notice */}
        {(game.phase === "blocked" || (game.phase === "configuring" && currentEligiblePool.length === 0)) && (
          <div role="status" className="flex w-full max-w-lg flex-col items-center gap-3 rounded-2xl border border-chili-500/40 bg-chili-500/10 p-6 text-center shadow-lg">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-semibold text-white">
              {game.blockedDiagnostics?.blockers[0]
                ? BLOCKER_MESSAGE[game.blockedDiagnostics.blockers[0]]
                : "Không tìm thấy món ăn nào phù hợp với bộ lọc hiện tại."}
            </p>
            <p className="text-xs text-ink-500">
              Thử nới ngân sách, bỏ chọn danh mục hoặc tắt lọc gợi ý theo giờ và thời tiết.
            </p>
            <Button
              variant="secondary"
              onClick={() =>
                setFilters({ categoryIds: [], vegetarianOnly: false, budgetMode: "NONE" })
              }
            >
              Đặt lại bộ lọc
            </Button>
            <Button variant="ghost" onClick={() => setDrawerOpen(true)}>Sửa danh sách món</Button>
          </div>
        )}

        {/* Clean Footer */}
        <footer className="mt-12 flex w-full flex-col items-center gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-ink-500">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-canvas-200 hover:text-white transition-colors"
            >
              <span>⚙️</span>
              <span>Cài đặt hệ thống</span>
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-canvas-200 hover:text-white transition-colors"
            >
              <span>📋</span>
              <span>Thực đơn của tôi</span>
            </button>
          </div>
          <p className="text-center text-xs text-ink-500">
            #HNAG • Vietnam-first gamified food decision game • Không quảng cáo • Hoàn toàn trên trình duyệt
          </p>
        </footer>

        {/* Settings Slide-over Drawer (right edge) */}
        <SettingsDrawer
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          disabled={game.phase === "spinning"}
          soundEnabled={soundEnabled}
          onSoundChange={setSound}
          backgroundId={backgroundId}
          onBackgroundChange={setBackground}
          reducedMotionOverride={reducedMotionOverride}
          onReducedMotionOverrideChange={setReducedMotionOverride}
          onOpenPreferences={() => setDrawerOpen(true)}
          onReset={handleReset}
          odds={game.phase === "spinning" && game.frozenSelection ? game.frozenSelection : nextDrawOdds}
        />

        {/* Pool Preferences Drawer */}
        <PoolPreferencesDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          kind={game.draftFilters.kind}
          combinedPool={combinedPool}
          onToggleBuiltIn={toggleBuiltInItem}
          onAddCustom={addCustom}
          onRemoveCustom={removeCustom}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}
