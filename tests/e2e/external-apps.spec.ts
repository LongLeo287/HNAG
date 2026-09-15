import { expect, test } from "@playwright/test";

// These tests inspect real anchors and click handling. The host has no mobile OS/app
// handlers; intercept native navigation rather than claiming an installed-app launch.
for (const device of [
  { name: "iPhone Safari", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1", protocols: ["grab:", "vn.foody.DeliveryNow:", "xyz.be.customer:", "xanhsm.com:", "comgooglemaps:"] },
  { name: "Android Chrome", userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36", protocols: ["intent:", "intent:", "intent:", "intent:", "intent:"] },
]) {
  test.describe(device.name, () => {
    test.use({ userAgent: device.userAgent, viewport: { width: 390, height: 844 } });

    test("all provider taps target native apps, keep the winner and expose installation recovery", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(() => {
        document.addEventListener("click", (event) => {
          const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
          if (anchor && /^(intent|grab|vn\.foody\.DeliveryNow|xyz\.be\.customer|xanhsm\.com|comgooglemaps):/i.test(anchor.getAttribute("href") ?? "")) {
            event.preventDefault();
            document.documentElement.dataset.nativeAttempt = anchor.getAttribute("href") ?? "";
          }
        }, true);
      });
      const externalRequests: string[] = [];
      page.on("request", (request) => { if (new URL(request.url()).hostname !== "127.0.0.1") externalRequests.push(request.url()); });
      await page.goto("/");
      await page.getByRole("button", { name: /mở hộp/i }).click();
      const result = page.getByRole("dialog", { name: "Kết quả mở hòm" });
      await expect(result).toBeVisible();
      const winner = await result.getByRole("heading").first().innerText();
      const labels = [/^GrabFood/, /^ShopeeFood/, /^beFood/, /^Xanh SM/, /Tìm quán gần bạn trên Google Maps/];
      const providers = ["GrabFood", "ShopeeFood", "beFood", "Xanh SM", "Google Maps"];
      for (let i = 0; i < labels.length; i++) {
        const link = result.getByRole("link", { name: labels[i] });
        const href = await link.getAttribute("href");
        expect(href?.startsWith(device.protocols[i]!)).toBe(true);
        await expect(link).toHaveAttribute("target", "_self");
        await link.click();
        await expect(page.locator("html")).toHaveAttribute("data-native-attempt", href!);
        const install = result.getByRole("link", { name: `Cài hoặc cập nhật ${providers[i]} ↗`, exact: true });
        await expect(install).toBeVisible();
        await expect(install).toHaveAttribute("href", device.name.startsWith("iPhone") ? /^https:\/\/apps\.apple\.com\// : /^https:\/\/play\.google\.com\//);
        await expect(result.getByRole("heading").first()).toHaveText(winner);
      }
      expect(externalRequests).toEqual([]);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      // Page width alone misses overflow inside the independently scrolling result box.
      for (const width of [390, 320]) {
        await page.setViewportSize({ width, height: 844 });
        await expect.poll(() => result.evaluate((root) => Array.from(root.querySelectorAll<HTMLElement>("*"))
          .filter((element) => /auto|scroll/.test(getComputedStyle(element).overflowY))
          .every((element) => element.scrollWidth <= element.clientWidth + 1))).toBe(true);
      }
      await result.getByRole("button", { name: /chốt món/i }).click();
      await expect(page.getByRole("button", { name: /mở hộp/i })).toBeEnabled();
    });
  });
}
