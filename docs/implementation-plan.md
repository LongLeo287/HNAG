# #HNAG implementation plan — M0 + M1 (first bounded run)

Scope per `CODE-044`/`BRD-022`: M0 foundation + M1 playable blindbox MVP in one run, then stop
before M2+. No DB/auth/location/provider/native-discovery/merchant/admin work in this pass.

## Mapping to spec IDs

| Area | Spec IDs | Where |
|---|---|---|
| Repo scaffold, no Next.js, no DB/auth/Maps | `BRD-001..029`, `STACK-001..018`, `RS-001` | `package.json`, `vite.config.ts`, no `src/db`/`src/app/api` |
| Candidate item contract | `RS-037`, master-prompt "CANDIDATE ITEM / POOL CONTRACT" | `src/data/catalog/schema.ts` |
| Bundled FOOD/DRINK pool | `RS-037`, `FEAT-005/006` | `src/data/catalog/{foods,drinks,categories}.ts` |
| Randomizer v1 (pure domain) | `34_DECISION_RANKING_V1` (`RANK-001..035`) | `src/features/randomizer/domain/*` |
| Pool combine/custom items | `RS-018`, `FEAT-050`, `CUSTOM_FAIR` | `src/features/pool/*` |
| Local persistence | `RS-054`, `FEAT-051`, `CODE-011` | `src/lib/local-preferences/*` |
| Game orchestration | `RS-020`, `UI-045` | `src/features/game/*` |
| Case-reel reveal theme | `RS-021/053`, `FEAT-008`, `DS-010/022/023/044` | `src/features/reveal/themes/case-reel/*` |
| Reveal contract / result UI | `FEAT-052`, `UI-010/011/017`, `FEAT-009/047` | `src/features/reveal/ui/*` |
| Game audio | `RS-052`, `FEAT-048`, `DS-024` | `src/features/audio/*` |
| Rarity presentation | `FEAT-049`, `DS-045`, `RANK-029` | `src/lib/rarity.ts` |
| Reduced motion | `FEAT-053`, `RANK-030`, `CODE-037` | `src/lib/useReducedMotion.ts`, `RevealStage.tsx` |
| Design tokens | `19_DESIGN_SYSTEM` (`DS-001..006`) | `src/app/globals.css` (`@theme`) |
| Env contract | `30_ENV_EXAMPLE` | `.env.example` (verbatim `ENV-025` body) |
| Guard scripts | `RS-048`, master-prompt "REQUIRED PACKAGE SCRIPTS" | `scripts/*.ts` |
| CI | `RS-051` | `.github/workflows/ci.yml` |
| Reference mechanics study | master-prompt "REFERENCE MECHANICS STUDY" | `docs/reference-notes/truanayangi-mechanics.md` |

## Deliberate deviations from the reference project's stack (beyond "mechanics only")

The independent-#HNAG-audit that produced this repo flagged that `08_TECH_STACK`'s STACK-002/004
rows cite truanayangi's own `package.json` as their `Source`, and that copying `@base-ui/react`,
`lucide-react`, `class-variance-authority`, `clsx` and `tailwind-merge` wholesale would make
"mechanics reference, independently implemented" a harder claim to defend given the reference
repo ships with no LICENSE file. This build deliberately **does not** install those five
packages — see `src/components/ui/*` (native `<dialog>`/checkbox-based primitives) and
`src/lib/cx.ts` (a five-line class-joiner instead of clsx/cva/tailwind-merge). Vite, React,
TypeScript, Tailwind and pnpm are kept because they are the generic, unowned industry-standard
toolchain the spec's `STACK-*` rows require for other reasons (Vercel static hosting, strict
types, utility CSS) — not because the reference project uses them.

## Verification commands run (see final report in the PR/commit description for observed output)

```
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm validate:catalog
pnpm check:boundaries
pnpm check:scope
pnpm build
```

`pnpm e2e` (Playwright) requires `pnpm exec playwright install` for browser binaries, which this
environment did not run — see `docs/decisions.md`.
