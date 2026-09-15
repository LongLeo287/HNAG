import { expect, test } from "@playwright/test";

test("Blindbox renders a real 3D case, turns and completes a frozen reveal", async ({page}, testInfo) => {
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/");
  await page.getByRole("radio",{name:/Blindbox/}).click();
  await expect(page.getByTestId("three-crate")).toHaveAttribute("data-renderer","webgl");
  await page.getByRole("button",{name:"Xoay rương sang phải"}).click();
  await expect(page.getByTestId("three-crate-canvas")).toBeVisible();
  await page.getByTestId("three-crate").screenshot({path:testInfo.outputPath("crate-3d.png")});
  await page.getByRole("button",{name:/Mở hộp/}).click();
  await expect(page.getByRole("dialog",{name:"Kết quả mở hòm"})).toBeVisible();
  await expect(page.getByTestId("three-crate-canvas")).toHaveCount(0);
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
  await page.getByRole("button",{name:/Mở hộp/}).click();
  await expect(page.getByRole("dialog",{name:"Kết quả mở hòm"})).toBeVisible();
});

test("reduced motion never loads the Three.js renderer or reference art", async ({page}) => {
  const requests: string[] = [];
  page.on("request", request=>requests.push(request.url()));
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await page.getByRole("radio",{name:/Blindbox/}).click();
  await page.getByRole("button",{name:/Mở hộp/}).click();
  await expect(page.getByRole("dialog",{name:"Kết quả mở hòm"})).toBeVisible();
  expect(requests.filter(url=>url.includes("crateScene-") || url.includes("/crates/reference/"))).toEqual([]);
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
