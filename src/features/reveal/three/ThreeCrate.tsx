import { useEffect, useRef, useState } from "react";
import type { CrateDefinition } from "@/data/crates";
import type { CratePose, CrateScene } from "./crateScene";

export function ThreeCrate({crate, pose = "idle"}: {crate: CrateDefinition; pose?: CratePose}) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<CrateScene | null>(null);
  const currentPose = useRef(pose);
  const [ready, setReady] = useState(false);
  useEffect(() => { currentPose.current = pose; scene.current?.pose(pose); },[pose]);
  useEffect(() => {
    let cancelled = false;
    let failed = false;
    let instance: CrateScene | undefined;
    const fail = () => { failed = true; if (!cancelled) { instance?.dispose(); scene.current = null; setReady(false); } };
    import("./crateScene").then(({createCrateScene}) => {
      if (cancelled || !host.current) return;
      try {
        instance = createCrateScene(host.current,crate.id,crate.theme.primaryHex,fail);
        if (failed) { instance.dispose(); return; }
        scene.current = instance; instance.pose(currentPose.current);
        if (!failed) setReady(true);
      } catch { fail(); }
    }).catch(fail);
    return () => { cancelled = true; instance?.dispose(); scene.current = null; };
  },[crate.id,crate.theme.primaryHex]);
  return <div className="relative w-full" data-testid="three-crate" data-renderer={ready ? "webgl" : "fallback"}>
    <div ref={host} className="h-72 w-full sm:h-80" />
    {!ready && <div className="absolute inset-0 flex items-center justify-center" data-testid="crate-3d-fallback">
      <img src={crate.imageSrc} alt={crate.name} className="h-44 w-44 object-contain" />
    </div>}
    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-4 text-xs text-slate-300">
      {ready && pose === "idle" && <button type="button" aria-label="Xoay rương sang trái" onClick={()=>scene.current?.turn(-1)} className="rounded-lg border border-white/20 px-4 py-3">↶</button>}
      <span>{crate.name}{ready ? " · 3D" : ""}</span>
      {ready && pose === "idle" && <button type="button" aria-label="Xoay rương sang phải" onClick={()=>scene.current?.turn(1)} className="rounded-lg border border-white/20 px-4 py-3">↷</button>}
    </div>
  </div>;
}
