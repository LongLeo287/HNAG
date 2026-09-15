# Crate, taxonomy and regional-specialty correction

- Separate FOOD and DRINK before showing crates. Category filters must belong to the
  selected crate, and all visible counts must use the same hard filters as the draw.
- Correct explicit catalog misclassifications using existing names/descriptions, with
  reviewed ID overrides. Keep imported source records intact for comparison. Exclude
  condiments and inseparable food/drink combinations from individual-item draws.
- Give alcoholic beverages their own category and crate, outside the refreshment crate.
- Add source-backed regional-specialty metadata. A province string alone is not evidence
  that an item is a specialty. Keep source attribution and the cultural locality separate
  from the user's current GPS location.
- Give verified specialties half the within-tier weight of an otherwise equivalent
  ordinary item. Preserve the 80/16/3.5/0.5 tier schedule and display effective odds.
- Use a distinct regional badge, card treatment, reveal effect and original synthesized
  sound. Respect mute and reduced motion; freeze the winner before presentation.
- Validate taxonomy membership, transitions, budget/count consistency, specialty weighting,
  muted audio and the complete game flow on desktop/mobile layouts.

## Completion

- [x] Separate crate kinds, scoped categories, persistent selection and matching counts.
- [x] Apply reviewed classification overrides and exclude ambiguous mixed-kind records.
- [x] Add sourced specialty metadata, weighted odds, card/effect and regional sound cues.
- [x] Pass 169 unit tests and the complete verification gate.
- [x] Pass 90 E2E cases and inspect desktop/phone layouts.
- [x] Document provenance, rate semantics and remaining limits in
  [the walkthrough](crates-specialties-walkthrough.md).
