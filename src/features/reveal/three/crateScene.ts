import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { CrateId } from "@/data/crates";
import type { ResolvedCrateTier } from "./deviceTier";

export type CratePose = "idle" | "shaking" | "opening" | "revealed";
export interface CrateScene {
  pose: (pose: CratePose) => void;
  turn: (direction: number) => void;
  dispose: () => void;
  tier: ResolvedCrateTier;
}

/**
 * Dual-Tier 3D Crate Scene:
 * - Mobile Tier: Ultra-lightweight, 30-40fps, battery-saving, zero shadow overhead.
 * - Desktop Tier: High-fidelity, 60fps, PCFSoftShadows, interior glowing core,
 *   3D golden burst particles, and smooth pointer-drag rotation with inertia.
 */
export function createCrateScene(
  host: HTMLElement,
  id: CrateId,
  accent: string,
  onFailure: () => void,
  tier: ResolvedCrateTier = "mobile",
): CrateScene {
  const isDesktop = tier === "desktop";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { antialias: isDesktop, alpha: true });
  if (!context) throw new Error("WebGL2 unavailable");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: isDesktop,
    powerPreference: isDesktop ? "high-performance" : "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isDesktop ? 2.0 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  if (isDesktop) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  canvas.style.cssText = "width:100%;height:100%;display:block;touch-action:none;cursor:grab";
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.testid = "three-crate-canvas";
  canvas.dataset.tier = tier;
  host.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.set(0, 2.5, 6.8);
  camera.lookAt(0, 0.25, 0);

  scene.add(new THREE.HemisphereLight(0xdcecff, 0x33303d, isDesktop ? 3.2 : 3));
  const light = new THREE.DirectionalLight(0xffe0a3, isDesktop ? 4.5 : 4);
  light.position.set(-3, 5, 4);
  if (isDesktop) {
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 16;
    light.shadow.bias = -0.001;
  }
  scene.add(light);

  const rim = new THREE.DirectionalLight(0x8bcaff, isDesktop ? 3.5 : 3);
  rim.position.set(3, 1, -3);
  scene.add(rim);

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  const material = (color: string, metalness = 0.35, roughness = 0.55) => {
    const value = new THREE.MeshStandardMaterial({ color, metalness, roughness });
    materials.add(value);
    return value;
  };

  const shell = material(id === "crate_snack" ? "#b92227" : id === "crate_drinking" ? "#344438" : "#202830", isDesktop ? 0.45 : 0.35, 0.5);
  const metal = material("#c99842", isDesktop ? 0.85 : 0.75, 0.35);
  const dark = material("#090e14", 0.2, 0.8);
  const trim = material(accent, 0.55, 0.4);

  const group = new THREE.Group();
  group.rotation.y = -0.42;
  scene.add(group);

  function box(
    parent: THREE.Group,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
  ) {
    const geometry = new RoundedBoxGeometry(w, h, d, isDesktop ? 3 : 2, Math.min(0.04, w / 4, h / 4, d / 4));
    geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    if (isDesktop) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    parent.add(mesh);
    return mesh;
  }

  // Hollow crate body & interior
  box(group, 0, -0.65, 0, 2.5, 0.15, 1.75, dark);
  box(group, 0, 0, 0.83, 2.5, 1.3, 0.12, shell);
  box(group, 0, 0, -0.83, 2.5, 1.3, 0.12, shell);
  box(group, -1.19, 0, 0, 0.12, 1.3, 1.7, shell);
  box(group, 1.19, 0, 0, 0.12, 1.3, 1.7, shell);

  // Metal corner guards
  for (const x of [-1.16, 1.16]) {
    for (const z of [-0.83, 0.83]) {
      box(group, x, 0, z, 0.13, 1.35, 0.16, metal);
      for (const y of [-0.6, 0.58]) box(group, x, y, z, 0.23, 0.2, 0.23, metal);
    }
  }

  // Latches & front clasp
  for (const x of [-0.85, 0.85]) {
    box(group, x, 0.1, 0.93, 0.15, 1.2, 0.08, dark);
    box(group, x, 0.42, 0.99, 0.22, 0.35, 0.08, metal);
  }

  // Hinged lid
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.69, -0.85);
  group.add(hinge);
  box(hinge, 0, 0.08, 0.85, 2.54, 0.2, 1.8, shell);
  for (const z of [0, 1.7]) box(hinge, 0, 0.13, z, 2.56, 0.08, 0.08, metal);
  for (const x of [-1.2, 1.2]) box(hinge, x, 0.13, 0.85, 0.08, 0.08, 1.75, metal);
  box(hinge, 0, 0.23, 0.8, 0.9, 0.12, 0.13, dark);
  for (const x of [-0.4, 0.4]) box(hinge, x, 0.17, 0.8, 0.12, 0.18, 0.16, metal);

  // Turntable stage disk
  const diskGeo = new THREE.CylinderGeometry(1.9, 2.05, 0.12, isDesktop ? 64 : 48);
  geometries.add(diskGeo);
  const disk = new THREE.Mesh(diskGeo, dark);
  disk.position.y = -0.85;
  if (isDesktop) disk.receiveShadow = true;
  scene.add(disk);

  // Glowing rune ring
  const ringGeo = new THREE.TorusGeometry(1.85, 0.018, 6, isDesktop ? 80 : 64);
  geometries.add(ringGeo);
  const ring = new THREE.Mesh(ringGeo, trim);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.77;
  scene.add(ring);

  // Glowing interior core
  const core = box(group, 0, -0.35, 0, 2.12, 0.12, 1.35, trim);

  // Interior radiant PointLight
  const interiorLight = new THREE.PointLight(accent, 0, 5);
  interiorLight.position.set(0, -0.1, 0);
  group.add(interiorLight);

  // 3D Burst Particles for Desktop Tier
  let particlePoints: THREE.Points | undefined;
  let particlePositions: Float32Array | undefined;
  let particleVelocities: Float32Array | undefined;
  const particleCount = isDesktop ? 120 : 0;

  if (isDesktop) {
    const pGeo = new THREE.BufferGeometry();
    geometries.add(pGeo);
    particlePositions = new Float32Array(particleCount * 3);
    particleVelocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 1.6;
      particlePositions[i * 3 + 1] = -0.3 + Math.random() * 0.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.1;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 1] = 0.015 + Math.random() * 0.035;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: accent,
      size: 0.065,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    materials.add(pMat);
    particlePoints = new THREE.Points(pGeo, pMat);
    group.add(particlePoints);
  }

  let disposed = false;
  let failed = false;
  let frame = 0;
  let pose: CratePose = "idle";
  let started = performance.now();
  let angle = -0.42;
  let lastFrame = 0;

  const fail = () => {
    if (!disposed && !failed) {
      failed = true;
      cancelAnimationFrame(frame);
      onFailure();
    }
  };

  const draw = () => {
    if (disposed || failed || document.hidden) return;
    try {
      renderer.render(scene, camera);
    } catch {
      fail();
    }
  };

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (width <= 0 || height <= 0 || disposed) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  };

  const targetFps = isDesktop ? 60 : 30;

  function animate(now: number) {
    if (disposed || failed || document.hidden) return;
    const elapsed = now - started;
    if (now - lastFrame >= 1000 / targetFps) {
      lastFrame = now;
      group.rotation.y = angle;
      group.rotation.z = pose === "shaking" ? Math.sin(elapsed * 0.035) * 0.04 : 0;
      hinge.rotation.x =
        pose === "opening"
          ? -Math.min(1, elapsed / 450) * 1.9
          : pose === "revealed"
            ? -1.9
            : 0;
      core.scale.y = pose === "revealed" ? 1.8 : 1;

      // Radiant interior light animation
      if (pose === "opening") {
        const factor = Math.min(1, elapsed / 450);
        interiorLight.intensity = factor * (isDesktop ? 7.0 : 3.0);
      } else if (pose === "revealed") {
        interiorLight.intensity = isDesktop ? 6.0 : 2.5;
      } else {
        interiorLight.intensity = 0;
      }

      // 3D particles animation
      if (isDesktop && particlePoints && particlePositions && particleVelocities) {
        const mat = particlePoints.material as THREE.PointsMaterial;
        if (pose === "opening" || pose === "revealed") {
          mat.opacity = Math.min(0.9, mat.opacity + 0.04);
          for (let i = 0; i < particleCount; i++) {
            const idxX = i * 3;
            const idxY = idxX + 1;
            const idxZ = idxX + 2;
            const vx = particleVelocities[idxX] ?? 0;
            const vy = particleVelocities[idxY] ?? 0;
            const vz = particleVelocities[idxZ] ?? 0;
            const px = (particlePositions[idxX] ?? 0) + vx;
            let py = (particlePositions[idxY] ?? 0) + vy;
            const pz = (particlePositions[idxZ] ?? 0) + vz;
            if (py > 2.0) py = -0.3;
            particlePositions[idxX] = px;
            particlePositions[idxY] = py;
            particlePositions[idxZ] = pz;
          }
          const posAttr = particlePoints.geometry.getAttribute("position");
          if (posAttr) posAttr.needsUpdate = true;
        } else {
          mat.opacity = 0;
        }
      }

      draw();
    }
    if (pose === "shaking" || (pose === "opening" && elapsed < 500) || (isDesktop && pose === "revealed")) {
      frame = requestAnimationFrame(animate);
    }
  }

  // UV reference panels
  type Window = [number, number, number, number];
  function panel(
    image: HTMLImageElement,
    uv: Window,
    parent: THREE.Group,
    width: number,
    height: number,
    position: [number, number, number],
    rotation: [number, number, number],
  ) {
    const texture = new THREE.Texture(image);
    textures.add(texture);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.offset.set(uv[0], 1 - uv[1] - uv[3]);
    texture.repeat.set(uv[2], uv[3]);
    texture.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.65,
      metalness: 0.15,
    });
    materials.add(mat);
    const geometry = new THREE.PlaneGeometry(width, height);
    geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    if (isDesktop) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    parent.add(mesh);
  }

  const art = id === "crate_food" ? "food" : id === "crate_snack" ? "snack" : id === "crate_drinking" ? "party" : undefined;
  if (art) {
    const image = new Image();
    image.onload = () => {
      if (disposed || failed) return;
      if (art === "snack") {
        panel(image, [0.17, 0.48, 0.64, 0.35], group, 1.68, 1.03, [0, 0, 0.901], [0, 0, 0]);
      } else {
        panel(image, art === "food" ? [0.095, 0.07, 0.17, 0.15] : [0.06, 0.075, 0.26, 0.175], group, 1.72, 1.1, [0, 0, 0.901], [0, 0, 0]);
        panel(image, art === "food" ? [0.77, 0.08, 0.19, 0.13] : [0.77, 0.1, 0.19, 0.14], group, 1.35, 1.07, [1.255, 0, 0], [0, Math.PI / 2, 0]);
        panel(image, art === "food" ? [0.77, 0.08, 0.19, 0.13] : [0.77, 0.1, 0.19, 0.14], group, 1.35, 1.07, [-1.255, 0, 0], [0, -Math.PI / 2, 0]);
        panel(image, art === "food" ? [0.39, 0.08, 0.27, 0.14] : [0.4, 0.08, 0.26, 0.17], group, 2.12, 1.07, [0, 0, -0.901], [0, Math.PI, 0]);
        panel(image, art === "food" ? [0.39, 0.33, 0.26, 0.2] : [0.4, 0.345, 0.23, 0.18], hinge, 2.12, 1.32, [0, 0.185, 0.85], [-Math.PI / 2, 0, 0]);
      }
      draw();
    };
    image.onerror = () => { /* Procedural materials remain a complete local fallback. */ };
    image.src = `/images/crates/reference/${art}.png`;
  }

  // Pointer drag to rotate freely
  let isDragging = false;
  let prevClientX = 0;
  const onPointerDown = (e: PointerEvent) => {
    if (pose !== "idle") return;
    isDragging = true;
    prevClientX = e.clientX;
    canvas.style.cursor = "grabbing";
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if browser restricts pointer capture
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || pose !== "idle") return;
    const deltaX = e.clientX - prevClientX;
    prevClientX = e.clientX;
    angle += deltaX * (isDesktop ? 0.012 : 0.016);
    group.rotation.y = angle;
    draw();
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    canvas.style.cursor = "grab";
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const contextLost = (event: Event) => {
    event.preventDefault();
    fail();
  };
  canvas.addEventListener("webglcontextlost", contextLost);
  const visibility = () => {
    cancelAnimationFrame(frame);
    if (!document.hidden) {
      lastFrame = 0;
      animate(performance.now());
    }
  };
  document.addEventListener("visibilitychange", visibility);
  resize();

  return {
    tier,
    pose(next) {
      pose = next;
      started = performance.now();
      lastFrame = 0;
      cancelAnimationFrame(frame);
      animate(started);
    },
    turn(direction) {
      angle += (direction * Math.PI) / 6;
      group.rotation.y = angle;
      draw();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      for (const geometry of geometries) geometry.dispose();
      for (const mat of materials) mat.dispose();
      for (const texture of textures) texture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
