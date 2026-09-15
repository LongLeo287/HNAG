import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { CrateId } from "@/data/crates";

export type CratePose = "idle" | "shaking" | "opening" | "revealed";
export interface CrateScene {
  pose: (pose: CratePose) => void;
  turn: (direction: number) => void;
  dispose: () => void;
}

/** Original low-poly hollow case with a physical rear hinge. Images are surface
 * references supplied by the user; no mesh/model service or remote assets are used. */
export function createCrateScene(host: HTMLElement, id: CrateId, accent: string,
  onFailure: () => void): CrateScene {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { antialias: false, alpha: true });
  if (!context) throw new Error("WebGL2 unavailable");
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvas.style.cssText = "width:100%;height:100%;display:block";
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.testid = "three-crate-canvas";
  host.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.set(0, 2.5, 6.8);
  camera.lookAt(0, .25, 0);
  scene.add(new THREE.HemisphereLight(0xdcecff, 0x33303d, 3));
  const light = new THREE.DirectionalLight(0xffe0a3, 4);
  light.position.set(-3, 5, 4); scene.add(light);
  const rim = new THREE.DirectionalLight(0x8bcaff, 3);
  rim.position.set(3, 1, -3); scene.add(rim);

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const material = (color: string, metalness = .35) => {
    const value = new THREE.MeshStandardMaterial({ color, metalness, roughness: .55 });
    materials.add(value); return value;
  };
  const shell = material(id === "crate_snack" ? "#b92227" : id === "crate_drinking" ? "#344438" : "#202830");
  const metal = material("#c99842", .75);
  const dark = material("#090e14");
  const trim = material(accent, .45);
  const group = new THREE.Group();
  group.rotation.y = -.42; scene.add(group);
  function box(parent: THREE.Group, x: number, y: number, z: number,
    w: number, h: number, d: number, mat: THREE.Material) {
    const geometry = new RoundedBoxGeometry(w, h, d, 2, Math.min(.04, w / 4, h / 4, d / 4)); geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry, mat); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }
  // Bottom and four walls: the interior remains visible when the lid lifts.
  box(group, 0, -.65, 0, 2.5, .15, 1.75, dark);
  box(group, 0, 0, .83, 2.5, 1.3, .12, shell);
  box(group, 0, 0, -.83, 2.5, 1.3, .12, shell);
  box(group, -1.19, 0, 0, .12, 1.3, 1.7, shell);
  box(group, 1.19, 0, 0, .12, 1.3, 1.7, shell);
  for (const x of [-1.16, 1.16]) for (const z of [-.83, .83]) {
    box(group, x, 0, z, .13, 1.35, .16, metal);
    for (const y of [-.6, .58]) box(group, x, y, z, .23, .2, .23, metal);
  }
  for (const x of [-.85, .85]) {
    box(group, x, .1, .93, .15, 1.2, .08, dark);
    box(group, x, .42, .99, .22, .35, .08, metal);
  }
  const hinge = new THREE.Group(); hinge.position.set(0, .69, -.85); group.add(hinge);
  box(hinge, 0, .08, .85, 2.54, .2, 1.8, shell);
  for (const z of [0, 1.7]) box(hinge, 0, .13, z, 2.56, .08, .08, metal);
  for (const x of [-1.2, 1.2]) box(hinge, x, .13, .85, .08, .08, 1.75, metal);
  box(hinge, 0, .23, .8, .9, .12, .13, dark);
  for (const x of [-.4, .4]) box(hinge, x, .17, .8, .12, .18, .16, metal);

  const diskGeo = new THREE.CylinderGeometry(1.9, 2.05, .12, 48); geometries.add(diskGeo);
  const disk = new THREE.Mesh(diskGeo, dark); disk.position.y = -.85; scene.add(disk);
  const ringGeo = new THREE.TorusGeometry(1.85, .018, 6, 64); geometries.add(ringGeo);
  const ring = new THREE.Mesh(ringGeo, trim); ring.rotation.x = Math.PI / 2; ring.position.y = -.77; scene.add(ring);
  const core = box(group, 0, -.35, 0, 2.12, .12, 1.35, trim);

  let disposed = false;
  let failed = false;
  let frame = 0;
  let pose: CratePose = "idle";
  let started = performance.now();
  let angle = -.42;
  let lastFrame = 0;
  const fail = () => { if (!disposed && !failed) { failed = true; cancelAnimationFrame(frame); onFailure(); } };
  const draw = () => {
    if (disposed || failed || document.hidden) return;
    try { renderer.render(scene, camera); } catch { fail(); }
  };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (width <= 0 || height <= 0 || disposed) return;
    camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setSize(width, height, false); draw();
  };
  function animate(now: number) {
    if (disposed || failed || document.hidden) return;
    const elapsed = now - started;
    if (now - lastFrame >= 1000 / 30) {
      lastFrame = now;
      group.rotation.y = angle;
      group.rotation.z = pose === "shaking" ? Math.sin(elapsed * .035) * .04 : 0;
      hinge.rotation.x = pose === "opening" ? -Math.min(1, elapsed / 450) * 1.9 : pose === "revealed" ? -1.9 : 0;
      core.scale.y = pose === "revealed" ? 1.8 : 1;
      draw();
    }
    if (pose === "shaking" || (pose === "opening" && elapsed < 500)) frame = requestAnimationFrame(animate);
  }
  // UV windows sample the original reference files directly. No generated image is
  // misrepresented as a captured 3D mesh; back/side depth and hinge are geometry.
  type Window = [number, number, number, number]; // x,y,width,height in top-left normalized image space
  function panel(image: HTMLImageElement, uv: Window, parent: THREE.Group,
    width: number, height: number, position: [number,number,number], rotation: [number,number,number]) {
    const texture = new THREE.Texture(image); textures.add(texture);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.offset.set(uv[0], 1 - uv[1] - uv[3]); texture.repeat.set(uv[2], uv[3]); texture.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({map:texture, roughness:.65, metalness:.15}); materials.add(mat);
    const geometry = new THREE.PlaneGeometry(width, height); geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry,mat); mesh.position.set(...position); mesh.rotation.set(...rotation); parent.add(mesh);
  }
  const art = id === "crate_food" ? "food" : id === "crate_snack" ? "snack" : id === "crate_drinking" ? "party" : undefined;
  if (art) {
    const image = new Image();
    image.onload = () => {
      if (disposed || failed) return;
      if (art === "snack") {
        panel(image,[.17,.48,.64,.35],group,1.68,1.03,[0,0,.901],[0,0,0]);
      } else {
        panel(image,art === "food" ? [.095,.07,.17,.15] : [.06,.075,.26,.175],group,1.72,1.1,[0,0,.901],[0,0,0]);
        panel(image,art === "food" ? [.77,.08,.19,.13] : [.77,.10,.19,.14],group,1.35,1.07,[1.255,0,0],[0,Math.PI/2,0]);
        panel(image,art === "food" ? [.77,.08,.19,.13] : [.77,.10,.19,.14],group,1.35,1.07,[-1.255,0,0],[0,-Math.PI/2,0]);
        panel(image,art === "food" ? [.39,.08,.27,.14] : [.40,.08,.26,.17],group,2.12,1.07,[0,0,-.901],[0,Math.PI,0]);
        panel(image,art === "food" ? [.39,.33,.26,.20] : [.4,.345,.23,.18],hinge,2.12,1.32,[0,.185,.85],[-Math.PI/2,0,0]);
      }
      draw();
    };
    image.onerror = () => { /* Procedural materials remain a complete local fallback. */ };
    image.src = `/images/crates/reference/${art}.png`;
  }
  const observer = new ResizeObserver(resize); observer.observe(host);
  const contextLost = (event: Event) => { event.preventDefault(); fail(); };
  canvas.addEventListener("webglcontextlost", contextLost);
  const visibility = () => { cancelAnimationFrame(frame); if (!document.hidden) { lastFrame = 0; animate(performance.now()); } };
  document.addEventListener("visibilitychange", visibility);
  resize();
  return {
    pose(next) { pose = next; started = performance.now(); lastFrame = 0; cancelAnimationFrame(frame); animate(started); },
    turn(direction) { angle += direction * Math.PI / 6; group.rotation.y = angle; draw(); },
    dispose() {
      if (disposed) return;
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      for (const geometry of geometries) geometry.dispose();
      for (const mat of materials) mat.dispose();
      for (const texture of textures) texture.dispose();
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
