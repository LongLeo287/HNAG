# Dish photo briefs — categories still missing dedicated artwork

`DishImage.tsx` currently maps 11/13 categories to a real (AI-generated, 1024x1024) photo under
`public/images/dishes/`. Three categories fall back to a substitute image (`tra`→`cafe.jpg`,
`ep-sinh-to`→`tra-sua.jpg`, `da-xay`→`cafe.jpg`) — functional, but not category-accurate.

These are **original briefs written from scratch for this project** — not descriptions of any
existing photo from truanayangi or any other site (see `docs/decisions.md`, "why we don't copy
truanayangi's images/data"). Hand these to whichever image-generation tool produced the existing
11 photos, matching their established style: warm top-down or 3/4 angle shot, dark neutral
background (`#10151c`→`#151c24` gradient, matching `DishImage.tsx`), soft rim light, no visible
brand/logo/text, no plate/hand holding it unless noted, square 1:1 crop, photorealistic.

## 1. `tra.jpg` — Trà (Vietnamese tea)

A clear glass cup of hot Vietnamese tea (amber-brown liquid, lightly steaming) on a small dark
saucer, viewed at a slight top-down 3/4 angle. A few loose tea leaves or a small teapot silhouette
softly blurred in the background. Warm amber tones against the dark backdrop. No ice, no straw —
this category is hot/traditional tea (`tra-chanh`, `tra-sen`, `tra-gung`, `tra-atiso`, `tra-vai`,
`tra-dao-cam-sa` all live here).

## 2. `ep-sinh-to.jpg` — Nước ép & Sinh tố (fresh juice & smoothies)

A tall glass of vivid orange-to-yellow fresh juice (think carrot/orange blend) with a visible
gradient inside the glass, a striped paper straw, and a thin citrus wheel resting on the rim.
Light condensation droplets on the glass. Bright fruit-forward color pop against the dark
background — this is the most colorful/vivid category (also covers `sinh-to-bo`, `sinh-to-dau`,
`sinh-to-mit`, `sinh-to-xoai`, `nuoc-dua`).

## 3. `da-xay.jpg` — Đá xay (blended ice drinks)

A tall clear plastic cup of a pale mocha/caramel-colored frozen blended drink, visible ice crystals
throughout, topped with a swirl of whipped cream and a light caramel drizzle, clear dome lid, thick
straw. Condensation on the outside of the cup. Should read as "frozen/blended", distinct from the
hot tea and the clear juice photos above (also covers `matcha-da-xay`, `socola-da-xay`,
`caramel-da-xay`, `tra-xanh-da-xay`, `oreo-da-xay`).

## Optional next step: per-item photos instead of per-category

All 77 catalog items currently share one photo per category (13 photos total for 77 dishes), so
several unrelated dishes show the same image. If/when there's appetite for more distinct photos,
the highest-value next targets are the category with the most items sharing one image today:
`lau-nuong` (now 6 items: `lau-thai-hai-san`, `nuong-bbq-vi`, `ga-nuong-mat-ong`, `oc-cac-loai`,
`lau-bo`, `muc-nuong-sa-te`) and `com` (7 items). `DishImage.tsx`'s `DISH_IMAGE_MAP` is keyed by
`categoryId` today; switching a given item to its own photo only requires adding an `itemId`-keyed
lookup ahead of the category fallback — no other component needs to change.
