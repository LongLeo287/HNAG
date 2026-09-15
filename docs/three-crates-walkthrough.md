# Three.js crate integration

The Blindbox mode now has an interactive 3D crate with a hollow body, four walls,
rounded metal corners, latch hardware and a separate lid rotating about its rear hinge.
The food, snack and party crates use surface details from the owner's reference art.
Other crate types have procedural shells tinted to their existing crate theme.
This is a stylized reconstruction, not automatic photogrammetry or a production GLB
recovered from the images. Snack art currently covers the front panel; remaining snack
surfaces are modeled materials. Original source images and existing crate thumbnails
remain unchanged.

Choose **Blindbox**, then a crate. Rotation buttons let the user inspect the model.
Opening uses the existing timed shake/lid/reveal sequence and the same frozen result.
Rates, specialty provenance and FOOD/DRINK filters are not changed by the renderer.

## Performance and recovery

- Three.js 0.186.0 is a dynamic import scoped to Blindbox. The final renderer chunk is
  approximately 134 kB gzip; it is not requested on the default Case Reel path.
- One selected reference image is fetched when its 3D crate mounts. The unmodified
  PNGs are 2.36–2.73 MB each, so the first textured view can load slowly on mobile data.
  The procedural body renders while that image loads. These optional images are
  outside the pre-existing 285 kB food-illustration media budget.
- Pixel ratio is capped at 1.5; animation at 30 fps. Idle renders happen only for size,
  asset or view changes. Hidden tabs stop drawing; observers, listeners, animation
  frames, geometries, materials, textures and WebGL context are released on unmount.
- Reduced motion skips the renderer and its reference-image requests. WebGL loss or
  unavailable WebGL shows the existing image fallback. The reveal timer is independent
  of loading/GPU success, so a user can always reach and accept the selected result.
- An independent code review found a synchronous first-frame failure race. A failure
  latch now prevents a disposed renderer from hiding the image fallback; construction
  and initial-pose failures have dedicated regression tests.

## Validation

- Complete verify gate passed: typecheck, lint, 173 unit tests, catalog, media,
  boundaries, scope and production build.
- Full E2E suite passed 102 cases. Following mesh polish, all 12 Three.js cases were
  rerun, then rerun again after the failure-latch correction: real WebGL,
  rotate/open/result, WebGL unavailable, context loss/recovery and
  reduced-motion lazy loading across desktop/mobile/reduced-motion projects.
- `pnpm audit --prod`: no known vulnerabilities. The package version is pinned and
  the upstream MIT notice is included alongside the reference asset provenance.
- Direct browser inspection: desktop and 390x844 phone, correct model/theme changes,
  readable rotation controls, no blank/error overlay, no relevant console warnings.
  This is browser/emulation evidence, not physical iPhone/Android GPU certification.

Primary references: [Three.js repository](https://github.com/mrdoob/three.js/),
[API documentation](https://threejs.org/docs/),
[MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE).

All changes stay in the independent `codex/rarity-latest` worktree. No merge, push or
Vercel deployment has been performed. The original project retains the user's data folder.

TASK COMPLETED
