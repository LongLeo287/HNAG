# Rarity balance on the current HNAG source

Baseline: `abe221d978cdc782047235fbdb5959d4ef883579` on `main`, verified against origin on 2026-09-12. The current catalog has 1,731 candidates (1,551 food and 180 drink), five crates, contextual filtering and five reveal modes. Baseline validation: 103 tests and the complete `pnpm verify` gate pass.

The user requested fewer high-rank outcomes and an independently testable change. Work is isolated on `codex/rarity-latest`; preserve the current catalog, crate selection, context metadata, layout and reveal modes.

1. Demonstrate the current probability error with regression tests.
2. Allocate available rarity tiers shares of 80%, 16%, 3.5%, 0.5%; distribute each tier's share among its eligible items. TARGET adjusts prices only inside each tier.
3. Exclude the previous winner only when another eligible item of the same tier exists. Keep the frozen winner and expose the actual frozen probabilities.
4. Show current filtered odds and use the same probabilities for cosmetic reel sampling. Rename visible tiers consistently without changing stored enum keys.
5. Verify all five crates with the expanded catalog, context and budget filters; run statistical simulations, the full verification gate and browser tests. Publish a local preview and record results in a walkthrough.

Absent tiers receive zero probability; remaining tier shares are normalized. A restricted pool containing only high-tier items will necessarily return those tiers, so the UI must show actual odds rather than advertise unconditional base shares.
