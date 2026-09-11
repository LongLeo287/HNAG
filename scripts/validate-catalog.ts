import { BUNDLED_CATALOG, BundledCatalogSchema, CATEGORIES } from "../src/data/catalog";
import { readFileSync, statSync } from "node:fs";

// CODE-027/RS-037: validated at build/test time — never a runtime backend query.
function fail(message: string): never {
  console.error(`✖ validate:catalog — ${message}`);
  process.exit(1);
}

const parsed = BundledCatalogSchema.safeParse(BUNDLED_CATALOG);
if (!parsed.success) {
  fail(parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n"));
}

const ids = new Set<string>();
for (const item of BUNDLED_CATALOG) {
  if (ids.has(item.id)) fail(`duplicate item id: ${item.id}`);
  ids.add(item.id);

  const category = CATEGORIES.find((c) => c.id === item.categoryId);
  if (!category) fail(`item ${item.id} references unknown categoryId ${item.categoryId}`);
  if (category && category.kind !== item.kind) {
    fail(`item ${item.id} (${item.kind}) uses a ${category.kind} category (${item.categoryId})`);
  }
}

const foodCount = BUNDLED_CATALOG.filter((i) => i.kind === "FOOD").length;
const drinkCount = BUNDLED_CATALOG.filter((i) => i.kind === "DRINK").length;
if (foodCount === 0 || drinkCount === 0) {
  fail(`both kinds need at least one item (FOOD=${foodCount}, DRINK=${drinkCount})`);
}

// Verify the actual media references used by the UI, not only catalog metadata.
const mediaSource = readFileSync("src/components/ui/DishImage.tsx", "utf-8");
const mediaPaths = new Set(mediaSource.match(/\/images\/dishes\/[a-z-]+\.webp/g) ?? []);
if (mediaPaths.size === 0) fail("no optimized dish media references found");
let mediaBytes = 0;
for (const path of mediaPaths) {
  try {
    const bytes = statSync(`public${path}`).size;
    if (bytes > 60_000) fail(`media exceeds 60 KB item budget: ${path}`);
    mediaBytes += bytes;
  } catch {
    fail(`missing media: ${path}`);
  }
}
if (mediaBytes > 500_000) fail("dish media exceeds 500 KB total budget");
console.log(`✓ validate:media — ${mediaPaths.size} WebP files, ${mediaBytes} bytes total`);

console.log(
  `✓ validate:catalog — ${BUNDLED_CATALOG.length} items OK (${foodCount} FOOD, ${drinkCount} DRINK, ${CATEGORIES.length} categories)`,
);
