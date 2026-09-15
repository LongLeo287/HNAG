import { describe, expect, it } from "vitest";
import { BUNDLED_CATALOG, CATEGORIES, FOODS, DRINKS, VIETNAM_CATALOG_ITEMS, bundledItemsForKind } from ".";
import { CLASSIFICATION_CORRECTIONS } from "./classification-corrections";
import { REGIONAL_SPECIALTIES } from "./regional-specialties";
import { combinePool } from "@/features/pool";
const byId = (id: string) => BUNDLED_CATALOG.find((item) => item.id === id)!;

describe("reviewed catalog classification", () => {
  it("pins corrections to the reviewed source identity and valid kind/category pairs", () => {
    const raw = [...FOODS,...DRINKS,...VIETNAM_CATALOG_ITEMS];
    for (const [id,patch] of Object.entries(CLASSIFICATION_CORRECTIONS)) expect(raw.find((item)=>item.id===id)?.name).toBe(patch.expectedName);
    for (const item of BUNDLED_CATALOG) expect(CATEGORIES.find((category)=>category.id===item.categoryId)?.kind).toBe(item.kind);
  });
  it("keeps desserts, fish sauce, alcohol and bread out of incorrect drink/noodle categories", () => {
    for (const id of ["hnag-0342","hnag-0736","hnag-0825"]) expect(byId(id)).toMatchObject({kind:"FOOD",categoryId:"trang-mieng"});
    expect(byId("hnag-0550").enabled).toBe(false);
    expect(byId("hnag-0185")).toMatchObject({kind:"DRINK",categoryId:"co-con"});
    expect(byId("hnag-0016").categoryId).toBe("banh-mi");
    expect(byId("hnag-0744").categoryId).toBe("fastfood");
    expect(byId("hnag-0002").categoryId).toBe("pho-mi");
    expect(bundledItemsForKind("DRINK").some((item)=>!item.enabled)).toBe(false);
  });
  it("cannot re-enable excluded combinations or condiments through personal preferences", () => {
    const excluded = BUNDLED_CATALOG.filter((item)=>!item.enabled);
    expect(excluded).toHaveLength(9);
    expect(combinePool(excluded,{disabledBuiltInIds:[],customItems:[]}).every((item)=>!item.enabled)).toBe(true);
  });
  it("only attaches sourced specialties to unique known FOOD identities, never every province", () => {
    const ids = REGIONAL_SPECIALTIES.flatMap((profile)=>profile.itemIds);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(byId(id)).toMatchObject({kind:"FOOD",regionalSpecialty:{sourceUrl:expect.stringContaining("vietnam.travel/")}});
    expect(byId("hnag-0001").province).toBeTruthy();
    expect(byId("hnag-0001").regionalSpecialty).toBeUndefined();
    expect(byId("hnag-0078").regionalSpecialty).toBeUndefined(); // Phố Hiến is not the Hanoi variant.
  });
});
