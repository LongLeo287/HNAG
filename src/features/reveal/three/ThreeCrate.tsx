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
  const gesture = useRef<{ id: number; x: number; y: number; lastX: number; lastY: number; dragged: boolean } | null>(null);
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
  }, [crate.id, crate.theme.primaryHex, crate.openingStyle, activeTier, reducedMotion]);

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
          gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, dragged: false };
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
              const deltaX = (event.clientX - active.lastX) * 0.02;
              const deltaY = (event.clientY - active.lastY) * 0.02;
              if (Math.abs(deltaY) > 0.0001) {
                scene.current?.turn(deltaX, deltaY);
              } else {
                scene.current?.turn(deltaX);
              }
              setHover(false);
            }
            active.lastX = event.clientX;
            active.lastY = event.clientY;
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
        onWheel={(event) => {
          if (!interactive || !rendered) return;
          const delta = event.deltaY > 0 ? 0.35 : -0.35;
          scene.current?.zoom?.(delta);
        }}
        onKeyDown={(event) => {
          if (!interactive || event.repeat) return;
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
          else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault(); onInteract?.(); scene.current?.turn(event.key === "ArrowLeft" ? -1 : 1);
          } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault(); onInteract?.(); scene.current?.turn(0, event.key === "ArrowUp" ? -0.35 : 0.35);
          } else if (event.key === "+" || event.key === "=") {
            event.preventDefault(); scene.current?.zoom?.(-0.4);
          } else if (event.key === "-" || event.key === "_") {
            event.preventDefault(); scene.current?.zoom?.(0.4);
          } else if (event.key.toLowerCase() === "r" || event.key === "Home") {
            event.preventDefault(); scene.current?.resetRotation?.();
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

      {/* 3D Multi-dimensional Angle Preset Controls */}
      {interactive && rendered && (
        <div role="toolbar" aria-label="Góc nhìn 3D" className="relative z-10 mx-auto mt-2 flex flex-wrap items-center justify-center gap-1.5 px-3">
          <span
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); scene.current?.setAngle?.(-0.42, 0.22); }}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-canvas-200/80 px-2.5 py-1 text-[11px] font-semibold text-ink-600 hover:border-gold-400/50 hover:bg-canvas-300 hover:text-white transition-all cursor-pointer select-none"
            title="Góc nhìn 3D không gian tổng thể"
          >
            📐 Góc 3D
          </span>
          <span
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); scene.current?.setAngle?.(0, -0.65); }}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-canvas-200/80 px-2.5 py-1 text-[11px] font-semibold text-ink-600 hover:border-gold-400/50 hover:bg-canvas-300 hover:text-white transition-all cursor-pointer select-none"
            title="Nhìn từ trên xuống nắp hòm"
          >
            🔝 Nhìn từ trên
          </span>
          <span
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); scene.current?.setAngle?.(0, 0.05); }}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-canvas-200/80 px-2.5 py-1 text-[11px] font-semibold text-ink-600 hover:border-gold-400/50 hover:bg-canvas-300 hover:text-white transition-all cursor-pointer select-none"
            title="Nhìn thẳng mặt trước khóa hòm"
          >
            🔲 Mặt trước
          </span>
          <span
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); scene.current?.setAngle?.(Math.PI / 2, 0.1); }}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-canvas-200/80 px-2.5 py-1 text-[11px] font-semibold text-ink-600 hover:border-gold-400/50 hover:bg-canvas-300 hover:text-white transition-all cursor-pointer select-none"
            title="Nhìn mặt bên tay xách"
          >
            🔄 Mặt bên
          </span>
          <span
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); scene.current?.zoom?.(-0.5); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-canvas-200/80 text-xs font-bold text-ink-600 hover:border-gold-400/50 hover:bg-canvas-300 hover:text-white transition-all cursor-pointer select-none"
            title="Phóng to hòm (+)"
          >
            +
          </span>
          <span
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); scene.current?.zoom?.(0.5); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-canvas-200/80 text-xs font-bold text-ink-600 hover:border-gold-400/50 hover:bg-canvas-300 hover:text-white transition-all cursor-pointer select-none"
            title="Thu nhỏ hòm (-)"
          >
            −
          </span>
          <span
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); scene.current?.resetRotation?.(); }}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-canvas-200/80 px-2 py-1 text-[11px] font-medium text-ink-500 hover:border-gold-400/50 hover:bg-canvas-300 hover:text-white transition-all cursor-pointer select-none"
            title="Đặt lại góc xoay ban đầu"
          >
            ↺ Đặt lại
          </span>
        </div>
      )}

      <div className="pointer-events-none relative flex flex-col items-center justify-center gap-1 px-3 pb-4 text-xs text-slate-300">
        <span className="font-medium flex items-center gap-1.5">
          <span>{crate.name}{rendered ? " · 3D" : ""}</span>
          {rendered && <span className="rounded bg-gold-500/20 px-1.5 py-0.5 text-[10px] font-bold text-gold-400">ĐA CHIỀU</span>}
        </span>
        {interactive && (
          <span className="text-[11px] text-slate-400 text-center">
            {rendered
              ? "Kéo chuột/chạm mọi hướng để xoay 3D đa chiều · Cuộn chuột phóng to/thu nhỏ · Bấm để mở"
              : "Bấm vào rương để mở"}
          </span>
        )}
        {interactive && <span className="sr-only">Dùng phím mũi tên để xoay đa chiều; Enter hoặc Space để mở.</span>}
      </div>
    </div>
  );
}
