# Three.js crate integration

The authorized scope is a real, lightweight 3D crate for the Blindbox mode, using the
user's supplied food/snack/party reference art. Build hollow walls, hardware and a
separate hinged lid; use the supplied artwork as surface textures, not a flat rotating
image. Other crate types use clearly named procedural materials until artwork exists.

Load Three.js only when Blindbox is selected. Cap pixel ratio and animation frame rate,
render idle views on demand, release GPU resources on unmount, and retain a usable
image/CSS fallback for WebGL or loading failure. Reduced motion skips 3D. The existing
reveal timer owns completion, independent of texture loading and GPU availability.
Frozen winner, rarity rates and food/drink filters remain authoritative.

Validate real WebGL rendering, fallback, reduced motion, opening completion, changing
crates, desktop/mobile sizing, bundle splitting and dependency provenance. Reference:
https://github.com/mrdoob/three.js/ (MIT); use the published npm package and preserve its
license. No external model service, uploads or remote textures are required.

## Completed

- [x] Install and pin the official Three.js package and TypeScript declarations.
- [x] Map supplied artwork onto an original hinged, hollow 3D crate.
- [x] Integrate idle inspection and the existing frozen Blindbox reveal lifecycle.
- [x] Verify fallback, context loss, reduced motion and resource disposal.
- [x] Pass full verification, 102 E2E cases and final targeted 12-case rerun.
- [x] Inspect desktop/mobile output and document asset provenance and limits.

See [delivery notes](three-crates-walkthrough.md).
