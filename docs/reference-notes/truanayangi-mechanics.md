# Reference mechanics notes — truanayangi-com/truanayangi

## App-launch correction: 2026-09-12

The user reported that all delivery buttons opened websites on both iPhone and Android.
At reference commit `2e10968abfcee2cabc0b01fcf0535ac4aa31b16d`, `src/app/page.tsx`
uses a GrabFood web search URL with `search`, `support-deeplink=true` and
`searchParameter`. It contains no equivalent ShopeeFood, Be or Green SM launch mechanism.
HNAG had omitted Grab's deeplink parameters and used ordinary website links for every provider.

HNAG now uses a direct, gesture-triggered native URL on iOS and a package-scoped Android
Intent with an explicit Play Store fallback. No timer, hidden iframe, app-install probing,
provider SDK or automatic order is involved. Desktop links remain HTTPS. A manual install
link is shown after a mobile attempt; it does not claim the app launch succeeded or failed.

Verified destinations (provider-owned evidence):

| Provider | Native route | Android package | Evidence |
| --- | --- | --- | --- |
| GrabFood | `grab://open?screenType=GRABFOOD&searchParameter=...` | `com.grabtaxi.passenger` | [GrabFood](https://food.grab.com/vn/vi/restaurants?support-deeplink=true): its `common-utils.13c5bf4024a08ee849ea.js` bundle uses this search route in its OneLink template. |
| ShopeeFood | iOS `vn.foody.DeliveryNow://home`; Android `deliverynow://home` | `com.deliverynow` | [ShopeeFood](https://www.shopeefood.vn/): App Links metadata and `ios-app`/`android-app` alternate URLs in `app-2e7c81bf3ba96ea36b53.js`. |
| Be | `xyz.be.customer://home` | `xyz.be.customer` | [Be homepage](https://be.com.vn/) links to [the customer app landing page](https://begroup.onelink.me/ZOqn/becustomerapp), which publishes this native route. |
| Xanh SM / Green SM | `xanhsm.com://homepage` | `com.gsm.customer` | [Official download page](https://www.greensm.com/vn-vi/download) links to [the app landing page](https://vn.greensm.com/3eCA/8li1xfm7). Its native route and [Android association](https://vn.greensm.com/.well-known/assetlinks.json) identify the consumer app. |
| Google Maps | iOS `comgooglemaps://?q=...`; Android HTTPS Maps search with `api=1` in an Intent | `com.google.android.apps.maps` | [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), [iOS scheme](https://developers.google.com/maps/documentation/urls/ios-urlscheme). |

The ShopeeFood, Be and Green SM sources establish app entry points, not public dish-search
contracts. HNAG therefore offers explicit dish-name copying instead of inventing search
parameters for those apps. Clipboard failure leaves a selectable name for manual copying.

Validation must distinguish URL construction and browser click handling from installed-app
launches. Automated mobile tests intercept native navigation on the desktop host; physical
iPhone/Android app opening is still a device check. In-app browsers and OS link preferences
can block external-app launches. See [Chrome's Intent requirements](https://developer.chrome.com/docs/android/intents).

Follow-up on 2026-09-14: manual responsive inspection also found that the result card's
decorative rays extended beyond the scrolling modal. Their horizontal bounds now stay
inside the card, and the modal aura is capped to its available width. The mobile link
tests check the modal's own scroll containers at 390px and 320px, since checking only
the document width had missed this overflow.

Delivery remains an independent local change on `codex/rarity-latest`, alongside the
rarity improvements. It has not been merged, pushed or deployed to the public Vercel site.

## Refresh: 2026-09-11

Public `main` was verified at commit `2e10968abfcee2cabc0b01fcf0535ac4aa31b16d`.
The public repository is the standalone community frontend; its README explicitly distinguishes
the private production frontend/API. The live site now exposes main meals, drinks, snacks and
drinking-food modes, two presentation themes, a global completion counter and a separate item
page. Those production capabilities cannot be inferred from the public local-only code.

Corrections to the historical observations below:

- Row 10 describes an earlier #HNAG build. The current build ships category illustrations as
  11 optimized WebP assets (284,762 bytes total), with lazy loading and inline art fallbacks.
- Row 15's SSR warning was incorrect: `use-mobile.ts` reads `window` inside `useEffect`, which
  does not run on the server. It is safe for server rendering; its initial false state may
  still differ from the eventual browser media query. Do not cite this as an SSR crash.
- `ATTRIBUTION.md` describes permission within that project and identifies CS-derived audio.
  Public visibility is not a blanket asset license. #HNAG continues to use original local
  artwork and synthesized sound, with no imported reference code or media.

Sources: [commit](https://github.com/truanayangi-com/truanayangi/commit/2e10968abfcee2cabc0b01fcf0535ac4aa31b16d),
[README](https://github.com/truanayangi-com/truanayangi/blob/main/README.md),
[mobile hook](https://github.com/truanayangi-com/truanayangi/blob/main/src/hooks/use-mobile.ts),
[attribution](https://github.com/truanayangi-com/truanayangi/blob/main/ATTRIBUTION.md),
[live site](https://truanayangi.com/).

The remaining table is historical implementation context; the refresh above supersedes it.

Required by `32_CLAUDE_MASTER_PROMPT` before implementing the case-reel (`REF-015` in
`33_REPO_REFERENCE_MAP`: PRIMARY_MECHANICS_REFERENCE). Read via the public repo
(`README.md`, `ATTRIBUTION.md`, `AGENTS.md`, `src/app/page.tsx`, `src/lib/case-mechanics.ts`,
`src/lib/case-audio.ts`, `src/lib/personal-pool.ts`, `src/hooks/use-preferences.ts`) on
2026-09-10/11.

**License position, verbatim from `ATTRIBUTION.md`:** this repo is itself a permitted fork of
an earlier "Trưa Nay Ăn Gì" by Nagi/nagisanzenin ("Walter granted permission to reuse the
source code, food artwork, and datasets within this project") — that permission is specific to
this fork and does not extend to unrelated third parties such as #HNAG. The file is explicit
that this changes nothing for outside reuse: *"Public source visibility does not itself grant a
new blanket license for third-party assets. No new license is imposed on existing contributions
or assets by this migration."* More concretely, the repo's own SFX are **not original** —
`ATTRIBUTION.md` cites them as *"CS-style sounds: https://github.com/sourcesounds/csgo"* with
mechanics referenced from *"https://github.com/Desynci/CSGO_Panorama_Code.pbin"*, i.e. literal
CS:GO game assets/code, "subject to their respective owners' rights." Combined with the repo
having no LICENSE file of its own, this is why every #HNAG constant/formula below is
deliberately different and no audio file from that repo is used anywhere in this codebase
(see `src/features/reveal/themes/case-reel/constants.ts`, `easing.ts`, `src/features/audio/gameAudio.ts`).

| # | Observation | Classification | #HNAG treatment |
|---|---|---|---|
| 1 | Winner is chosen by `createFoodSelector()` *before* the spin animation starts; the reel only renders a pre-decided result. | **LEARN** | Adopted as a hard invariant: `runRandomizer()` returns a `FrozenSelection` before any reveal/animation code runs (`src/features/randomizer/domain/engine.ts`, CODE-019). |
| 2 | `personal-pool.ts` combines a `disabled: string[]` list over built-ins with a bounded `custom[]` array (≤50 items, UUID ids, 1–60 char names, price 10–500). | **ADAPT** | Same shape (disabled-ids + custom array), but #HNAG bounds differ (≤30 custom items, price in real VND 1,000–2,000,000, both FOOD and DRINK kinds) — see `src/features/pool/types.ts`. |
| 3 | The reel is a long horizontal strip; the winner sits at a fixed target index with decoy cards around it that carry no probability meaning. | **LEARN** | Same idea, different numbers: `REEL_LENGTH=48`, `WINNER_SLOT_INDEX=40` (reference used 30–40 tiles), decoys chosen with plain `Math.random()` since they never touch winner selection. |
| 4 | A fixed selector marks the landing point; the strip moves under it via a computed `translateX`. | **LEARN** | Same model (`SelectorLine.tsx` never moves; `geometry.ts` computes `finalTranslateXPx` from *measured* viewport/card width, not a hard-coded desktop size). |
| 5 | Animation runs on `requestAnimationFrame`, transform-based. | **LEARN** | Same technique (`useCaseReelAnimation.ts`), using `translate3d` only. |
| 6 | `caseEase()` is a custom easing built from a 30-round binary search over two blended cubic segments; `spinProgress()` separately applies `1-(1-p)^friction` with `friction` 2.7–3.3, `SPIN_DURATION_MS=6000` (7500–9500ms normal / 4000–5000ms reduced), a 42-entry `TICK_SECONDS` table, and `stopFraction()` picks a random stop point in [0.10, 0.91). | **REJECT** (do not copy the formulas/constants) | #HNAG uses a single normalized exponential ease-out (`easeSpin`, a different mathematical family — see `easing.ts`), a fixed target index instead of a random stop fraction, and #HNAG's own duration window mandated by `RANK-024`/`DS-022` (5.5–7.5s normal, ≤600ms reduced) — a different range from the reference, and not derived from it. |
| 7 | A tick sound fires on slot-crossing; a reveal cue fires once on landing. | **LEARN** | Same UX shape (`onTick`/`onLanded` callbacks drive `GameAudio.playTick/playReveal`), different implementation — see #9. |
| 8 | `CaseAudio` lazily creates an `AudioContext`, unlocks it on the first user gesture (with a silent-pulse trick for old iOS), wraps every decode/play call in `.catch()` so failures are invisible, and exposes `setMuted()` that zeroes gain and pauses sources. | **ADAPT** | Same resilience shape (lazy context, gesture-gated unlock, everything wrapped so failure is silent, `setEnabled()`/mute persisted by the caller). #HNAG does **not** ship/decode audio *files* — `gameAudio.ts` synthesizes tick/reveal tones at runtime via oscillator nodes, which avoids any question of audio-asset provenance for this build (documented in that file). |
| 9 | No explicit responsive/mobile-vs-desktop reel geometry branch was found in the fetched excerpt beyond general layout CSS. | **LEARN** (gap noted) | #HNAG measures `containerRef.clientWidth` and the first card's `getBoundingClientRect()` fresh on every spin start (`useCaseReelAnimation.ts`), so desktop/mobile/tablet all derive from the same formula instead of separate breakpoints — verified in `geometry.test.ts` across 320–1440px. |
| 10 | The public repo's own issue tracker (`#4`) reports slow load from unresized images — a known heavy-image-payload risk. | **LEARN** | Treated as a budget requirement, not a bug to inherit: `CODE-028`/`FEUI-042` — reel/reveal cards render as text-first cards with rarity glyphs in M1 (no photography shipped yet), so there is no eager image payload to begin with. |
| 11 | `createFoodSelector()` targets a mean price (`TARGET_LUNCH_PRICE=50`) using a Gaussian prior in log-price space and an 80-round binary-search "tilt" — a *soft* target-price mode that could be mistaken for a hard budget ceiling if UI copy is imprecise. | **LEARN** (as a failure mode to avoid) | #HNAG keeps `HARD_MAX` (true ceiling, unknown-price items excluded) and `TARGET` (explicit weighted "around this price", `RANK-012/013`) as two distinct, separately-labeled modes — `BudgetControl.tsx` never lets the UI blur the two. |

| 12 | `src/app/page.tsx` is a single `Home` component owning the entire state machine (`spinning`, `result`, `revealed`, `moving`, a `reel` array, plus refs for `busy`/`position`/`track`) and orchestrating everything — pool, spin, audio, dialog — inline. | **REJECT** (do not reproduce the structure) | `REF-028`/`CODE-004` explicitly warn against this shape. #HNAG splits the same responsibilities into `features/game` (orchestration), `features/pool`, `features/randomizer/domain`, `features/reveal` and `features/audio`, each independently testable — see `docs/implementation-plan.md`. |
| 13 | `use-preferences.ts` stores the pool profile in a **cookie** (`readCookie`/`writeCookie('pool', …)`) with no version field; an invalid/old shape is discarded wholesale via `validateProfile()` falling back to `emptyProfile()`. | **ADAPT** (with a deliberate improvement) | `RS-054`/`CODE-011` ask for *versioned* local persistence with migration/reset, which the reference does not have. #HNAG uses `localStorage` (not cookies — no server ever reads it, so there is no reason to pay cookie header overhead) with an explicit `version` field (`src/lib/local-preferences/schema.ts`) so a future schema change can add a real migration step instead of only reset-to-empty. |

| 14 | `preferences-panel.tsx`: a two-tab dialog (Built-in / Custom). Built-in tab has a live search filter over the full item list and an "Enable all" reset. Custom tab supports add **and edit** (not just add/delete), with a dirty-state indicator (`JSON.stringify` diff against saved) and a confirm-before-delete step. | **ADAPT** (backlog, not yet built) | Good UX ideas worth adding to `PoolPreferencesDrawer.tsx`/`CustomItemForm.tsx` later: (a) a search box over `BuiltInItemToggleList` — currently a plain unfiltered list, fine at 53 items but won't stay fine if the catalog grows; (b) an "Enable all" button next to the existing "Đặt lại về mặc định"; (c) edit-in-place for a custom item instead of delete-and-recreate. None implemented yet — flagging here rather than bolting on mid-session while `ReelItemCard.tsx`/`CaseReel.tsx`/`globals.css` are being edited concurrently by another process. |
| 15 | `use-mobile.ts`: `matchMedia("(max-width: 767px)")` + a `change` listener, breakpoint 768px, and it reads `window` directly inside `useEffect` with no `typeof window !== "undefined"` guard — not SSR-safe (harmless for their pure-CSR app, but a real bug in an SSR context). | **REJECT** (the SSR-unsafe pattern) / **LEARN** (the breakpoint choice) | #HNAG has no SSR, so this specific bug can't bite here, but `src/lib/useReducedMotion.ts` already follows the *safe* version of this exact pattern (guarded `typeof window` check, lazy `useState` initializer, `matchMedia` + `change` listener) — worth reusing that same hook shape if a JS-side (not just CSS breakpoint) mobile check is ever needed, rather than copying this hook's unguarded version. |
| 16 | `switch.tsx`/`dialog.tsx` are thin wrappers around `@base-ui/react`'s `SwitchPrimitive`/`DialogPrimitive`, styled with Tailwind `data-*` state variants; the dialog's focus trap and open/close animation come entirely from the library. | **REFERENCE_ONLY** | Confirms the existing `08_TECH_STACK`/`STACK-004` note that `@base-ui/react` is the reference project's primitive layer. #HNAG's own decision to skip it (`src/components/ui/{Switch,Dialog}.tsx`, native `<input type="checkbox">`/`<dialog>` instead — see `docs/implementation-plan.md`, "Deliberate deviations") stands: it was made specifically to reduce dependency-footprint overlap with this reference repo, not because the library choice itself is bad. |

**Summary:** #HNAG's case-reel is an independent implementation. What was learned is the
*shape* of the mechanic (freeze-then-animate, fixed selector, measured geometry, gesture-gated
audio, two distinct budget semantics) — not the reference project's specific timing constants,
easing curve, tick table, or audio assets, none of which appear anywhere in this codebase.
