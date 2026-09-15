import { expect, test } from "@playwright/test";

test.use({ timezoneId: "Asia/Bangkok" });

for (const mode of ["Case Reel", "Blindbox", "Vòng quay", "Slot Machine", "Lật bài"]) {
  test(`rarity odds and result survive the ${mode} reveal`, async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-09-12T10:00:00+07:00"));
    await page.goto("/");
    await page.getByRole("radiogroup", { name: "Chọn kiểu mở kết quả" }).getByRole("radio", { name: new RegExp(mode) }).click();
    await page.getByRole("button", { name: /mở hộp/i }).click();
    const result = page.getByRole("dialog", { name: "Kết quả mở hòm" });
    await expect(result).toBeVisible({ timeout: 10000 });
    await expect(result.getByRole("region", { name: "Tỉ lệ quay tiếp" }).locator("dd")).toHaveText(["80%", "16%", "3,5%", "0,5%"]);
    await result.getByRole("button", { name: /chốt món/i }).click();
    await expect(page.getByRole("radio", { name: new RegExp(mode) })).toHaveAttribute("aria-checked", "true");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("hnag_spin_count"))).toBe("1");
  });
}

test("all six crates expose filtered odds and keep them through open, repeat and accept", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-12T10:00:00+07:00"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const crates = page.getByRole("radiogroup", { name: "Danh sách hòm tiếp tế" }).getByRole("radio");
  await expect(crates).toHaveCount(4);
  await page.getByRole("checkbox",{name:"Lọc gợi ý theo giờ và thời tiết đã xác định"}).uncheck();
  for (const name of ["Hòm Bữa Chính","Hòm Ăn Vặt","Hòm Ăn Nhậu","Hòm Đồ Chay","Hòm Giải Khát","Hòm Đồ Uống Có Cồn"]) {
    if (name === "Hòm Giải Khát") await page.getByRole("radiogroup",{name:"Ăn hay uống"}).getByRole("radio",{name:/Đồ uống/}).click();
    const selected = crates.filter({hasText:name});
    await selected.click();
    await expect(selected).toHaveAttribute("aria-checked", "true");
    await page.getByRole("button", { name: /tỉ lệ mở theo bộ lọc/i }).click();
    const region = page.getByRole("region", { name: "Tỉ lệ mở hộp", exact: true });
    await expect(region).toBeVisible();
    const expected = await region.locator("dd").allTextContents();
    expect(expected.map((value)=>Number(value.replace("%","").replace(",","."))).reduce((a,b)=>a+b,0)).toBeCloseTo(100,1);
    await page.keyboard.press("Escape");
    await expect(region).not.toBeVisible();
    await page.getByRole("button", { name: /mở hộp/i }).click();
    const result = page.getByRole("dialog", { name: "Kết quả mở hòm" });
    await expect(result).toBeVisible();
    await expect(result.getByRole("region", { name: "Tỉ lệ quay tiếp", exact: true }).locator("dd")).toHaveText(expected);
    await result.getByRole("button", { name: "Quay tiếp", exact: false }).click();
    await expect(result).toBeVisible();
    await result.getByRole("button", { name: /chốt món/i }).click();
    await expect(result).not.toBeVisible();
  }
  await expect.poll(() => page.evaluate(() => localStorage.getItem("hnag_spin_count"))).toBe("12");
});

test("kind control switches the active crate and still produces a result with matching odds", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("radio", { name: /đồ uống/i }).click();
  await expect(page.getByRole("radio", { name: /Hòm Giải Khát/i })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: /mở hộp/i }).click();
  const result = page.getByRole("dialog", { name: "Kết quả mở hòm" });
  await expect(result).toBeVisible();
  await expect(result.getByRole("region", { name: "Tỉ lệ quay tiếp" })).toBeVisible();
});
