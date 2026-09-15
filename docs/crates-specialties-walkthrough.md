# Crates and regional specialties delivery

Implemented and verified on 2026-09-15 in the independent `codex/rarity-latest` worktree.
This follows the user's request to keep improvements separate from concurrent work.
Nothing has been committed, pushed, merged or deployed by this task.

## Delivered

- FOOD/DRINK choice precedes the crate rack. Four food crates and two drink crates
  isolate refreshments from alcohol; categories follow the active crate.
- Shared hard filters drive displayed counts, previews and draws. Selection persists
  across reload; a kind change clears the stale revealed winner. Reset returns to the
  default crate. Opening no longer silently enables sound.
- 343 reviewed catalog overrides, 18 categories and nine excluded ambiguous/condiment
  records. See [classification review](reference-notes/catalog-classification.md).
- 39 sourced regional entries with half within-tier weight, actual aggregate odds,
  distinct cards/effect/three regional synthesized chimes and frozen winner probability.
  See [source and behavior notes](reference-notes/regional-specialties.md).

## Verification

- `pnpm verify`: passed typecheck, lint, 169 unit/property/statistical tests, catalog and
  media validation, feature boundaries, scope checks and production build.
- `pnpm e2e`: 90/90 passed across desktop Chromium, mobile Chromium and reduced-motion
  projects. Includes all six crates, five reveal modes, budget/count agreement,
  food/drink switching after a revealed result, reload persistence, muted specialty
  reveal and the earlier device-context/native-link regression cases.
- Direct in-app browser inspection at desktop 1280x900 and phones 390x844/320x740: four food
  cards, two separate drink cards, readable wrapped titles, correct category switching,
  explicit empty pool under context filtering and no page horizontal overflow.
- Browser console: no warning/error entries during those interactions.
- Inspected the captured mobile specialty winner: locality seal, rarity badge, source
  link and frozen probability render together. This screenshot uses a test-only pool
  containing one real catalog item, so its 100% is expected. Production does not force
  that result. Muting and regional note sequences are covered by audio unit tests;
  physical iPhone/Android speaker output was not tested.

The first count E2E incorrectly expected a sub-30k bun item. It was corrected to the
catalog's sub-30k bread category; the application correctly returned zero for the original
filter. The complete E2E suite then passed. No application fallback was added.

## Remaining limits

Specialty coverage is intentionally source-backed and incomplete, not every regional
dish in the archive. Imported prices and images remain reference/illustration data,
not live restaurant facts. The pre-existing large-bundle build warning remains; no new
dependency or lockfile changes were needed. Desktop emulation does not prove physical
mobile app launch behavior or live weather-provider availability. Public Vercel remains
unchanged until this independent branch is integrated and deployed.

TASK COMPLETED
