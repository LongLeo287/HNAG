import { expect, test } from "@playwright/test";

test("empty budget stays editable and can recover without a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Tối đa", exact: true }).click();
  await page.getByRole("slider", { name: "Ngân sách tối đa" }).fill("10000");
  await expect(page.getByRole("button", { name: /mở hộp/i })).toBeDisabled();
  await expect(page.getByText(/không tìm thấy món ăn nào phù hợp/i)).toBeVisible();
  await page.getByRole("button", { name: "Đặt lại bộ lọc", exact: true }).click();
  await expect(page.getByRole("button", { name: /mở hộp/i })).toBeEnabled();
  await page.getByRole("button", { name: /mở hộp/i }).click();
  await expect(page.getByRole("button", { name: /chốt món/i })).toBeVisible({ timeout: 10000 });
});

test("switching to drinks keeps custom categories valid and consecutive additions work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: /đồ uống/i }).click();
  await page.getByRole("button", { name: "Thực đơn của tôi", exact: true }).first().click();
  const dialog = page.getByRole("dialog", { name: "Danh sách món của bạn" });
  await expect(dialog.getByRole("combobox", { name: "Loại", exact: true })).toHaveValue("cafe");
  for (const name of ["Cà phê nhà A", "Cà phê nhà B"]) {
    await dialog.getByLabel("Tên món", { exact: true }).fill(name);
    await dialog.getByRole("button", { name: "Thêm vào danh sách", exact: true }).click();
    await expect(dialog.getByText(name, { exact: true })).toBeVisible();
    await expect(dialog.getByLabel("Tên món", { exact: true })).toHaveValue("");
  }
  await page.reload();
  await page.getByRole("button", { name: "Thực đơn của tôi", exact: true }).first().click();
  await expect(dialog.getByText("Cà phê nhà B", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Đóng", exact: true }).click();
  await expect(dialog).not.toBeVisible();
});

test("completed counter survives reload and settings stay locked during a spin", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /mở hộp/i }).click();
  await page.getByRole("button", { name: /cài đặt/i }).first().click();
  await expect(page.getByRole("button", { name: "Đặt lại tất cả", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: /chốt món/i })).toBeVisible({ timeout: 10000 });
  await expect.poll(() => page.evaluate(() => localStorage.getItem("hnag_spin_count"))).toBe("1");
  await page.getByRole("button", { name: /quay tiếp/i }).click();
  await expect(page.getByRole("button", { name: /chốt món/i })).toBeVisible({ timeout: 10000 });
  await expect.poll(() => page.evaluate(() => localStorage.getItem("hnag_spin_count"))).toBe("2");
  await page.reload();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("hnag_spin_count"))).toBe("2");
});

test("small screen stays within viewport and initial raster payload stays below budget", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /xem .*món có thể quay trúng/i })).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("textbox", { name: /tìm món trong danh sách/i })).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect.poll(async () => {
    return page.evaluate(() => performance.getEntriesByType("resource")
      .filter((entry) => /\/images\/dishes\//.test(entry.name)).length);
  }).toBeGreaterThan(0);
  const resources = await page.evaluate(() => performance.getEntriesByType("resource")
    .filter((entry) => /\/images\/dishes\//.test(entry.name))
    .map((entry) => ({ name: entry.name, bytes: (entry as PerformanceResourceTiming).encodedBodySize })));
  expect(resources.length).toBeGreaterThan(0);
  expect(resources.every((entry) => entry.name.endsWith(".webp"))).toBe(true);
  expect(resources.reduce((sum, entry) => sum + entry.bytes, 0)).toBeLessThan(500000);
  expect(errors).toEqual([]);
});

test("audio and storage failures leave the full game playable with an honest save warning", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "AudioContext", { value: undefined, configurable: true });
    Object.defineProperty(window, "webkitAudioContext", { value: undefined, configurable: true });
    Storage.prototype.setItem = () => { throw new DOMException("Storage unavailable", "QuotaExceededError"); };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Bật âm thanh", exact: true }).click();
  await expect(page.getByText(/trình duyệt chưa lưu được thay đổi/i)).toBeVisible();
  await page.getByRole("button", { name: /mở hộp/i }).click();
  await expect(page.getByRole("button", { name: /chốt món/i })).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: /chốt món/i }).click();
  await expect(page.getByRole("button", { name: /mở hộp/i })).toBeEnabled();
});
