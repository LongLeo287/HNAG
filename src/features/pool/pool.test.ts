import { describe, expect, it } from "vitest";
import { makeItem } from "@/test/factories";
import { addCustomItem, combinePool, removeCustomItem, toggleBuiltIn } from "./pool";
import { EMPTY_POOL_PROFILE, MAX_CUSTOM_ITEMS } from "./types";
import { createCustomItem } from "./customItem";

describe("combinePool", () => {
  it("a disabled built-in never appears as enabled", () => {
    const bundled = [makeItem({ id: "a" }), makeItem({ id: "b" })];
    const profile = toggleBuiltIn(EMPTY_POOL_PROFILE, "a", false);
    const pool = combinePool(bundled, profile);
    expect(pool.find((i) => i.id === "a")?.enabled).toBe(false);
    expect(pool.find((i) => i.id === "b")?.enabled).toBe(true);
  });

  it("includes custom items alongside bundled ones", () => {
    const bundled = [makeItem({ id: "a" })];
    const created = createCustomItem({
      kind: "FOOD",
      name: "Món của tôi",
      categoryId: "com",
      priceVnd: 25000,
      vegetarianPossible: true,
    });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const { profile } = addCustomItem(EMPTY_POOL_PROFILE, created.item) as {
      ok: true;
      profile: typeof EMPTY_POOL_PROFILE;
    };
    const pool = combinePool(bundled, profile);
    expect(pool.map((i) => i.id)).toContain(created.item.id);
  });
});

describe("addCustomItem", () => {
  it(`rejects a ${MAX_CUSTOM_ITEMS + 1}th custom item`, () => {
    let profile = EMPTY_POOL_PROFILE;
    for (let i = 0; i < MAX_CUSTOM_ITEMS; i += 1) {
      const created = createCustomItem({
        kind: "FOOD",
        name: `Món ${i}`,
        categoryId: "com",
        priceVnd: 20000,
        vegetarianPossible: false,
      });
      if (!created.ok) throw new Error("unexpected validation failure");
      const result = addCustomItem(profile, created.item);
      if (!result.ok) throw new Error("unexpected capacity failure");
      profile = result.profile;
    }
    const overflow = createCustomItem({
      kind: "FOOD",
      name: "Món thừa",
      categoryId: "com",
      priceVnd: 20000,
      vegetarianPossible: false,
    });
    if (!overflow.ok) throw new Error("unexpected validation failure");
    const result = addCustomItem(profile, overflow.item);
    expect(result.ok).toBe(false);
  });
});

describe("removeCustomItem", () => {
  it("removes exactly the targeted item", () => {
    const created = createCustomItem({
      kind: "DRINK",
      name: "Trà của tôi",
      categoryId: "tra",
      priceVnd: 20000,
      vegetarianPossible: true,
    });
    if (!created.ok) throw new Error("unexpected validation failure");
    const added = addCustomItem(EMPTY_POOL_PROFILE, created.item);
    if (!added.ok) throw new Error("unexpected capacity failure");
    const result = removeCustomItem(added.profile, created.item.id);
    expect(result.customItems).toHaveLength(0);
  });
});

describe("createCustomItem validation", () => {
  it("rejects a category from the other kind", () => {
    expect(createCustomItem({ kind: "DRINK", name: "Trà nhà", categoryId: "com", priceVnd: null, vegetarianPossible: true }).ok).toBe(false);
  });

  it("rejects a name made empty by normalization", () => {
    expect(createCustomItem({ kind: "FOOD", name: "\u0000\u0001", categoryId: "com", priceVnd: null, vegetarianPossible: true }).ok).toBe(false);
  });
  it("rejects an empty name", () => {
    const result = createCustomItem({
      kind: "FOOD",
      name: "   ",
      categoryId: "com",
      priceVnd: 20000,
      vegetarianPossible: false,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects an out-of-range price instead of clamping silently", () => {
    const result = createCustomItem({
      kind: "FOOD",
      name: "Món quá đắt",
      categoryId: "com",
      priceVnd: 50_000_000,
      vegetarianPossible: false,
    });
    expect(result.ok).toBe(false);
  });

  it("allows a null price (unknown, never coerced to 0)", () => {
    const result = createCustomItem({
      kind: "FOOD",
      name: "Món chưa rõ giá",
      categoryId: "com",
      priceVnd: null,
      vegetarianPossible: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.item.priceVnd).toBeNull();
  });
});
