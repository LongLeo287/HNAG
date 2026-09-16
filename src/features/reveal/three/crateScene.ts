import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { CrateId } from "@/data/crates";
import type { ResolvedCrateTier } from "./deviceTier";

export type CratePose = "idle" | "shaking" | "opening" | "revealed";
export interface CrateScene {
  pose: (pose: CratePose) => void;
  turn: (direction: number, pitch?: number) => void;
  setAngle?: (yaw: number, pitch: number) => void;
  zoom?: (delta: number) => void;
  resetRotation?: () => void;
  hitTest: (x: number, y: number) => boolean;
  hover: (active: boolean) => void;
  dispose: () => void;
  tier: ResolvedCrateTier;
}

/**
 * Dual-Tier 3D Crate Scene:
 * - Mobile: 30 fps, capped resolution, no shadow maps, 24 burst particles.
 * - Desktop: 60 fps, PCF shadow maps, interior light and 80 burst particles.
 * Input lives in ThreeCrate so fallback and WebGL share the same click/drag rules.
 */
export function createCrateScene(
  host: HTMLElement,
  id: CrateId,
  accent: string,
  onFailure: () => void,
  tier: ResolvedCrateTier = "mobile",
  openingStyle?: "csgo" | "overwatch" | "apex",
): CrateScene {
  const isDesktop = tier === "desktop";
  const resolvedOpeningStyle: "csgo" | "overwatch" | "apex" =
    openingStyle ??
    (id === "crate_drinking" || id === "crate_alcohol"
      ? "apex"
      : id === "crate_food"
        ? "csgo"
        : "overwatch");
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
    renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  canvas.style.cssText = "width:100%;height:100%;display:block;pointer-events:none";
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.testid = "three-crate-canvas";
  canvas.dataset.tier = tier;
  host.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.set(0, 2.5, 6.8);
  camera.lookAt(0, 0, 0);

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
  group.rotation.x = 0.22;
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
      box(group, x, 0, z, 0.13, 1.35, 0.16, dark);
      for (const y of [-0.6, 0.58]) box(group, x, y, z, 0.23, 0.2, 0.23, metal);
    }
  }

  // Latches & front clasp
  for (const x of [-0.85, 0.85]) {
    box(group, x, 0.1, 0.93, 0.15, 1.2, 0.08, dark);
    box(group, x, 0.42, 0.99, 0.22, 0.35, 0.08, dark);
    box(group, x, 0.48, 1.04, 0.12, 0.08, 0.035, metal);
  }

  // Hinged lid
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.69, -0.85);
  group.add(hinge);
  box(hinge, 0, 0.08, 0.85, 2.54, 0.2, 1.8, shell);
  for (const z of [0, 1.7]) box(hinge, 0, 0.13, z, 2.56, 0.08, 0.08, dark);
  for (const x of [-1.2, 1.2]) box(hinge, x, 0.13, 0.85, 0.08, 0.08, 1.75, dark);
  // Raised, hollow handle and corner caps follow the supplied hardware silhouettes.
  box(hinge, 0, 0.4, 0.48, 0.84, 0.12, 0.13, dark);
  for (const x of [-0.4, 0.4]) box(hinge, x, 0.28, 0.48, 0.12, 0.3, 0.16, metal);
  for (const x of [-1.16, 1.16]) for (const z of [0.05, 1.65]) {
    box(hinge, x, 0.1, z, 0.25, 0.23, 0.23, metal);
  }
  for (const x of [-1.29, 1.29]) {
    for (const z of [-0.32, 0.32]) box(group, x, 0.2, z, 0.08, 0.28, 0.08, metal);
    box(group, x, 0.1, 0, 0.1, 0.08, 0.7, dark);
  }
  if (id === "crate_food") {
    const lockRingGeo = new THREE.TorusGeometry(0.09, 0.024, 6, 16);
    geometries.add(lockRingGeo);
    const lockRing = new THREE.Mesh(lockRingGeo, metal);
    lockRing.position.set(1.09, 0.38, 0.96);
    group.add(lockRing);
    box(group, 1.09, 0.24, 0.96, 0.2, 0.24, 0.1, metal);
  }

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
  const beamGeometry = new THREE.CylinderGeometry(1.15, 0.65, 2.1, 24, 1, true);
  geometries.add(beamGeometry);
  const beamMaterial = new THREE.MeshBasicMaterial({ color: accent, transparent: true,
    opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  materials.add(beamMaterial);
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.y = 1.05;
  beam.visible = false;
  group.add(beam);

  // 3D Burst Particles for Desktop Tier
  let particlePoints: THREE.Points | undefined;
  let particlePositions: Float32Array | undefined;
  let particleVelocities: Float32Array | undefined;
  const particleCount = isDesktop ? 80 : 24;

  {
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
      depthWrite: false,
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
  let angleY = -0.42;
  let angleX = 0.22;
  let velY = 0;
  let velX = 0;
  let isInteracting = false;
  let interactTimeout: ReturnType<typeof setTimeout> | undefined;
  let cameraDist = 6.8;
  let targetCameraDist = 6.8;
  let lastFrame = 0;
  let hovered = false;
  const raycaster = new THREE.Raycaster();

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
    camera.position.set(0, 2.2 + angleX * 0.6, Math.max(6.1, 3.5 / camera.aspect));
    camera.lookAt(0, 0.1, 0);
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

      // Multi-dimensional inertia & damping when user finishes drag
      if (!isInteracting && pose === "idle") {
        if (Math.abs(velY) > 0.0002 || Math.abs(velX) > 0.0002) {
          angleY += velY;
          angleX = Math.max(-0.85, Math.min(0.75, angleX + velX));
          velY *= 0.92;
          velX *= 0.92;
        }
      }

      // Smooth camera zoom
      if (Math.abs(targetCameraDist - cameraDist) > 0.01) {
        cameraDist += (targetCameraDist - cameraDist) * 0.15;
        camera.position.z = cameraDist;
      }
      camera.position.y = 2.2 + angleX * 0.6;
      camera.lookAt(0, 0.1, 0);

      const idleFloatY = pose === "idle" ? Math.sin(now * 0.0016) * 0.035 : 0;
      const idleBobPitch = pose === "idle" ? Math.sin(now * 0.0012) * 0.012 : 0;

      group.rotation.x = angleX + idleBobPitch;
      group.rotation.y = angleY;

      // Style-specific shaking physics
      if (pose === "shaking") {
        if (resolvedOpeningStyle === "overwatch") {
          // Overwatch pneumatic rapid flutter
          group.rotation.z = Math.sin(elapsed * 0.055) * 0.045;
          group.position.x = Math.sin(elapsed * 0.045) * 0.015;
          group.position.y = (hovered ? 0.05 : 0) + idleFloatY + Math.sin(elapsed * 0.07) * 0.02;
        } else if (resolvedOpeningStyle === "apex") {
          // Apex tectonic core rumble
          group.rotation.z = Math.sin(elapsed * 0.04) * 0.035;
          group.position.x = Math.sin(elapsed * 0.03) * 0.025;
          group.position.z = Math.cos(elapsed * 0.03) * 0.02;
          group.position.y = (hovered ? 0.05 : 0) + idleFloatY;
          interiorLight.intensity = (Math.sin(elapsed * 0.025) + 1) * 1.8;
        } else {
          // CS:GO tactical lock tremble
          group.rotation.z = Math.sin(elapsed * 0.035) * 0.04;
          group.position.x = Math.sin(elapsed * 0.035) * 0.012;
          group.position.y = (hovered ? 0.05 : 0) + idleFloatY;
        }
      } else {
        group.rotation.z = Math.sin(angleY * 2) * angleX * 0.04;
        group.position.x = 0;
        group.position.z = 0;
        group.position.y = (hovered ? 0.05 : 0) + idleFloatY;
      }

      disk.rotation.y = angleY * 0.25;
      ring.rotation.z = angleY * 0.25;

      canvas.dataset.angle = `${angleY.toFixed(3)},${angleX.toFixed(3)}`;

      // Style-specific lid motion and lighting
      if (resolvedOpeningStyle === "overwatch") {
        // OVERWATCH: Pneumatic pop — lid launches upward into the sky with 3D tumble, giant light pillar
        if (pose === "opening") {
          const pop = Math.min(1, elapsed / 420);
          hinge.position.y = 0.69 + pop * 2.2;
          hinge.position.z = -0.85 - pop * 1.1;
          hinge.rotation.x = -pop * 2.8;
          hinge.rotation.z = Math.sin(elapsed * 0.015) * 0.4;
          hinge.rotation.y = Math.sin(elapsed * 0.01) * 0.25;

          beam.visible = true;
          beam.scale.set(1.35, 2.8, 1.35);
          beamMaterial.opacity = Math.min(0.28, elapsed / 1800);
          interiorLight.intensity = pop * (isDesktop ? 9.0 : 4.5);
        } else if (pose === "revealed") {
          hinge.position.set(0, 2.89, -1.95);
          hinge.rotation.set(-2.8, 0.15, 0.25);

          beam.visible = true;
          beam.scale.set(1.35, 2.8, 1.35);
          beamMaterial.opacity = 0.25;
          interiorLight.intensity = isDesktop ? 8.0 : 4.0;
        } else {
          hinge.position.set(0, 0.69, -0.85);
          hinge.rotation.set(0, 0, 0);
          beam.visible = false;
          beam.scale.set(1, 1, 1);
          beamMaterial.opacity = 0;
          interiorLight.intensity = 0;
        }
      } else if (resolvedOpeningStyle === "apex") {
        // APEX LEGENDS: Mechanical shell fracture — lid splits open backwards, high-energy laser column
        if (pose === "opening") {
          const fracture = Math.min(1, elapsed / 400);
          hinge.position.y = 0.69 + fracture * 1.3;
          hinge.position.z = -0.85 - fracture * 0.6;
          hinge.rotation.x = -fracture * 2.4;
          hinge.rotation.y = Math.sin(elapsed * 0.012) * 0.2;

          beam.visible = true;
          beam.scale.set(0.9, 3.2, 0.9);
          beamMaterial.opacity = Math.min(0.32, elapsed / 1600);
          interiorLight.intensity = fracture * (isDesktop ? 10.0 : 5.0);
        } else if (pose === "revealed") {
          hinge.position.set(0, 1.99, -1.45);
          hinge.rotation.set(-2.4, 0.15, 0);

          beam.visible = true;
          beam.scale.set(0.9, 3.2, 0.9);
          beamMaterial.opacity = 0.3;
          interiorLight.intensity = isDesktop ? 9.0 : 4.5;
        } else {
          hinge.position.set(0, 0.69, -0.85);
          hinge.rotation.set(0, 0, 0);
          beam.visible = false;
          beam.scale.set(1, 1, 1);
          beamMaterial.opacity = 0;
          interiorLight.intensity = 0;
        }
      } else {
        // CS:GO: Industrial heavy tactical hinge rotation with rich golden glow
        if (pose === "opening") {
          hinge.position.set(0, 0.69, -0.85);
          hinge.rotation.set(-Math.min(1, elapsed / 450) * 1.9, 0, 0);

          beam.visible = true;
          beam.scale.set(1, 1, 1);
          beamMaterial.opacity = Math.min(0.16, elapsed / 3000);
          interiorLight.intensity = Math.min(1, elapsed / 450) * (isDesktop ? 7.5 : 3.5);
        } else if (pose === "revealed") {
          hinge.position.set(0, 0.69, -0.85);
          hinge.rotation.set(-1.9, 0, 0);

          beam.visible = true;
          beam.scale.set(1, 1, 1);
          beamMaterial.opacity = 0.16;
          interiorLight.intensity = isDesktop ? 6.5 : 3.0;
        } else {
          hinge.position.set(0, 0.69, -0.85);
          hinge.rotation.set(0, 0, 0);
          beam.visible = false;
          beam.scale.set(1, 1, 1);
          beamMaterial.opacity = 0;
          interiorLight.intensity = 0;
        }
      }
      core.scale.y = pose === "revealed" ? 1.8 : 1;

      // 3D particles animation
      if (particlePoints && particlePositions && particleVelocities) {
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
    if (
      pose === "shaking" ||
      (pose === "opening" && elapsed < 500) ||
      (isDesktop && pose === "revealed") ||
      isInteracting ||
      Math.abs(velY) > 0.0002 ||
      Math.abs(velX) > 0.0002
    ) {
      frame = requestAnimationFrame(animate);
    } else {
      frame = 0;
    }
  }

  // Original images are unchanged. Each face samples its own orthographic region;
  // a perspective thumbnail is never projected across the front of the chest.
  type Window = [number, number, number, number];
  type Face = { uv: Window; parent: THREE.Group; w: number; h: number;
    pos: [number, number, number]; rot: [number, number, number] };
  function loadFaces(file: string, faces: Face[]) {
    const image = new Image();
    image.onload = () => {
      if (disposed || failed) return;
      const texture = new THREE.Texture(image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      texture.needsUpdate = true;
      textures.add(texture);
      // Baked illustration lighting stays intact, without overexposure by scene lights.
      const mat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
      materials.add(mat);
      for (const face of faces) {
        const geometry = new THREE.PlaneGeometry(face.w, face.h);
        geometries.add(geometry);
        const uv = geometry.getAttribute("uv");
        for (let i = 0; i < uv.count; i++) {
          uv.setXY(i, face.uv[0] + uv.getX(i) * face.uv[2],
            1 - face.uv[1] - face.uv[3] + uv.getY(i) * face.uv[3]);
        }
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(...face.pos);
        mesh.rotation.set(...face.rot);
        face.parent.add(mesh);
      }
      canvas.dataset.art = "ready";
      draw();
    };
    image.onerror = () => { canvas.dataset.art = "unavailable"; };
    image.src = `/images/crates/surfaces/${file}`;
  }
  const front = (uv: Window): Face => ({ uv, parent: group, w: 2.46, h: 1.29,
    pos: [0, 0, 0.895], rot: [0, 0, 0] });
  const back = (uv: Window): Face => ({ ...front(uv), pos: [0, 0, -0.895], rot: [0, Math.PI, 0] });
  const side = (uv: Window, sign: number): Face => ({ uv, parent: group, w: 1.7, h: 1.29,
    pos: [sign * 1.255, 0, 0], rot: [0, sign * Math.PI / 2, 0] });
  const top = (uv: Window): Face => ({ uv, parent: hinge, w: 2.46, h: 1.7,
    pos: [0, 0.185, 0.85], rot: [-Math.PI / 2, 0, 0] });
  const lip = (uv: Window): Face => ({ uv, parent: hinge, w: 2.46, h: 0.19,
    pos: [0, 0.075, 1.756], rot: [0, 0, 0] });
  if (id === "crate_food") {
    loadFaces("food.png", [front([.016, .058, .326, .178]),
      back([.361, .058, .342, .178]),
      side([.727, .06, .255, .175], 1), side([.727, .06, .255, .175], -1),
      top([.371, .304, .287, .239]), lip([.017, .025, .325, .032])]);
  } else if (id === "crate_drinking") {
    loadFaces("party.png", [front([.018, .103, .346, .17]),
      back([.389, .102, .337, .171]),
      side([.833, .111, .149, .153], 1), side([.833, .111, .149, .153], -1),
      top([.359, .332, .298, .214]), lip([.018, .052, .346, .05])]);
  } else if (id === "crate_snack") {
    loadFaces("snack-front.png", [front([.025, .452, .95, .497]),
      back([.025, .452, .95, .497]), lip([.025, .326, .95, .11])]);
    loadFaces("snack-side.png", [side([.113, .453, .777, .49], 1), side([.113, .453, .777, .49], -1)]);
    loadFaces("snack-top.png", [top([.025, .182, .95, .64])]);
  }

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
      group.position.y = 0;
      hovered = false;
      metal.emissive.set("#000000");
      canvas.dataset.pose = next;
      started = performance.now();
      lastFrame = 0;
      cancelAnimationFrame(frame);
      animate(started);
    },
    hitTest(x, y) {
      if (disposed || failed) return false;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return false;
      scene.updateMatrixWorld(true);
      raycaster.setFromCamera(new THREE.Vector2(
        (x - bounds.left) / bounds.width * 2 - 1,
        -(y - bounds.top) / bounds.height * 2 + 1), camera);
      return raycaster.intersectObject(group, true).some(hit => hit.object instanceof THREE.Mesh && hit.object !== beam);
    },
    hover(active) {
      if (disposed || failed || pose !== "idle" || hovered === active) return;
      hovered = active;
      group.position.y = active ? 0.045 : 0;
      trim.emissive.set(active ? accent : "#000000");
      trim.emissiveIntensity = active ? 1.5 : 0;
      metal.emissive.set(active ? accent : "#000000");
      metal.emissiveIntensity = active ? 0.22 : 0;
      canvas.dataset.hovered = String(active);
      draw();
    },
    turn(direction, pitch = 0) {
      isInteracting = true;
      velY = direction * 0.35;
      velX = pitch * 0.35;
      angleY += direction;
      angleX = Math.max(-0.85, Math.min(0.75, angleX + pitch));
      group.rotation.y = angleY;
      group.rotation.x = angleX;
      group.rotation.z = Math.sin(angleY * 2) * angleX * 0.04;
      disk.rotation.y = angleY * 0.25;
      ring.rotation.z = angleY * 0.25;
      canvas.dataset.angle = `${angleY.toFixed(3)},${angleX.toFixed(3)}`;
      draw();
      clearTimeout(interactTimeout);
      interactTimeout = setTimeout(() => {
        isInteracting = false;
      }, 120);
      if (!frame) {
        frame = requestAnimationFrame(animate);
      }
    },
    setAngle(yaw, pitch) {
      isInteracting = false;
      velY = 0;
      velX = 0;
      angleY = yaw;
      angleX = Math.max(-0.85, Math.min(0.75, pitch));
      group.rotation.y = angleY;
      group.rotation.x = angleX;
      group.rotation.z = Math.sin(angleY * 2) * angleX * 0.04;
      disk.rotation.y = angleY * 0.25;
      ring.rotation.z = angleY * 0.25;
      canvas.dataset.angle = `${angleY.toFixed(3)},${angleX.toFixed(3)}`;
      draw();
    },
    zoom(delta) {
      targetCameraDist = Math.max(4.8, Math.min(9.5, targetCameraDist + delta));
      cameraDist = targetCameraDist;
      camera.position.z = cameraDist;
      camera.position.y = 2.2 + angleX * 0.6;
      camera.lookAt(0, 0.1, 0);
      draw();
    },
    resetRotation() {
      angleY = -0.42;
      angleX = 0.22;
      velY = 0;
      velX = 0;
      targetCameraDist = 6.8;
      cameraDist = 6.8;
      group.rotation.x = angleX;
      group.rotation.y = angleY;
      group.rotation.z = 0;
      disk.rotation.y = angleY * 0.25;
      ring.rotation.z = angleY * 0.25;
      camera.position.z = cameraDist;
      camera.position.y = 2.2 + angleX * 0.6;
      camera.lookAt(0, 0.1, 0);
      canvas.dataset.angle = `${angleY.toFixed(3)},${angleX.toFixed(3)}`;
      draw();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      for (const geometry of geometries) geometry.dispose();
      for (const mat of materials) mat.dispose();
      for (const texture of textures) texture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
