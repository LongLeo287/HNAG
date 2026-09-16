# CLAUDE.md — #HNAG agent instructions

## Workspace and delivery (user instruction, 2026-09-16)

Use this repository as the only active HNAG folder. Do not create sibling copies or
additional worktrees. Analyze current code first, preserve source assets, and commit
and push each coherent, tested milestone. See `docs/workspace-policy.md`.

Source of truth: the `#HNAG` planning spreadsheet (34 tabs, `00_INDEX` → `34_DECISION_RANKING_V1`).
This file is a short, executable summary — read the sheet itself for full detail. When code and
this file disagree, this file (derived from `27_BUILD_READINESS`) wins for M0/M1.

## What #HNAG is

A Vietnam-first **random/blindbox decision game** for "what to eat/drink today" — not a
restaurant directory, catalog, or data platform. Core loop: choose FOOD/DRINK + optional
filters/personal pool → OPEN/SPIN → winner frozen → case-reel suspense → reveal → Accept or
Re-spin.

## Current rarity contract (user request, 2026-09-12)

The user explicitly requested fewer high-rank outcomes on the current 1,731-item build.
`randomizer-v2.1.0` supersedes the spreadsheet's uniform-per-item and presentation-only
rarity rules: allocate 80% / 16% / 3.5% / 0.5% to available tiers, normalize missing tiers,
then apply regional-specialty weight (0.5 versus ordinary 1) and TARGET price fit only
inside each tier. These are relative item weights, not fixed aggregate specialty odds.
Re-spin excludes the previous item
only if another eligible item of that same tier exists. Display the actual filtered odds.
Persisted rarity keys remain unchanged. See `docs/rarity-latest-plan.md`.

## Permanent invariants (do not relitigate these)

- No cart/order/checkout/payment/wallet/delivery-tracking, ever, in any phase (`CODE-024`).
- Winner is selected and **frozen before** any reveal animation/SFX/rarity code runs
  (`CODE-019`). Reveal code can read `frozenSelection.winner`; it can never choose or replace it.
- All budget modes use the current rarity contract above. NONE/HARD_MAX apply specialty
  weights within each tier; TARGET additionally applies price fit using
  `src/features/randomizer/domain/weighting.ts`.
- `HARD_MAX` is a true ceiling (unknown-price items excluded, never treated as free). `TARGET` is
  a separate "around this price" mode. Never blur the two in code or copy.
- Re-spin excludes only the immediately-previous winner, and only when another eligible item
  of the same tier exists (v2 update to `RANK-015`).
- Rarity controls frequency; it must never claim food quality/value.
- Respect `prefers-reduced-motion`: short (`<=600ms`) non-sliding reveal, same frozen winner.
- Sound is enhancement only; audio failure/mute never blocks OPEN/reel/reveal/re-spin.

## Device context exception (user request, 2026-09-14)

The user explicitly requires real device time, weekday/date, Vietnamese lunar date,
geolocation and current weather. `src/features/context` may use permission-gated browser
geolocation and read-only BigDataCloud/Open-Meteo requests. No IP fallback, invented
weather, default city or persisted precise coordinates. Unknown/stale/error states must
remain explicit. This exception supersedes the older GPS/network prohibition below for
this bounded feature only. See `docs/device-context-plan.md`.

## M0/M1 scope boundary

**No** database, application API, auth/login, GPS/location, Google Maps/Places SDK,
delivery-provider integration, analytics vendor, or `.env` file. `scripts/check-scope.ts` and
`scripts/check-boundaries.ts` enforce parts of this mechanically; both run in `pnpm verify` and CI.

`28_DB_SCHEMA_V1`, `src/features/providers`, `src/features/discovery`, `src/features/maps`,
`src/features/location`, `src/features/auth`, `src/db`, `src/app/api` are all **out of scope**
until a future session explicitly promotes a new phase — do not create them speculatively.

## Reference project boundary

`truanayangi-com/truanayangi` is a **mechanics reference only** (see
`docs/reference-notes/truanayangi-mechanics.md` for the LEARN/ADAPT/REJECT breakdown). It ships
with no LICENSE file, and its own `ATTRIBUTION.md` states its audio is literal CS:GO game
content it doesn't hold a redistribution license for. Never copy its source, exact
constants/timing/easing, audio files, branding, or CSS. `src/components/ui/*` deliberately does
not depend on `@base-ui/react` even though the reference project (and this spec's `STACK-004`)
do, to keep #HNAG's dependency footprint independent of the reference repo's specific choices —
see `docs/implementation-plan.md`.

By explicit user decision (2026-09-11, see `docs/decisions.md`), #HNAG's **visual/audio genre**
now deliberately matches the dark case-opening identity (dark theme, rarity color ladder,
scroll-tick + rarity-scaled reveal cue) — this supersedes `PV-015`/`DS-001..006`/`CODE-039/040`'s
"warm light theme, no CS look" default for this build. The no-copying boundary above is
unaffected: original colors/tier names/synthesized audio only, still zero files/constants from
either repo.

## Commands

```
pnpm dev            # local dev server
pnpm verify         # typecheck + lint + test + validate:catalog + check:boundaries + check:scope + build
pnpm test           # Vitest unit/property/statistical tests
pnpm e2e            # Playwright (run `pnpm exec playwright install` once first)
```

## Directory boundaries (RS-019/RS-020/RS-021, enforced by `scripts/check-boundaries.ts`)

- `src/features/randomizer/domain/` — pure TypeScript. No React/DOM/audio/storage imports.
- `src/features/reveal/` — presentation only. Never re-implements winner selection.
- `src/features/pool/`, `src/lib/local-preferences/` — the only places that touch the pool /
  `localStorage` respectively.
