import { expect, test } from "@playwright/test";
import { BUNDLED_CATALOG } from "../../src/data/catalog";

test.beforeEach(async ({page}) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await page.getByRole("checkbox",{name:"Lọc gợi ý theo giờ và thời tiết đã xác định"}).uncheck();
});

test("food/drink crates and categories stay isolated through switching, filtering and reload", async ({page}) => {
  const rack = page.getByRole("radiogroup",{name:"Danh sách hòm tiếp tế"});
  const kind = page.getByRole("radiogroup",{name:"Ăn hay uống"});
  await expect(rack.getByRole("radio")).toHaveCount(4);
  await expect(rack.getByRole("radio",{name:/Giải Khát/})).toHaveCount(0);
  await rack.getByRole("radio",{name:/Hòm Ăn Vặt/}).click();
  const categories = page.getByRole("group",{name:"Lọc theo loại món"});
  await expect(categories.getByRole("button",{name:/Tráng miệng/})).toBeVisible();
  await expect(categories.getByRole("button",{name:/Cơm/})).toHaveCount(0);
  await categories.getByRole("button",{name:/Tráng miệng/}).click();
  await page.getByRole("button",{name:/Xem .*món có thể quay trúng/}).click();
  await expect(page.locator('#pool-preview [data-item-kind="DRINK"]')).toHaveCount(0);
  await expect(page.locator('#pool-preview [data-category-id="trang-mieng"]')).not.toHaveCount(0);
  await kind.getByRole("radio",{name:/Đồ uống/}).click();
  await expect(rack.getByRole("radio")).toHaveCount(2);
  await expect(categories.getByRole("button",{name:/Trà sữa/})).toBeVisible();
  await expect(categories.getByRole("button",{name:/Đồ uống có cồn/})).toHaveCount(0);
  await expect(page.locator('#pool-preview [data-item-kind="FOOD"]')).toHaveCount(0);
  await expect(page.locator('#pool-preview [data-category-id="co-con"]')).toHaveCount(0);
  await rack.getByRole("radio",{name:/Hòm Đồ Uống Có Cồn/}).click();
  await expect(categories.getByRole("button")).toHaveCount(1);
  await expect(page.locator('#pool-preview [data-category-id="co-con"]')).not.toHaveCount(0);
  await page.reload();
  await expect(rack.getByRole("radio",{name:/Hòm Đồ Uống Có Cồn/})).toHaveAttribute("aria-checked","true");
});

test("category counts, selected crate count and open count agree under the same budget", async ({page}) => {
  await page.getByRole("button",{name:"Tối đa",exact:true}).click();
  await page.getByRole("slider",{name:"Ngân sách tối đa"}).fill("30000");
  await page.getByRole("group",{name:"Lọc theo loại món"}).getByRole("button",{name:/Bánh mì/}).click();
  const selected = page.getByRole("radiogroup",{name:"Danh sách hòm tiếp tế"}).getByRole("radio",{name:/Hòm Bữa Chính/});
  const label = await selected.getAttribute("aria-label");
  const count = Number(label!.match(/, (\d+) món,/)![1]);
  expect(count).toBeGreaterThan(0);
  await expect(page.getByRole("button",{name:/Mở hộp/})).toContainText(`${count} món`);
  await page.getByRole("button",{name:/Xem .*món có thể quay trúng/}).click();
  await expect(page.locator('#pool-preview [data-item-kind]')).toHaveCount(count);
  await expect(page.locator('#pool-preview [data-category-id]:not([data-category-id="banh-mi"])')).toHaveCount(0);
});

test("switching to drinks after dismissing a food result removes the stale winner", async ({page}) => {
  await page.getByRole("button",{name:/Mở hộp/}).click();
  const result = page.getByRole("dialog",{name:"Kết quả mở hòm"});
  await expect(result.getByTestId("winner-card")).toHaveAttribute("data-item-kind","FOOD");
  await result.getByRole("button",{name:"Đóng",exact:true}).click();
  await page.getByRole("radiogroup",{name:"Ăn hay uống"}).getByRole("radio",{name:/Đồ uống/}).click();
  await expect(page.locator('[data-item-kind="FOOD"]')).toHaveCount(0);
  await page.getByRole("button",{name:/Mở hộp/}).click();
  await expect(result.getByTestId("winner-card")).toHaveAttribute("data-item-kind","DRINK");
});

test("a sourced regional winner retains muted audio, exact probability and reduced-motion treatment", async ({page}, testInfo) => {
  // Test-only isolated pool; no random draw is forced in the shipped app.
  await page.evaluate((ids) => localStorage.setItem("hnag:preferences",JSON.stringify({version:1,soundEnabled:false,
    filters:{kind:"FOOD",categoryIds:["bun"],vegetarianOnly:false,budgetMode:"NONE"},disabledBuiltInIds:ids,customItems:[]})),
    BUNDLED_CATALOG.filter((item)=>item.id!=="bun-bo-hue").map((item)=>item.id));
  await page.reload();
  await expect(page.getByTestId("specialty-odds")).toContainText("100%");
  await page.getByRole("button",{name:/Mở hộp/}).click();
  const result = page.getByRole("dialog",{name:"Kết quả mở hòm"});
  await expect(result.getByTestId("winner-card")).toHaveAttribute("data-specialty-region","CENTRAL");
  await expect(result.getByTestId("winner-card")).not.toHaveClass(/specialty-reveal/);
  await expect(result.getByTestId("winner-probability")).toContainText("100%");
  await expect(result.getByRole("link",{name:/nguồn gốc món/})).toHaveAttribute("href",/vietnam.travel/);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem("hnag:preferences")!).soundEnabled)).toBe(false);
  await result.screenshot({path:testInfo.outputPath("regional-winner.png")});
});
