import { useEffect, useRef, useState } from "react";
import type { CrateDefinition } from "@/data/crates";
import type { CratePose, CrateScene } from "./crateScene";
import { resolveCrateTier, type GraphicsQualityPreference } from "./deviceTier";
import { loadPreferences } from "@/lib/local-preferences";

interface ThreeCrateProps {
  crate: CrateDefinition;
  pose?: CratePose;
  tier?: GraphicsQualityPreference;
  onOpen?: () => void;
  onHover?: () => void;
  onInteract?: () => void;
  disabled?: boolean;
  reducedMotion?: boolean;
}

export function ThreeCrate({ crate, pose = "idle", tier, onOpen, onHover, onInteract, disabled = false, reducedMotion = false }: ThreeCrateProps) {
  const host = useRef<HTMLDivElement>(null);
  const fallback = useRef<HTMLImageElement>(null);
  const scene = useRef<CrateScene | null>(null);
  const gesture = useRef<{ id: number; x: number; y: number; lastX: number; dragged: boolean } | null>(null);
  const opening = useRef(false);
  const hovering = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const currentPose = useRef(pose);
  const [ready, setReady] = useState(false);
  const preferredTier = tier ?? loadPreferences().graphicsQuality;
  const activeTier = resolveCrateTier(preferredTier);
  const interactive = !disabled && pose === "idle" && Boolean(onOpen);
  const rendered = ready && !reducedMotion;

  function setHover(value: boolean) {
    setHovered(value);
    if (hovering.current === value) return;
    hovering.current = value;
    scene.current?.hover(value);
    if (value) onHover?.();
  }

  function hit(clientX: number, clientY: number) {
    if (scene.current && !reducedMotion) return scene.current.hitTest(clientX, clientY);
    const bounds = fallback.current?.getBoundingClientRect();
    return Boolean(bounds && clientX >= bounds.left && clientX <= bounds.right && clientY >= bounds.top && clientY <= bounds.bottom);
  }

  function activate() {
    if (!interactive || opening.current) return;
    opening.current = true;
    setHover(false);
    onInteract?.();
    onOpen?.();
    // Protect the activation event from duplicates without trapping a failed draw.
    // The parent becomes non-interactive as soon as a successful draw starts.
    queueMicrotask(() => { opening.current = false; });
  }

  function cancelGesture() {
    gesture.current = null;
    setDragging(false);
    setHover(false);
  }

  useEffect(() => {
    currentPose.current = pose;
    scene.current?.pose(pose);
    if (pose !== "idle") opening.current = false;
  }, [pose]);

  useEffect(() => {
    if (!interactive) {
      gesture.current = null;
      hovering.current = false;
      scene.current?.hover(false);
      // Pointer capture can outlive an external disable; clear its visual state too.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDragging(false);
      setHovered(false);
    }
  }, [interactive]);

  useEffect(() => {
    if (reducedMotion) return;
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
  }, [crate.id, crate.theme.primaryHex, activeTier, reducedMotion]);

  return (
    <div
      className="relative w-full select-none"
      data-testid="three-crate"
      data-renderer={rendered ? "webgl" : "fallback"}
      data-tier={activeTier}
      data-dragging={interactive && dragging}
      data-hovered={interactive && hovered}
    >
      <div
        role={onOpen ? "button" : undefined}
        aria-label={onOpen ? `Mở rương ${crate.name}` : undefined}
        aria-disabled={onOpen ? !interactive : undefined}
        tabIndex={interactive ? 0 : -1}
        className="relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        style={{ touchAction: "pan-y", cursor: interactive ? (dragging ? "grabbing" : hovered ? "grab" : "default") : "default" }}
        onPointerDown={(event) => {
          if (!event.isPrimary) { cancelGesture(); return; }
          if (!interactive || event.button !== 0 || !hit(event.clientX, event.clientY)) return;
          onInteract?.();
          setDragging(false);
          gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, dragged: false };
          try { event.currentTarget.setPointerCapture?.(event.pointerId); }
          catch { cancelGesture(); }
        }}
        onPointerMove={(event) => {
          const active = gesture.current;
          if (!interactive) { cancelGesture(); return; }
          if (active && active.id === event.pointerId) {
            active.dragged ||= Math.hypot(event.clientX - active.x, event.clientY - active.y) > 6;
            if (active.dragged) {
              setDragging(true);
              scene.current?.turn((event.clientX - active.lastX) * 0.02);
              setHover(false);
            }
            active.lastX = event.clientX;
          } else if (interactive && event.pointerType !== "touch") setHover(hit(event.clientX, event.clientY));
        }}
        onPointerUp={(event) => {
          const active = gesture.current;
          if (!active || active.id !== event.pointerId) return;
          const shouldOpen = event.button === 0 && !active.dragged && Math.hypot(event.clientX - active.x, event.clientY - active.y) <= 6 && hit(event.clientX, event.clientY);
          cancelGesture();
          try {
            if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          } catch { /* A browser may release capture before dispatching pointerup. */ }
          if (shouldOpen) activate();
        }}
        onPointerCancel={cancelGesture}
        onLostPointerCapture={cancelGesture}
        onPointerLeave={() => setHover(false)}
        onKeyDown={(event) => {
          if (!interactive || event.repeat) return;
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
          else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault(); onInteract?.(); scene.current?.turn(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onClick={(event) => { if (event.detail === 0) activate(); }}
      >
        <div ref={host} className="h-80 w-full sm:h-96" />
        {!rendered && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" data-testid="crate-3d-fallback">
            <img ref={fallback} src={crate.imageSrc} alt={crate.name} draggable={false} className="h-56 w-56 object-contain" />
          </div>
        )}
      </div>
      <div className="pointer-events-none relative flex flex-col items-center justify-center gap-1 px-3 pb-4 text-xs text-slate-300">
        <span className="font-medium">{crate.name}{rendered ? " · 3D" : ""}</span>
        {interactive && <span className="text-[11px] text-slate-400">{rendered ? "Giữ và kéo để xoay · Bấm vào rương để mở" : "Bấm vào rương để mở"}</span>}
        {interactive && <span className="sr-only">Dùng phím mũi tên để xoay; Enter hoặc Space để mở.</span>}
      </div>
    </div>
  );
}
