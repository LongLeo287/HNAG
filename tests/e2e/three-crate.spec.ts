import { expect, test } from "@playwright/test";

test("Blindbox renders a real 3D case, turns and completes a frozen reveal", async ({page}, testInfo) => {
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/");
  await page.getByRole("radio",{name:/Blindbox/}).click();
  await expect(page.getByTestId("three-crate")).toHaveAttribute("data-renderer","webgl");
  await expect(page.getByTestId("three-crate-canvas")).toHaveAttribute("data-art", "ready");
  const crate = page.getByRole("button", { name: "Mở rương Hòm Bữa Chính" });
  await crate.scrollIntoViewIfNeeded();
  const bounds = (await crate.boundingBox())!;
  const x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await expect(page.getByTestId("three-crate")).toHaveAttribute("data-hovered", "true");
  await page.mouse.down();
  await page.mouse.move(x + 80, y, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole("dialog", { name: "Kết quả mở hòm" })).toHaveCount(0);
  await expect(page.getByTestId("three-crate-canvas")).toHaveAttribute("data-angle", /./);
  await expect(page.getByRole("button", { name: /Mở hộp/ })).toHaveCount(0);
  await expect(page.getByTestId("three-crate-canvas")).toBeVisible();
  await page.getByTestId("three-crate").screenshot({path:testInfo.outputPath("crate-3d.png")});
  await page.getByRole("button",{name:/Mở rương/}).click();
  await expect(page.getByRole("dialog",{name:"Kết quả mở hòm"})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog",{name:"Kết quả mở hòm"})).toHaveCount(0);
  await page.getByRole("button",{name:/Mở rương/}).press("Enter");
  await expect(page.getByRole("dialog",{name:"Kết quả mở hòm"})).toBeVisible();
});

test("phone touch drag rotates without drawing and a following tap opens", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Real touch input requires the mobile project");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("radio", { name: /Blindbox/ }).click();
  const crate = page.getByRole("button", { name: "Mở rương Hòm Bữa Chính" });
  await expect(page.getByTestId("three-crate")).toHaveAttribute("data-renderer", "webgl");
  await crate.scrollIntoViewIfNeeded();
  const bounds = (await crate.boundingBox())!;
  const x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height / 2;
  const input = await page.context().newCDPSession(page);
  await input.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let delta = 10; delta <= 70; delta += 10) {
    await input.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + delta, y }] });
  }
  await input.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.getByTestId("three-crate-canvas")).toHaveAttribute("data-angle", /./);
  await expect(page.getByRole("dialog", { name: "Kết quả mở hòm" })).toHaveCount(0);
  await page.touchscreen.tap(x, y);
  await expect(page.getByRole("dialog", { name: "Kết quả mở hòm" })).toBeVisible();
  await input.detach();
});

test("WebGL unavailable retains the fallback and never blocks the reveal", async ({page}) => {
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.addInitScript(()=>{
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type: string, ...args: unknown[]) {
      if (type === "webgl2") return null;
      return Reflect.apply(original,this,[type,...args]);
    } as typeof original;
  });
  await page.goto("/");
  await page.getByRole("radio",{name:/Blindbox/}).click();
  await expect(page.getByTestId("crate-3d-fallback")).toBeVisible();
  await page.getByRole("button",{name:/Mở rương/}).click();
  await expect(page.getByRole("dialog",{name:"Kết quả mở hòm"})).toBeVisible();
});

test("reduced motion never loads the Three.js renderer or reference art", async ({page}) => {
  const requests: string[] = [];
  page.on("request", request=>requests.push(request.url()));
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await page.getByRole("radio",{name:/Blindbox/}).click();
  await page.getByRole("button",{name:/Mở rương/}).click();
  await expect(page.getByRole("dialog",{name:"Kết quả mở hòm"})).toBeVisible();
  expect(requests.filter(url=>url.includes("crateScene-") || url.includes("/crates/surfaces/"))).toEqual([]);
});

test("context loss switches to fallback and another crate can still render", async ({page}) => {
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/");
  await page.getByRole("radio",{name:/Blindbox/}).click();
  await expect(page.getByTestId("three-crate")).toHaveAttribute("data-renderer","webgl");
  await page.getByTestId("three-crate-canvas").evaluate(canvas=>
    (canvas as HTMLCanvasElement).getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext());
  await expect(page.getByTestId("crate-3d-fallback")).toBeVisible();
  await page.getByRole("radio",{name:/Hòm Ăn Vặt/}).click();
  await expect(page.getByTestId("three-crate")).toHaveAttribute("data-renderer","webgl");
});
