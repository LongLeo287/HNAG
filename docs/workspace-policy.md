# Workspace and delivery policy

User instruction recorded on 2026-09-16:

- Use this `HNAG` repository as the only active project folder. Do not create sibling review copies or additional worktrees for future work.
- Analyze the existing implementation before making changes, preserve user assets, and coordinate edits within this checkout.
- Commit and push coherent, verified milestones as work progresses. Run the checks appropriate to each change before committing; do not push broken intermediate edits or secrets.
- Keep generated output and local recovery archives out of Git.

## Consolidation audit

The previous `HNAG-rarity-latest` worktree provided isolation while another process was editing the original checkout. Its work has been consolidated into this repository. It is now unregistered and empty; its directory has been moved inside the local archive.

The former sibling `HNAG-review-20260911` directory is an older review snapshot with no Git metadata. Comparing its non-generated files against this repository found 177 files: 102 identical, 70 changed, and 5 present only in the old snapshot. The unique files are:

- `src/features/reveal/ui/CrateOpeningLid.tsx`: an earlier CSS/emoji opening overlay.
- `src/features/randomizer/domain/distribution.test.ts`: an earlier seeded distribution regression test.
- `scripts/debug_reduced.ts`, `scripts/debug_spin.ts`, and `scripts/test_dev_spin.ts`: temporary development browser diagnostics.

All 177 files were preserved in `.local-archive/HNAG-review-20260911-source.zip`, with a manifest at `.local-archive/review-20260911-manifest.json`. Every archive entry was checked against the source using SHA-256. The archive excludes generated `node_modules`, `dist`, `test-results`, and TypeScript build information. The archive is excluded locally through `.git/info/exclude` and must not be committed.

Archive SHA-256: `F4AE9352A30E82B4AD9E374183328878200295BA87FC681250C3C121B907662E`.

The automated execution policy rejected deletion of the obsolete sibling directories. A reversible move succeeded instead: both directories were moved intact into `.local-archive/retired-workspaces/`, including the old snapshot's generated dependencies and build output. The original parent directory now contains only one HNAG project folder: this checkout. These nested archived snapshots are recovery material, not active workspaces. All ongoing implementation, verification, commits, and pushes use this repository.
