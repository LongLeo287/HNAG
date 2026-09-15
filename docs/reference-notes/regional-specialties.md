# Regional specialties: provenance and game treatment

Reviewed on 2026-09-15. `src/data/catalog/regional-specialties.ts` explicitly maps
39 existing entries to eight documented dish families. This includes variants of the
families, not 39 independently certified traditional recipes. No new dishes, prices or
nearby-restaurant claims were invented. Cultural locality is independent of device GPS.

| Dish family | Cultural locality | Entries | Primary source |
| --- | --- | ---: | --- |
| Bun thang | Hanoi | 1 | [Vietnam Tourism regional food guide](https://vietnam.travel/things-to-do/vietnam-foodie-guide-region) |
| Bun bo Hue | Hue | 6 | [Vietnam Tourism regional food guide](https://vietnam.travel/things-to-do/vietnam-foodie-guide-region) |
| Mi Quang | Quang Nam | 10 | [Vietnam Tourism regional food guide](https://vietnam.travel/things-to-do/vietnam-foodie-guide-region) |
| Cao lau | Hoi An | 5 | [Vietnam Tourism Hoi An guide](https://vietnam.travel/things-to-do/explore-food-hoi-an) |
| Com ga Hoi An | Hoi An | 2 | [Vietnam Tourism Hoi An guide](https://vietnam.travel/things-to-do/explore-food-hoi-an) |
| Com tam | Southern Vietnam | 10 | [Vietnam Tourism regional food guide](https://vietnam.travel/things-to-do/vietnam-foodie-guide-region) |
| Ca kho to | Mekong Delta | 1 | [Vietnam Tourism regional food guide](https://vietnam.travel/things-to-do/vietnam-foodie-guide-region) |
| Hue cakes | Hue | 4 | [Vietnam Tourism Hue guide](https://www.vietnam.travel/vi/things-to-do/how-eat-local-hue) |

The source supports each family's regional association. Variant ingredients remain
the catalog's descriptions. For example, the Hanoi bun thang association is not applied
to Pho Hien eel bun thang. Untagged items may also be specialties; the table deliberately
does not infer that from a province string. Expand coverage through reviewed identities
and source links, rather than broad name matching.

## Frequency and presentation

The rate is a product choice, not a fact from the tourism sources. Algorithm
`randomizer-v2.1.0` preserves the tier schedule 80/16/3.5/0.5. Inside each available
tier, specialty weight is 0.5 versus ordinary weight 1; TARGET mode additionally applies
price fit. Equal-price, same-tier ordinary items are twice as likely as a specialty item.
Aggregate specialty probability depends on the eligible pool and is calculated on screen.
An all-specialty pool necessarily has 100% specialty probability. Missing tiers are
renormalized and rerolls retain the existing same-tier exclusion rule.

Specialty cards have a locality seal, region accent, ornamental frame and brief reveal
animation. Tier color and badge remain separate. The winner shows the probability frozen
for that draw and a source link. The preview/reel also identify specialties. North,
Central and South use distinct original synthesized four-note chimes layered after the
rarity cue. They are UI sounds, not representations of traditional regional music.
Mute remains off until the user enables sound; audio failures cannot block opening.
Reduced motion suppresses the specialty movement without changing the winner.
