import { describe, expect, it } from "vitest";
import { CRATES, getCrateById, filterItemsForCrate, DEFAULT_CRATE_ID } from "./crates";
import { BUNDLED_CATALOG } from "./catalog";

describe("CRATES definition catalog", () => {
  it("defines exactly 5 CS:GO crates", () => {
    expect(CRATES).toHaveLength(5);
  });

  it("has valid default crate", () => {
    const defaultCrate = getCrateById(DEFAULT_CRATE_ID);
    expect(defaultCrate.id).toBe("crate_food");
    expect(defaultCrate.name).toBe("Hòm Bữa Chính");
  });

  it("returns default crate when queried with unknown id", () => {
    const fallback = getCrateById("unknown_crate_id");
    expect(fallback.id).toBe("crate_food");
  });

  it.each(CRATES)("crate $id has non-empty candidate pool and valid theme", (crate) => {
    expect(crate.id).toBeTruthy();
    expect(crate.name).toBeTruthy();
    expect(crate.icon).toBeTruthy();
    expect(crate.theme.primaryHex).toMatch(/^#[0-9A-F]{6}$/i);

    const items = filterItemsForCrate(BUNDLED_CATALOG, crate);
    expect(items.length).toBeGreaterThanOrEqual(6); // At least 6 items per crate
  });
});
