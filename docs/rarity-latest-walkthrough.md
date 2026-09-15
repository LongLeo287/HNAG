# Current-source rarity improvement

Completed on 2026-09-12 in the independent `codex/rarity-latest` worktree. The base is `abe221d978cdc782047235fbdb5959d4ef883579`, matching the freshly checked `main` of [LongLeo287/HNAG](https://github.com/LongLeo287/HNAG). GitHub's production deployment status for that commit is successful. The public [Vercel app](https://homnayangi-kappa.vercel.app/) was inspected and has the expanded catalog and five-crate layout. Asset hashes differ from the local build; binary identity is not claimed.

The previous review copy had only 77 items. This change uses the current **1,731 items: 1,551 FOOD and 180 DRINK**, including 1,654 items with contextual metadata. The dataset, crate definitions and all five reveal modes are preserved. The later device-context correction is documented in `docs/device-context-walkthrough.md`. The original `main` checkout is clean; this local improvement has not been merged, pushed or deployed.

## Findings and changes

The original engine selects each item uniformly in NONE/HARD_MAX mode. Rarity frequencies therefore follow the number of items in each tier. The complete catalog has 1,413 THUONG, 114 NGON, 193 DINH and 11 HUYEN_THOAI items. Context filters can greatly increase the share of high-tier candidates even though the full-catalog share looks moderate.

For breakfast, SUNNY_HOT, WEEKEND and ALL locations, the first-draw probabilities for the two highest tiers were:

| Crate | Eligible items | Old DINH + HUYEN_THOAI | New DINH + HUYEN_THOAI |
| --- | ---: | ---: | ---: |
| Main meal | 301 | 24.9169% | 4% |
| Drinks | 43 | 16.2791% | 4% |
| Snacks | 148 | 2.0270% | 3.5176% |
| Shared meal / BBQ | 33 | 18.1818% | 4% |
| Vegetarian | 18 | 0% | 0% |

These are one explicit context, not a claim about every time or filter. A common tier schedule makes the snack high-tier share slightly higher than its previous 2.03%; the main-meal, drink and BBQ shares are substantially lower. No catalog items were relabeled to manipulate these counts.

`randomizer-v2.0.0` allocates **80% common, 16% rare, 3.5% epic, 0.5% legendary** when all four tiers are present. Each tier's share is divided among its eligible candidates. TARGET retains the existing price-fit formula but applies it only within a tier, so a price target cannot amplify a tier's total chance. Missing tiers receive zero; available tiers are normalized. A pool containing only legendary items must still return legendary items, and the displayed odds state that actual probability.

Re-spin and opening again after accepting exclude the previous item only when another item of the same tier remains. This prevents a two-item common/legendary pool from being forced to alternate. A singleton tier can repeat. Empty pools, unknown prices and hard budget ceilings retain their existing domain behavior.

The UI now displays actual probabilities after the active pool filters and repeat exclusion, both below the open button and beside the repeat action. Frozen probabilities travel with the frozen winner and feed the cosmetic reel, wheel and slot strips. Names consistently express rarity without changing persisted enum keys. The result modal uses the winner's tier color and scrolls within the viewport. Changing FOOD/DRINK through the controls now switches the active crate too.

## Validation

- Baseline: 103 tests and the full verification gate passed on the current source.
- Red regression: five of six new rarity tests failed on v1, demonstrating the selection, price weighting and repeat problems.
- Final `pnpm verify`: **119 tests in 22 files**, typecheck, lint, catalog/media validation, architecture boundaries, scope gate and production build all passed.
- Expanded-catalog tests cover **675 combinations**: five crates, five meal periods, three weather settings, three locations and three budget modes. They check available-tier preservation through repeat exclusion, finite positive probabilities, normalization and real-engine pool membership.
- **100,000 deterministic real-engine draws**, 20,000 per crate, including sequential previous-winner exclusion, passed a six-standard-deviation statistical tolerance. Exact settings, counts and outcomes are in [rarity-audit-latest.json](./rarity-audit-latest.json). This is a simulation of the current code, not production telemetry.
- Final `pnpm e2e`: **45 passed** across desktop Chromium, Pixel 7 and reduced motion. Coverage includes all five crates and five reveal modes, displayed odds through open/repeat/accept, kind switching, empty-budget recovery, storage/audio failure, counter persistence, 320px width and no external requests during the game loop.
- Manual browser inspection confirmed the current five-crate interface and odds panel on the new local build. Preview: `http://127.0.0.1:4187/`.

## Mobile app-link follow-up: 2026-09-14

Delivery buttons now select native iOS links or package-scoped Android Intents from
`src/lib/external-app-links.ts`. GrabFood receives the selected dish name; the other
delivery apps use verified home routes with explicit dish-name copying. A store link
is available after a mobile attempt. See [provider evidence](./reference-notes/truanayangi-mechanics.md).

The final combined branch passed `pnpm verify` with **131 tests in 23 files** and
`pnpm e2e` with **51 tests**. Mobile link tests intercept native navigation on the
desktop host: these results verify URLs, click handling, recovery links and preserved
winner state, not an installed app launching on physical iPhone/Android hardware.

Manual inspection also found horizontal overflow from decorative result-card rays.
Their width is now bounded; browser tests check the actual scrolling modal at both
320px and 390px. Desktop and responsive previews rendered without app console errors.
The StrictMode animation regression test now advances a simulated RAF/performance
clock, eliminating the observed wall-clock timeout under parallel test load.

The updated production bundle is 1,199.79 kB raw / 205.51 kB gzip. The existing
large-chunk warning remains. No dependency was added; no push, merge or deployment
has been performed.

## Reproduce

From this worktree, using Node 24 and the pinned pnpm version:

```sh
pnpm install --frozen-lockfile
pnpm verify
pnpm exec tsx --tsconfig tsconfig.app.json scripts/audit-rarity.ts
pnpm e2e
pnpm preview --host 127.0.0.1 --port 4187 --strictPort
```

Browser tests use a separate strict port, 4188, and refuse to reuse an existing server. This prevents another checkout's preview from producing a false pass.

## Remaining current-source issues

The hour-based weather guess and silent broader-pool fallback found during this rarity review were subsequently removed in the device-context correction. That follow-up displays actual device facts and makes suggestion filtering explicit. Day-type matching remains a separate pure utility; the UI does not claim to filter by weekday. See `docs/device-context-walkthrough.md` for the combined validation and current behavior.

The imported catalog also needs an editorial review of category, vegetarian and rarity assignments. For example, DINH has more catalog entries than NGON; the new probability algorithm makes tier frequency independent of that imbalance, but does not certify the metadata. The production build retains the existing large-chunk warning: final JS is 1,196.68 kB raw / 204.27 kB gzip, versus 1,194.13 / 203.39 at baseline. No dependencies were added.

TASK COMPLETED
