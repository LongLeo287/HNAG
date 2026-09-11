# Verification walkthrough - 2026-09-11

## Verified baseline and improvements

The original baseline had 77 passing tests. Two new regressions were observed failing before
the fixes: recovery stayed in the blocked phase, and the second custom-item submission returned
false. Both passed after the fixes. The expanded suite subsequently passed 89 unit/component
tests and 24 browser tests before concurrent visual edits began changing the same files.

Environment: Windows, Node 24.19.0 from the bundled runtime, pnpm 12.3.4. Initial inspection used
Node 22.22.3; the later verification used the project's required Node 24 major version.

| Command or check | Observed result |
|---|---|
| pnpm install --frozen-lockfile | Passed; lockfile unchanged, 325 entries checked |
| pnpm verify | Passed earlier after the fixes; final workspace check is pending concurrent-edit reconciliation |
| pnpm e2e | 24 passed in 25.7s before the subsequent modal/audio changes |
| pnpm audit --prod --json | Zero reported vulnerabilities |
| validate:catalog | 77 items, 48 FOOD, 29 DRINK, 13 categories |
| validate:media | 11 WebP files, 284,762 bytes, each below 60 KB |
| Build | JS 119.81 KB gzip, CSS 12.29 KB gzip in the verified revision |

## Browser verification

The flow under test is: load → choose filters or custom pool → open → reveal → re-spin → accept.
An additional flow covers an empty budget → explicit filter reset → successful opening.

The in-app browser was available for visual checks. The repository's Playwright suite was used
for reproducible automated regression coverage, not as a fallback from a browser failure.
The production preview is available at http://127.0.0.1:4173/ while its local server is running.

| Check | Evidence from verified build |
|---|---|
| Page identity | Vietnamese #HNAG title and intended local URL |
| Nonblank content | Heading, game stage, opening button and real settings rendered |
| Framework overlay | None in production preview |
| Console health | Fresh production tab returned no warnings or errors |
| Screenshot | Desktop and 390x844 mobile inspected; primary opening action visible |
| Interaction | Opening disabled pool/theme/reset controls; result and acceptance verified by E2E |
| Responsive | 320px no-horizontal-overflow assertion; Pixel 7 emulation; 390px manual view |
| Resilience | No audio context and failed storage writes still complete the game |
| Network isolation | Core journey makes no external requests and does not request GPS |

An old development tab recorded a hook-order warning during hot replacement while hooks were
being edited. A fresh production tab had no such errors. This transient HMR event is not being
presented as a clean-console result for the entire development session.

## Concurrency

Another writer added or modified CrateOpeningLid, WinnerModal, CrateStage, IdleReel, game audio,
preferences and GameShell during final verification. These changes were not reverted wholesale.
They introduced additional lint/type failures after the earlier successful test run. Final status
must be updated from a stable source revision; do not treat older passes as proof of later edits.

## Limits

No deployment, remote CI run, physical Safari check, production Core Web Vitals or live workbook
correction was performed. The local workspace has no Git history. A source backup was made in
the OS temporary directory before the main edits.
