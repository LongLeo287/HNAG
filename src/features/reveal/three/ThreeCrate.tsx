import { useEffect, useRef, useState } from "react";
import type { CrateDefinition } from "@/data/crates";
import type { CratePose, CrateScene } from "./crateScene";
import { resolveCrateTier, type GraphicsQualityPreference } from "./deviceTier";
import { loadPreferences } from "@/lib/local-preferences";

interface ThreeCrateProps {
  crate: CrateDefinition;
  pose?: CratePose;
  tier?: GraphicsQualityPreference;
}

export function ThreeCrate({ crate, pose = "idle", tier }: ThreeCrateProps) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<CrateScene | null>(null);
  const currentPose = useRef(pose);
  const [ready, setReady] = useState(false);
  const preferredTier = tier ?? loadPreferences().graphicsQuality;
  const activeTier = resolveCrateTier(preferredTier);

  useEffect(() => {
    currentPose.current = pose;
    scene.current?.pose(pose);
  }, [pose]);

  useEffect(() => {
    let cancelled = false;
    let failed = false;
    let instance: CrateScene | undefined;

    const fail = () => {
      failed = true;
      if (!cancelled) {
        instance?.dispose();
        scene.current = null;
        setReady(false);
      }
    };

    import("./crateScene")
      .then(({ createCrateScene }) => {
        if (cancelled || !host.current) return;
        try {
          instance = createCrateScene(host.current, crate.id, crate.theme.primaryHex, fail, activeTier);
          if (failed) {
            instance.dispose();
            return;
          }
          scene.current = instance;
          instance.pose(currentPose.current);
          if (!failed) setReady(true);
        } catch {
          fail();
        }
      })
      .catch(fail);

    return () => {
      cancelled = true;
      instance?.dispose();
      scene.current = null;
    };
  }, [crate.id, crate.theme.primaryHex, activeTier]);

  return (
    <div
      className="relative w-full select-none"
      data-testid="three-crate"
      data-renderer={ready ? "webgl" : "fallback"}
      data-tier={activeTier}
    >
      <div ref={host} className="h-72 w-full sm:h-80" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center" data-testid="crate-3d-fallback">
          <img src={crate.imageSrc} alt={crate.name} className="h-44 w-44 object-contain" />
        </div>
      )}
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center justify-center gap-1 text-xs text-slate-300">
        <div className="flex items-center justify-center gap-4">
          {ready && pose === "idle" && (
            <button
              type="button"
              aria-label="Xoay rương sang trái"
              onClick={() => scene.current?.turn(-1)}
              className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10 active:scale-95 transition-transform"
            >
              ↶
            </button>
          )}
          <span className="font-medium">
            {crate.name}
            {ready ? (activeTier === "desktop" ? " · 3D (PC)" : " · 3D (Mobile)") : ""}
          </span>
          {ready && pose === "idle" && (
            <button
              type="button"
              aria-label="Xoay rương sang phải"
              onClick={() => scene.current?.turn(1)}
              className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10 active:scale-95 transition-transform"
            >
              ↷
            </button>
          )}
        </div>
        {ready && pose === "idle" && (
          <span className="text-[10px] text-slate-400">
            {activeTier === "desktop" ? "🖱️ Kéo chuột để xoay 360°" : "👆 Chạm vuốt để xoay 360°"}
          </span>
        )}
      </div>
    </div>
  );
}
