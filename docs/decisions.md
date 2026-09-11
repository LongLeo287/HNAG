# Decisions / open items

Per the master prompt's NO-GUESS PROTOCOL (`CODE-045`): no genuine unresolved P0 M0/M1
contradiction blocked any part of this build. The items below are non-blocking notes, not
open P0 questions.

## Toolchain version deviation (not a P0 blocker)

`27_BUILD_READINESS`/`STACK-*` locks Node 24.x LTS + pnpm 12.3.4. This build environment has
**Node v22.22.3** and **pnpm 11.22.0** installed. `package.json` still declares the spec's target
(`engines: ">=24 <25"`, `packageManager: "pnpm@12.3.4"`) so CI (which pins Node 24 / pnpm 12.3.4
via `actions/setup-node` and `pnpm/action-setup`) runs on the locked baseline. Local verification
in this session ran on the actually-installed Node 22 / pnpm 11 toolchain instead — flagged here
per "evidence before assertion" so the discrepancy isn't silently asserted as a pass on 24.x.

## M5/M6 monetization vs. permanent non-commerce (pre-existing spec tension, not a build blocker)

The independent #HNAG audit (2026-09-10) noted that `RM-006`/`RM-018` (M5 merchant tools,
M6 sponsored/affiliate surfaces) sit next to `PV-005`/`IDX-039`'s "permanent non-commerce ...
at any phase" rule. Sponsored/affiliate placement is not itself a cart/checkout/payment surface,
so it does not contradict `CODE-024` as implemented — but this is M5/M6 scope, entirely out of
this M0/M1 build, and is recorded here only so a future session revisits it before M5 starts
rather than assuming it was already resolved.

## Audio assets

`RS-055` expects shipped `public/sfx/*` audio files. This build instead synthesizes tick/reveal
tones at runtime via the Web Audio oscillator API (`src/features/audio/gameAudio.ts`) — see that
file's header comment and `docs/reference-notes/truanayangi-mechanics.md` item #8 for the
rationale. The public `GameAudio` interface is unchanged, so swapping in produced SFX files later
does not require touching any caller.

## Typography: self-hosted Be Vietnam Pro (resolved)

`DS-007`/`BR-007` name Be Vietnam Pro. The first pass loaded it via a Google Fonts `@import`,
but `pnpm e2e` caught that as a real external network request, conflicting with `RANK-033`/
`CODE-036` and this build's own E2E assertion of zero external calls. Resolved by self-hosting
the licensed `.woff2` files under `public/fonts/` (`latin` + `vietnamese` subsets, weights
400/500/600/700, SIL OFL 1.1 — see `public/fonts/README.md` and `OFL.txt`) with local
`@font-face` rules in `globals.css`. Zero runtime network dependency, brand typography intact.

## Placeholder favicon (BR-010/BR-037)

`BR-037` explicitly allows a temporary placeholder: *"Claude Code may use temporary text
wordmark + simple placeholder icon until final logo asset is user-approved."* Added
`public/favicon.svg` — a minimal monochrome bowl-rim-forms-the-"?" mark per the `BR-004`
concept — clearly commented as a placeholder, not a final logo. Replace once a real logo is
chosen from `20_BRAND_LOGO`'s exploration process (human trademark review required first,
`BR-028`/`SEC-013`).

## Distribution test tolerance corrected to the exact QA-009 formula

The first pass of `draw.test.ts` used ad-hoc ±8%/±0.03 tolerances for the 100k+/120k-draw
distribution tests. `23_PERFORMANCE_QA` (`QA-009`) specifies an exact bound —
`max(0.005, 5*sqrt(p*(1-p)/N))` — which is tighter than what was originally tested. Both tests
now use that formula (`src/test/statistics.ts`) at the spec's own `N=100000`, and still pass
comfortably (the floor of 0.005 is roughly 10 standard errors away from these pools' expected
frequencies, so this is not a flaky tightening).

## Audio-unavailable resilience test added (QA-024)

`gameAudio.ts` already degraded silently when `AudioContext` is missing or throws, but nothing
asserted it. Added `src/features/audio/gameAudio.test.ts` covering: no `AudioContext` at all,
`AudioContext` constructor throwing, and muted state never touching the Web Audio graph.

## Additional pre-existing sheet contradictions found on a second read (not build blockers)

Same category as the `TECH-030`/`RM-009`/`IDX-042` duplicate-ID rows already flagged in the
original #HNAG audit — evidence the sheet is still accumulating unpruned legacy rows faster than
it's being cleaned:
- `21_SEO_ANALYTICS` tags `ANA-001..008` (basic funnel events) as `P0`/`M1`, contradicting
  `BRD-008`/`CC-016`/the master prompt's explicit "no analytics vendor requirement" for M1.
  `27_BUILD_READINESS` outranks `21_SEO_ANALYTICS` in the read-order precedence, so this build
  correctly ships no analytics — but the row itself should be corrected or removed.
- `24_DEVOPS_VERCEL` (`OPS-002`, `OPS-005/006`, `OPS-010`, `OPS-016`) is written entirely for the
  pre-correction Next.js 16.3.3 + Supabase Postgres/PostGIS architecture and was never updated
  after the 2026-09-10 game-first re-audit. `27_BUILD_READINESS`/`STACK-*` again outrank it, so
  none of it applied here, but the whole tab reads as stale and should be rewritten for the
  actual Vite-static-SPA deployment target before anyone relies on it for a real Vercel setup.

## Playwright browser binaries

`pnpm exec playwright install chromium` was run in this session and `pnpm e2e` passes (9/9 across
desktop/mobile/reduced-motion projects) against a production `pnpm build` + `vite preview`. CI's
`e2e` job installs browsers the same way via `playwright install --with-deps chromium`.

## Dark CS2-style visual/audio identity — explicit user decision, 2026-09-11

The user asked directly to make #HNAG look and sound like truanayangi/CS2's case-opening
identity ("tôi muốn giống vậy"), after being told this reverses `PV-015` ("Non-goal: Không
clone... brand của truanayangi/CS2"), `DS-001`/`DS-002`/`DS-005` (warm light theme, "do not
mimic CS2/truanayangi dark lime identity") and `CODE-039`/`CODE-040` (no CS-style look). The
user chose the full option — dark theme *and* similar-feeling audio — with the caveat (already
true of every prior build decision) that no actual truanayangi/CS2 source, CSS, artwork or sound
files would be copied; only the visual/audio *genre* would move to match.

**What changed:**
- `src/app/globals.css` — permanent dark theme (no light/adaptive mode), radial-gradient
  background, new original rarity color ladder (steel/grey → rare/blue → epic/purple →
  turmeric/gold) replacing the old leaf-green/chili-red rarity mapping.
- `src/lib/rarity.ts` — tier styling updated to the new ladder. Tier *names* stay #HNAG-original
  (Thường/Ngon/Đỉnh/Huyền Thoại) — the user asked for the visual/audio genre, not Valve's rarity
  nomenclature, and `RANK-029` (rarity is presentation-only, never a value claim) still applies.
- `src/features/audio/gameAudio.ts` — crisper square-wave tick (was a plain sine blip) and a
  reveal cue that now scales with rarity (an added rising sweep + a longer chord for
  Đỉnh/Huyền Thoại), all still synthesized at runtime — no CS:GO or truanayangi sample audio.
- `src/components/ui/{Button,Chip,Dialog}.tsx`, `FoodDrinkToggle.tsx`,
  `src/features/reveal/{themes/case-reel/{CaseReel,ReelItemCard}.tsx,ui/RevealCard.tsx}` —
  recolored for the dark surface (new `--color-paper` token for text-on-accent, since the old
  `canvas-100` token flipped meaning from "light background" to "darkest panel"; dialog backdrop
  fixed to a literal black overlay instead of the now-inverted `ink-900` token).

**What did *not* change:** `PV-015`'s actual hard boundary — no file, asset, exact color hex,
CSS rule, sound sample, or rarity name was copied from truanayangi or CS2. The precedent this
sets is scoped to visual/audio genre only, not a general license to copy that or any other repo.

**If you want the source-of-truth sheet to match:** this build does not (and should not, without
being asked) auto-edit the live 34-tab Google Sheet — the rows a maintainer would want to update
by hand are `PV-015`, `DS-001`, `DS-002`, `DS-003`, `DS-005`, `DS-006`, `CODE-039`, `CODE-040`,
and optionally `BR-008`/`BR-009`/`BR-031` (brand palette/logo guidance, still unaffected in
principle since no logo asset was copied either).

## Pre-spin "Unlock Container" layout (user reference 2026-09-11)

The user shared a screenshot of real CS2 UI (not truanayangi's site) — the "Unlock Container"
screen: a big case sitting in a 3D scene, then a "Contains one of the following" grid of every
possible drop with photo + rarity-colored bar beneath each. Asked for the same structure, with
Vietnamese landmarks as a user-selectable backdrop (in place of CS2's 3D environment) and
food/drink photos as the item images.

**Implemented (this session), all original assets:**
- `src/components/ui/HeroBox.tsx` — a Vietnamese three-tier lunch carrier ("cà mèn") standing in
  for the weapon crate; the front decal reuses the bowl-rim-"?" mark from `public/favicon.svg`.
- `src/components/ui/LandmarkScene.tsx` + `src/data/backgrounds.ts` — six flat-silhouette scenes
  (Hồ Gươm, Chợ Bến Thành, Cầu Rồng, Vịnh Hạ Long, Hội An, Chợ nổi Cái Răng), user-selectable via
  `BackgroundPicker.tsx` and persisted (`Preferences.backgroundId`, additive/defaulted field —
  no `SCHEMA_VERSION` bump needed).
- `src/features/game/ui/PoolPreviewGrid.tsx` — a "Trong hộp có thể có (N)" strip showing the
  *current* eligible pool (same `applyHardFilters` the real draw uses, so it never claims an
  item is possible when OPEN couldn't actually land on it) with the same art+name+price+rarity-bar
  card used elsewhere.

**Not implemented, and why:** real photography for 53 catalog items and photoreal 3D landmark
scenes. No image-generation tool is available in this environment, and licensed real photography
requires a rights-managed sourcing pass this session can't do — see `public/fonts/README.md` and
`docs/reference-notes/truanayangi-mechanics.md` for the same provenance concern applied to
audio/fonts. `CategoryArt.tsx`/`LandmarkScene.tsx` (flat hand-authored SVG, one illustration per
category/landmark rather than per item) is the compliant stand-in for now (`DS-025`: "AI
illustration may represent canonical generic dish... owned illustrative fallback" is explicitly
sanctioned when real photography isn't available). Swapping in real photography later only means
changing what `CategoryArt`/`LandmarkScene` render — every caller already expects a component,
not a raw image path.

**Scope note:** `PoolPreviewGrid` shows a list of items on the main game screen, which brushes up
against `PV-026`/`UI-003`'s "no browseable item list by default." It is kept compliant by scope:
it shows only the *current session's* eligible pool (no search/sort/pagination, no persistent
route), it disappears the moment OPEN is pressed, and OPEN remains the larger, higher, primary
control above it (`CODE-039`). If a future session wants to remove it, deleting the one
`<PoolPreviewGrid>` line in `GameShell.tsx` fully reverts this.
