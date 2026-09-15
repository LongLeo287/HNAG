# Rarity balance - 2026-09-12

## Problem and decision

The user reported too many high-rank results and requested a balance review. In v1, NONE and
HARD_MAX selected uniformly by item; rarity was cosmetic. The 48 food items contain 27 common,
16 rare, 3 epic and 2 legendary items. The 29 drink items contain 11 common, 12 rare, 5 epic and
1 legendary item. Thus the two highest tiers occurred in 10.42% of unfiltered food draws and
20.69% of drink draws. TARGET could amplify expensive high-tier items even further.

The independent review copy now uses `randomizer-v2.0.0`. This is an explicit behavior change
authorized by the user's follow-up, superseding the workbook's old uniform-per-item and
presentation-only rarity rules. Existing item IDs and stored tier enum values remain compatible.

| Stored tier | Visible label | Full-pool probability |
|---|---|---:|
| THUONG | Thường | 80% |
| NGON | Hiếm | 16% |
| DINH | Siêu hiếm | 3.5% |
| HUYEN_THOAI | Huyền thoại | 0.5% |

Ranks now describe drop frequency, never food quality, nutrition, verified price or monetary value.
No item reassignment or external catalog edit was needed to achieve this balance.

## Selection contract

1. Apply enabled/kind/category/vegetarian/hard-budget filters without silent relaxation.
2. For a re-spin, remove the previous item only if its tier has another eligible item.
   Otherwise allow that item to repeat. Removing the only common item from a common/legendary
   pair would force legendary results every other spin; this exception prevents that inflation.
3. Normalize base tier shares over tiers that actually remain. Empty tiers have zero probability.
4. Share a tier's probability equally among its items in NONE and HARD_MAX.
5. In TARGET, distribute that same tier probability using the existing price-fit weights
   **within the tier**. Changing target price cannot increase the tier's overall probability.
6. Draw once with the crypto-backed RNG; freeze the winner, eligible pool and probabilities.
   All five reveal themes receive that same frozen result. No pity timer or forced rare reward.

For item i in tier t:

`P(i) = base(t) / sum(base of present tiers) * priceWeight(i) / sum(priceWeight within t)`

`priceWeight` is 1 outside TARGET. Bundled/custom origin adds no multiplier; new custom items
retain their existing common tier. Every eligible item retains a positive chance.

The opening and re-spin panels display actual current tier sums, rounded to two decimal places.
For example, filtering to hotpot/grill removes all common items, so the remaining shares are
0% / 80% / 17.5% / 2.5%. A sole legendary candidate necessarily has 100%; the UI says when
missing tiers are being renormalized. Base percentages are not advertised as universal.

The case reel, idle preview, wheel and slot-machine decoys sample from supplied probabilities, with
separate cosmetic randomness. The fixed landing slot remains the frozen winner. Decorative
cards are not additional draws or an estimate of the odds. Modal borders/glow now match the
actual rank instead of making every result look gold.

## Seeded simulation evidence

Command: `pnpm simulate:rarity`. Seed: `20260912`. Each row uses 100,000 actual `runRandomizer`
calls, for 800,000 calls in total, including consecutive re-spin chains. Acceptance uses an
independently declared 80/16/3.5/0.5 target, normalized over present tiers, with five standard
errors of tolerance and a 0.02 percentage-point floor. Missing tiers must produce zero results.
The run passed all eight scenarios. These are deterministic local simulations, not live usage.

| Scenario | Thường observed | Hiếm observed | Siêu hiếm observed | Huyền thoại observed |
|---|---:|---:|---:|---:|
| FOOD, NONE | 80.175% | 15.851% | 3.472% | 0.502% |
| DRINK, NONE | 79.824% | 16.189% | 3.548% | 0.439% |
| FOOD, TARGET 150k | 80.178% | 15.930% | 3.416% | 0.476% |
| DRINK, TARGET 100k | 79.821% | 16.167% | 3.562% | 0.450% |
| FOOD, HARD_MAX 50k | 83.343% | 16.657% | 0% | 0% |
| FOOD, hotpot/grill only | 0% | 79.760% | 17.672% | 2.568% |
| FOOD, consecutive re-spins | 80.051% | 16.009% | 3.476% | 0.464% |
| Common/legendary pair, consecutive re-spins | 99.385% | 0% | 0% | 0.615% |

The pair's expected legendary share is 0.5 / 80.5 = 0.6211%, rather than the old forced 50%.
Within a short real session, streaks can still occur. A 0.5% chance is not a promise of a
legendary item every 200 opens.

## Regression evidence and integration

Four initial new tests failed against v1 for population balance, real winner selection,
TARGET isolation and missing-tier normalization. They passed after the v2 change. A separate
test reproduced forced high-tier re-spin alternation and passed after the same-tier exception.
Additional coverage checks displayed odds, cosmetic sampling and browser filter updates.

The implementation lives in the independent review copy. It has not been merged back into
the concurrently edited original or deployed. Reconcile the outdated RANK-011/014/015/029
requirements in the workbook when adopting v2; the live workbook was not changed.

TASK COMPLETED
