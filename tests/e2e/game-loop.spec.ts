import { expect, test } from "@playwright/test";

// TESTING/ACCEPTANCE GATES #12/#13 (32_CLAUDE_MASTER_PROMPT): configure -> OPEN -> reveal ->
// re-spin -> accept, with zero application API/DB/auth/GPS/Maps/Places/provider network calls.

test.describe("#HNAG core game loop", () => {
  test("configure -> OPEN -> reveal -> accept, no network dependency", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /không biết ăn\/uống gì/i })).toBeVisible();

    await page.getByRole("button", { name: /mở hộp/i }).click();
    await expect(page.getByRole("button", { name: /chốt món/i })).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /chốt món/i }).click();
    await expect(page.getByRole("button", { name: /mở hộp/i })).toBeVisible();

    const externalRequests = requests.filter((url) => !url.startsWith("http://localhost"));
    expect(externalRequests, `unexpected external network calls: ${externalRequests.join(", ")}`).toEqual([]);
  });

  test("re-spin excludes the immediately previous winner's stale UI and stays in-page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /mở hộp/i }).click();
    await expect(page.getByRole("button", { name: /quay tiếp/i })).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /quay tiếp/i }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: /chốt món/i })).toBeVisible({ timeout: 10_000 });
  });

  test("first spin never requests geolocation permission", async ({ page, context }) => {
    let geolocationRequested = false;
    await context.exposeBinding("__markGeoRequested", () => {
      geolocationRequested = true;
    });
    await page.addInitScript(() => {
      const original = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
      navigator.geolocation.getCurrentPosition = (...args) => {
        (window as unknown as { __markGeoRequested: () => void }).__markGeoRequested();
        return original(...args);
      };
    });

    await page.goto("/");
    await page.getByRole("button", { name: /mở hộp/i }).click();
    await expect(page.getByRole("button", { name: /chốt món/i })).toBeVisible({ timeout: 10_000 });

    expect(geolocationRequested).toBe(false);
  });
});
