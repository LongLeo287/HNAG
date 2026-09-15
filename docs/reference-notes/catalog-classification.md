# Catalog classification review

Reviewed on 2026-09-15. The imported source records remain unchanged. Runtime assembly
applies `src/data/catalog/classification-corrections.ts`, a table of 343 explicit ID
corrections pinned to the expected source name. Import drift fails the identity test
instead of silently treating a replacement record as the same reviewed food.

## Changes

- Separate bread, savory mains/sides and desserts from rice/noodle categories.
- Move ten spoon-eaten desserts (including che and bingsu) out of drinks.
- Separate milk/refreshments from tea and put 52 alcoholic beverage records in their
  own category. The refreshment crate excludes alcohol.
- Exclude nine ambiguous or non-meal records from individual draws: `hnag-0066`,
  `hnag-0067`, `hnag-0068` (beer/food combinations); `hnag-0184` (soup/wine alternative);
  `hnag-0297` (grape syrup/wine alternative); `hnag-0380`, `hnag-0381`, `hnag-0382`
  (soy milk/pastry combinations); `hnag-0550` (fish sauce condiment).
- Preserve original names, descriptions, prices, rarity and vegetarian-version flags.
  Corrections only change kind, category or eligibility. Twelve records change kind;
  two of those are excluded rather than presented as ordinary meals.

The assembled archive still has 1,731 entries: 1,563 FOOD and 168 DRINK, across 18
categories. Nine are disabled. This is an archive count, not the active pool count.
Hard filters, crate selection, preferences and optional context suggestions determine
the actual eligible count displayed in the game.

## Contract and limits

FOOD and DRINK are separate choices before crate selection. FOOD offers four crates;
DRINK offers refreshment and alcohol crates. Category chips belong to the selected
crate; selecting another crate clears previous category narrowing and applies that
crate's vegetarian preset while retaining the budget. Counts, previews and selection
use the same hard-filter function. Empty pools remain empty until the user changes
filters. Switching kind after a reveal clears the previous result from the stage.

This review corrects classification using existing item names/descriptions. It is not
independent certification of all imported culinary details, prices, availability,
ingredients or vegetarian recipes. The UI labels prices as reference and photos as
illustrations. A vegetarian-version flag does not certify a traditional dish as vegan.
Unverified geographic metadata is not enough to assign a specialty designation.
