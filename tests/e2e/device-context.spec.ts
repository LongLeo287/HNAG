import { expect, test, type Page } from "@playwright/test";

// Virtual device/provider fixtures test error contracts; intercepted requests NEVER reach
// BigDataCloud with invented coordinates. No test data exists in the application bundle.
const instant = Date.parse("2026-09-14T01:05:00Z");
const initialPosition = { latitude: 10.77, longitude: 106.7, accuracy: 15 };
const weatherBody = (patch = {}) => ({ current_units: { temperature_2m: "°C", time: "unixtime" },
  current: { time: Math.floor(instant / 1000) - 300, temperature_2m: 31.5, weather_code: 0, is_day: 1, ...patch } });
async function providers(page: Page, options: { weather?: unknown; placeFails?: boolean } = {}) {
  await page.route("https://api.bigdatacloud.net/**", async (route) => {
    const url = new URL(route.request().url());
    const latitude = Number(url.searchParams.get("latitude"));
    const longitude = Number(url.searchParams.get("longitude"));
    if (options.placeFails) return route.fulfill({ status: 503, body: "unavailable" });
    const city = latitude > 20 ? "Hà Nội" : "Hồ Chí Minh";
    await route.fulfill({ json: { latitude, longitude, lookupSource: "reverseGeocoding", city,
      principalSubdivision: city, countryName: "Việt Nam", countryCode: "VN" } });
  });
  await page.route("https://api.open-meteo.com/**", (route) => route.fulfill({ json: options.weather ?? weatherBody() }));
}

test.describe("actual device context contracts", () => {
  test.use({ timezoneId: "Asia/Ho_Chi_Minh", geolocation: initialPosition, permissions: ["geolocation"] });
  test.beforeEach(async ({ page }) => {
    // Chromium's virtual GPS timestamps use host time, unlike page.clock. Align only
    // this test adapter to the virtual device clock; keep the real coordinate callbacks.
    await page.addInitScript(() => {
      const readPosition = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
      navigator.geolocation.getCurrentPosition = (success, error, options) => readPosition((position) => {
        success({ coords: position.coords, timestamp: Date.now() } as GeolocationPosition);
      }, error, options);
    });
  });

  test("uses device date and lunar calendar; never treats saved overrides as current facts", async ({ page }) => {
    await page.clock.setFixedTime(new Date(instant));
    await page.addInitScript(() => localStorage.setItem("hnag:preferences", JSON.stringify({
      version: 1, soundEnabled: false, filters: { kind: "FOOD", categoryIds: [], vegetarianOnly: false, budgetMode: "NONE" },
      disabledBuiltInIds: [], customItems: [], contextLocation: "Hà Nội", contextWeather: "RAINY_COOL",
      contextMealTime: "DINNER", contextDayType: "WEEKEND", contextAutoSyncTime: false,
    })));
    const requests: string[] = [];
    page.on("request", (request) => { if (request.url().includes("api.")) requests.push(request.url()); });
    await page.goto("/");
    const info = page.getByRole("region", { name: "Thông tin theo thiết bị" });
    await expect(info.getByTestId("device-date")).toContainText("Thứ Hai");
    await expect(info.getByTestId("device-date")).toContainText("14/09/2026");
    await expect(info.getByTestId("device-time")).toHaveText("08:05");
    await expect(info.getByTestId("device-period")).toHaveText("Buổi sáng");
    await expect(info.getByTestId("lunar-date")).toContainText("4/8/2026");
    await expect(info.getByTestId("device-location")).toContainText("Chưa bật vị trí thiết bị");
    await expect(info.getByTestId("device-weather")).toContainText("Chưa có dữ liệu");
    expect(requests).toEqual([]);
  });

  test("loads real-shaped provider data from the virtual device and follows a changed position", async ({ page, context }) => {
    await page.clock.setFixedTime(new Date(instant));
    await providers(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Dùng vị trí thiết bị", exact: true }).click();
    await expect(page.getByTestId("device-location")).toContainText("Hồ Chí Minh");
    await expect(page.getByTestId("device-weather")).toContainText("Trời nắng · 31,5°C");
    await expect(page.getByText(/Sai số thiết bị khoảng 15 m/)).toBeVisible();
    await context.setGeolocation({ latitude: 21.0285, longitude: 105.8542, accuracy: 20 });
    await page.getByRole("button", { name: "Cập nhật vị trí và thời tiết", exact: true }).click();
    await expect(page.getByTestId("device-location")).toContainText("Hà Nội");
    const persisted = await page.evaluate(() => Object.values(localStorage).join(" "));
    expect(persisted).not.toContain("21.0285");
    expect(persisted).not.toContain("106.7");
    await page.reload();
    await expect(page.getByTestId("device-location")).toContainText("Hà Nội");
    await expect(page.getByRole("button", { name: "Dùng vị trí thiết bị", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Tắt dùng vị trí", exact: true }).click();
    await expect(page.getByTestId("device-location")).toContainText("Chưa bật vị trí thiết bị");
    await expect(page.getByTestId("device-weather")).not.toContainText("31,5");
  });

  test("permission denial does not invent a city, weather, or use IP fallback", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
        getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => error({ code: 1 } as GeolocationPositionError),
      } });
    });
    const providerRequests: string[] = [];
    page.on("request", (request) => { if (/api\.(open-meteo|bigdatacloud)/.test(request.url())) providerRequests.push(request.url()); });
    await page.goto("/");
    await page.getByRole("button", { name: "Dùng vị trí thiết bị", exact: true }).click();
    await expect(page.getByTestId("device-location")).toContainText("Chưa được cấp quyền vị trí");
    await expect(page.getByTestId("device-weather")).toContainText("Chưa có vị trí thiết bị");
    expect(providerRequests).toEqual([]);
    await expect(page.getByRole("button", { name: /mở hộp/i })).toBeEnabled();
  });

  test("a missing weather response never overwrites a successfully located city", async ({ page }) => {
    await page.clock.setFixedTime(new Date(instant));
    await providers(page, { weather: weatherBody({ temperature_2m: null }) });
    await page.goto("/");
    await page.getByRole("button", { name: "Dùng vị trí thiết bị", exact: true }).click();
    await expect(page.getByTestId("device-location")).toContainText("Hồ Chí Minh");
    await expect(page.getByTestId("device-weather")).toContainText("Chưa lấy được thời tiết hiện tại");
  });

  test("revoking browser permission clears located facts and ignores pending provider responses", async ({ page, context }) => {
    await page.clock.setFixedTime(new Date(instant));
    await providers(page);
    let releaseWeather!: () => void;
    const heldWeather = new Promise<void>((resolve) => { releaseWeather = resolve; });
    let weatherRequested = false;
    await page.route("https://api.open-meteo.com/**", async (route) => {
      weatherRequested = true;
      await heldWeather;
      await route.fulfill({ json: weatherBody() });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Dùng vị trí thiết bị", exact: true }).click();
    await expect(page.getByTestId("device-location")).toContainText("Hồ Chí Minh");
    await expect.poll(() => weatherRequested).toBe(true);
    await context.clearPermissions();
    await expect(page.getByTestId("device-location")).toContainText("Quyền vị trí không còn được cấp");
    releaseWeather();
    await expect(page.getByTestId("device-weather")).toContainText("Đã ngừng dùng vị trí");
    await expect(page.getByRole("button", { name: "Cập nhật vị trí và thời tiết", exact: true })).toBeEnabled();
    await expect(page.getByTestId("device-location")).not.toContainText("Hồ Chí Minh");
  });

  test("rejects stale weather independently of a reverse-geocoder outage", async ({ page }) => {
    await page.clock.setFixedTime(new Date(instant));
    await providers(page, { placeFails: true, weather: weatherBody({ time: instant / 1000 - 3600 }) });
    await page.goto("/");
    await page.getByRole("button", { name: "Dùng vị trí thiết bị", exact: true }).click();
    await expect(page.getByTestId("device-location")).toContainText("chưa lấy được tên khu vực");
    await expect(page.getByTestId("device-weather")).toContainText("Chưa lấy được thời tiết hiện tại");
  });

  test("keeps current weather when the city provider fails and refreshes automatically", async ({ page }) => {
    await page.clock.install({ time: new Date(instant) });
    await providers(page, { placeFails: true });
    let requests = 0;
    await page.route("https://api.open-meteo.com/**", (route) => {
      requests += 1;
      return route.fulfill({ json: weatherBody({ weather_code: requests > 1 ? 63 : 3, temperature_2m: 28 }) });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Dùng vị trí thiết bị", exact: true }).click();
    await expect(page.getByTestId("device-location")).toContainText("chưa lấy được tên khu vực");
    await expect(page.getByTestId("device-weather")).toContainText("Nhiều mây · 28°C");
    await page.clock.runFor(10 * 60_000);
    await expect(page.getByTestId("device-weather")).toContainText("Mưa vừa · 28°C");
    expect(requests).toBe(2);
  });

  test("updates both calendars at local midnight and keeps Friday a concrete weekday", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-09-18T23:59:55+07:00") });
    await page.goto("/");
    await expect(page.getByTestId("device-date")).toContainText("Thứ Sáu");
    await expect(page.getByTestId("lunar-date")).toContainText("8/8/2026");
    await page.clock.runFor(15_000);
    await expect(page.getByTestId("device-date")).toContainText("Thứ Bảy");
    await expect(page.getByTestId("device-date")).toContainText("19/09/2026");
    await expect(page.getByTestId("lunar-date")).toContainText("9/8/2026");
  });
});

test.describe("device timezone is not assumed to be Vietnam", () => {
  test.use({ timezoneId: "America/Los_Angeles" });
  test("uses the device's Sunday date at the same instant as Monday in Vietnam", async ({ page }) => {
    await page.clock.setFixedTime(new Date(instant));
    await page.goto("/");
    await expect(page.getByTestId("device-date")).toContainText("Chủ Nhật");
    await expect(page.getByTestId("device-date")).toContainText("13/09/2026");
    await expect(page.getByTestId("device-time")).toHaveText("18:05");
    await expect(page.getByTestId("lunar-date")).toContainText("3/8/2026");
    await expect(page.getByRole("region", { name: "Thông tin theo thiết bị" })).toContainText("America/Los_Angeles");
  });
});
