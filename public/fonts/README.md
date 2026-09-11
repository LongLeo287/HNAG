# Font provenance

**Be Vietnam Pro** — SIL Open Font License 1.1, full text in [`OFL.txt`](./OFL.txt).
Source: [google/fonts, ofl/bevietnampro](https://github.com/google/fonts/tree/main/ofl/bevietnampro).

Files here are the `latin` and `vietnamese` unicode-range subsets for weights 400/500/600/700,
extracted from Google Fonts' own served `.woff2` files and self-hosted so #HNAG has zero
external network dependency at runtime (`RANK-033`/`CODE-036`, see `docs/decisions.md`). The
`latin-ext` subset is intentionally omitted to keep payload size down (`QA-004`/`CODE-038`) —
it is not needed for Vietnamese or basic Latin text.

No files here originate from `truanayangi-com/truanayangi` — see
`docs/reference-notes/truanayangi-mechanics.md` for why that repo's own audio assets
(third-party CS:GO sounds) are never used in this project.
