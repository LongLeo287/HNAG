# Review implementation plan - 2026-09-11

The user requested comprehensive analysis of the workbook, reference repository and website,
then improvements to their project. This extends the existing implementation plan with
bounded corrective work; no new architecture or backend is needed.

1. **Correctness (RANK-016/020/031, FLOW-002):** return from blocked state to configuration
   after explicit filter/pool edits; keep the current frozen result stable; make custom-item
   results synchronous rather than reading a React state updater's deferred side effect.
2. **Persistence:** keep storage access inside local-preferences; hydrate the existing local
   counter, count only completed reveals, preserve play when storage fails, and show save status.
3. **Interaction (RANK-021/030, QA-015):** lock settings that can restart a running reveal;
   retain sound control; fix mode-specific custom form state, accessible controls and small widths.
4. **Product focus (PV-026, BRD-030):** preserve existing dish artwork as an optional in-page
   pool inspection surface, collapsed initially, with clear distinction from actual draw filters.
5. **Evidence:** add targeted domain/hook/E2E regressions, run verify + desktop/mobile/reduced
   motion, inspect actual rendered states, record production-readiness gaps and exact workbook rows.

Validation baseline: 77 tests pass, 77 catalog items, JS 118.54 KB gzip. Installed Node is
22.22.3 and pnpm is 12.3.4; Node 24 verification still needs a matching runtime.

No deployment or live source document edit is included in these local fixes.
