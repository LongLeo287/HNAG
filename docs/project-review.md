# #HNAG project review - 2026-09-11

## Decision

Keep #HNAG focused on making an enjoyable food/drink decision quickly. The strongest immediate
improvements are reliable recovery, correct local data, lighter media and a clear primary action.
The current local app has those fixes implemented and tested. Deployment readiness still depends
on a chosen production domain, real-device checks and reconciliation of the source specification.

## Evidence and scope

- **Workbook:** live metadata and 35 tabs were read, containing 1,254 nonempty data rows.
  See [coverage, conflicts and exact source rows](workbook-reconciliation.md).
- **Public reference:** [truanayangi-com/truanayangi](https://github.com/truanayangi-com/truanayangi),
  verified at `2e10968abfcee2cabc0b01fcf0535ac4aa31b16d`. Architecture and core mechanics were
  reviewed; this was not an exhaustive security audit of every repository file.
- **Live reference:** [truanayangi.com](https://truanayangi.com/) loaded successfully in the
  browser. Its public interface was inspected without login, external messages or data changes.
- **Implementation:** the existing local #HNAG workspace contains Vite, React and TypeScript,
  77 bundled candidates (48 food, 29 drink), 13 categories, a pure randomizer and five reveal themes.
  This workspace has no `.git` directory or configured remote; it is not the reference checkout.
- **Initial baseline:** 77 unit/component tests passed, illustrating gaps in scenario coverage.

## Product and reference comparison

The public reference is a standalone community frontend. Its README explicitly distinguishes
the private production frontend/API and says GitHub Pages only redirects to production.
Production has four visible food/drink modes, two presentation themes, a global spin counter,
an item page and footer policy links. Do not expect cloning the public repository to reproduce
the production backend or global statistics. [Source](https://github.com/truanayangi-com/truanayangi/blob/main/README.md)

| Area | Preserve or adapt in #HNAG | Reason |
|---|---|---|
| Core interaction | Configure → freeze winner → reveal → accept/re-spin | Clear response to daily decision fatigue. |
| Budget | Separate hard ceiling and weighted target | A target price is not a maximum spend guarantee. |
| Personal pool | Bundled + custom items, explicit exclusions, local save status | Users can control suggestions without an account. |
| Visual identity | Existing dark case-opening direction and original assets | Preserve the recorded design decision and product continuity. |
| Item inspection | Secondary, initially collapsed view | Keep the main page focused on opening a box. |
| Statistics | Label counts as belonging to this browser | There is no #HNAG backend supplying a global total. |
| Discovery/maps/auth | Defer until user need and phase are explicitly established | These solve later jobs and introduce maintenance and data obligations. |
| Audio | Keep synthesized cues with silent fallback | Maintain the atmosphere without importing reference sound files. |

The reference attribution identifies third-party game sounds and limits what its own permissions
establish. No reference code, artwork or audio was imported into this change.
[Attribution source](https://github.com/truanayangi-com/truanayangi/blob/main/ATTRIBUTION.md)

## Findings fixed in this workspace

| Priority | Before | Implemented behavior | Evidence |
|---|---|---|---|
| P1 | Empty-pool recovery cleared diagnostics but kept the blocked phase | Filter/pool edits recover configuration; an empty preview disables opening and provides explicit recovery | Failing hook regression reproduced, then passed; E2E budget recovery |
| P1 | Adding a second custom item could return an error even though React later added it | Validate and compute outcomes synchronously, then commit state | Consecutive-add regression reproduced, then passed; browser add/reload |
| P1 | Switching FOOD to DRINK retained the previous form category | Reset form state per kind; validate category/kind agreement | Browser adds two drinks with the correct default category |
| P1 | Theme, pool or reset actions could disrupt a running reveal | Guard mutations during an active spin; disable affected controls while keeping sound available | Hook freeze assertions and browser disabled controls |
| P1 | Counter started at zero after reload and incremented before an outcome existed | Restore valid local counts; increment once at landing; ignore repeated callbacks and failed/empty draws | Hook and E2E count/reload checks |
| P1 | Storage errors were invisible; local counter also stopped updating | Keep in-memory play and display an honest unsaved-state message | Storage/audio failure E2E and hook checks |
| P1 | 11 category images weighed 8,993,171 bytes | Serve 384px WebP versions totalling 284,762 bytes; preserve JPG originals | File sizes and browser initial-raster budget gate |
| P1 | CI E2E job started preview without a build in its clean checkout | Build inside the E2E job before starting preview | Workflow inspection; equivalent local production build + E2E passed |
| P2 | UI counters included disabled items and custom items from the other kind | Count enabled candidates of the correct kind | Updated pool derivation; catalog and integration tests |
| P2 | Preview search was accent-sensitive and visually ambiguous | Accent-insensitive search, explicit preview-only copy, pressed states and empty results | Source/component review; browser rendering |
| P2 | Budget slider and icon controls lacked useful accessible names; small targets | Add labels, value text, 44px header controls and contrast on the main CTA | Mobile screenshot and 320px overflow E2E |
| P2 | A vegetarian-possible flag looked like a guarantee that the named meal was vegetarian | Label available vegetarian versions; identify prices/photos as illustrative | Result/card rendering |
| P2 | Tea/juice categories reused unrelated coffee/milk-tea photography | Use existing category artwork when no suitable photograph is available | Media mapping review |
| P2 | Failed crypto draw surfaced an uncaught interaction error | Keep the current state and show a retry action message | RNG failure/retry hook regression |
| P2 | Source notes incorrectly described the reference mobile hook as unsafe for SSR | Document that browser access is inside useEffect | Live source refresh in reference notes |

## Performance assessment

| Metric | Before | After | Interpretation |
|---|---:|---:|---|
| Category raster set | 8,993,171 B | 284,762 B | 96.83% smaller served alternatives; originals retained |
| Largest served image | Up to 1,022,729 B | 33,602 B | All served files below the 60 KB target |
| Application JS gzip | 118.54 KB | 119.81 KB | Below the workbook 180 KB target; recovery logic adds about 1.27 KB |
| Unit/component tests | 77 | 89 | Added failure-path coverage |
| Browser tests | 9 existing cases | 24 passing cases | Desktop Chromium, Pixel 7 emulation, reduced motion |

These are local build/media measurements, not real-user LCP/INP/CLS percentiles. A browser
assertion checks that initial raster resources use WebP and stay below 500 KB. No claim of a
production Lighthouse score or Core Web Vitals pass is made.

## SEO, content, schema, AI discoverability and search experience

| Review phase | Current evidence | Next appropriate improvement | Falsifiability check |
|---|---|---|---|
| Technical | Static Vietnamese title/description; no selected #HNAG production domain | Set canonical, robots, sitemap and social URL only after the actual domain is assigned | Fetch deployed root/canonical/robots/sitemap; verify status and same-host URLs |
| Content | Strong food/drink decision premise; app-centric home | Add concise original usage, budget explanation and data/reset policy content | A first-time tester explains hard ceiling vs target and completes a choice unaided |
| Schema | No structured data on the local home | Consider truthful WebApplication metadata at release; avoid invented ratings, menus or venue data | Structured-data validation matches visible product content |
| AI discoverability | Key content depends on JS; no public product evidence yet | Publish a small crawlable product explanation and accurate brand/contact information | Inspect fetched HTML and actual rendered page; never infer AI citations from markup alone |
| Search experience | Game is directly usable; preview now secondary | Test landing → first opening → acceptance on real mobile devices | Observe completion, time-to-first-open and understanding; record failures before expanding scope |

Title, Open Graph title/description/locale and a no-JavaScript explanation were improved now.
Canonical URLs, a production sitemap and domain-specific schema remain deferred to deployment.
Do not use the reference project's domain as #HNAG's canonical identity.

## Data and security boundaries

The runtime remains local-only: no new authentication, application API, database, geolocation,
provider SDK, payment system or analytics vendor. The production dependency advisory check
reported zero vulnerabilities at the time of this run; that is not proof of complete security.
Custom names are normalized before length checks, and category/kind mismatch is rejected.
The randomizer remains origin-neutral and rarity does not affect selection probability.

The pictures are category illustrations rather than verified photos of each named meal. Prices
are local estimates. Review the vegetarian-possible flags and meal variants editorially before
release. Do not market them as dietary guarantees or restaurant menu facts.

## Prioritized next work

1. **Specification hygiene:** reconcile the 45 duplicate ID groups and archive obsolete backend
   requirements. Use the accompanying exact-row ledger; preserve useful acceptance details.
2. **Release preparation:** initialize/connect the intended #HNAG repository, choose its domain,
   configure static hosting, then verify a preview and production URLs. Nothing was published here.
3. **Real-user validation:** observe a small pilot of Vietnamese users choosing food/drink;
   measure first-open completion, acceptance, repeat spins and confusion using an agreed method.
   Numeric targets require a baseline, not invented benchmark scores.
4. **Personal-pool usability:** search within settings, edit custom items, confirm destructive
   reset, and optional export/import after concrete user feedback establishes the need.
5. **Content quality:** improve item-specific art, verify variant labels and price ranges, add
   original product/help/privacy copy. Confirm asset provenance for public release.
6. **Future phases:** reconsider sharing, group choice or post-reveal place search independently.
   A database or map directory is not a prerequisite for improving the current game.

## Remaining verification limits

- Browser automation covers Chromium desktop/mobile emulation, not physical iOS Safari or Firefox.
- Real-user vitals, retention and production indexation were not measured.
- Existing alternate reveal themes were retained; the full five-theme/device matrix was not rerun.
- GitHub CI was corrected locally, but no remote run was triggered because this is not a Git checkout.
- The live workbook and reference deployment were read only. Their contradictions remain there.
- A separate diagnostic script appeared during this session; its DOM typing and unused variable
  were corrected so it no longer breaks project checks. Existing source work was preserved.

See [verification walkthrough](walkthrough.md) for exact commands and the final local preview.

TASK COMPLETED
