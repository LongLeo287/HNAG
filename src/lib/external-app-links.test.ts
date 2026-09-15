import { describe, expect, it } from "vitest";
import { buildExternalAppLinks, detectAppPlatform } from "./external-app-links";

describe("external app destinations", () => {
  it.each([
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", 1, "ios"],
    ["Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)", 5, "ios"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Safari/605.1", 5, "ios"],
    ["Mozilla/5.0 (Linux; Android 14) Chrome/128 Mobile", 5, "android"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)", 0, "desktop"],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 0, "desktop"],
  ] as const)("detects app routing for %s", (userAgent, maxTouchPoints, expected) => {
    expect(detectAppPlatform({ userAgent, maxTouchPoints })).toBe(expected);
  });

  it("uses native iPhone schemes, never a new website tab", () => {
    const links = buildExternalAppLinks("Bún bò Huế", "ios");
    expect(links.grab.href).toMatch(/^grab:\/\/open\?/);
    expect(links.shopee.href).toBe("vn.foody.DeliveryNow://home");
    expect(links.be.href).toBe("xyz.be.customer://home");
    expect(links.xanh.href).toBe("xanhsm.com://homepage");
    expect(links.maps.href).toMatch(/^comgooglemaps:\/\//);
    for (const link of Object.values(links)) {
      expect(link.target).toBe("_self");
      expect(new URL(link.installUrl).hostname).toBe("apps.apple.com");
    }
  });

  it("Android intents name the exact consumer package and have a store fallback", () => {
    const links = buildExternalAppLinks("Cơm gà", "android");
    const packages = { grab: "com.grabtaxi.passenger", shopee: "com.deliverynow", be: "xyz.be.customer", xanh: "com.gsm.customer", maps: "com.google.android.apps.maps" };
    for (const id of Object.keys(packages) as (keyof typeof packages)[]) {
      expect(links[id].href).toMatch(/^intent:\/\//);
      expect(links[id].href).toContain(`;package=${packages[id]};`);
      expect(links[id].href).toContain(`S.browser_fallback_url=${encodeURIComponent(links[id].installUrl)};end`);
      expect(links[id].target).toBe("_self");
    }
  });

  it("keeps Unicode and punctuation as query data, including intent delimiters", () => {
    const name = "Bún bò & trà #Intent;package=bad;end + 50% / ?";
    const links = buildExternalAppLinks(name, "ios");
    expect(new URL(links.grab.href).searchParams.get("screenType")).toBe("GRABFOOD");
    expect(new URL(links.grab.href).searchParams.get("searchParameter")).toBe(name);
    expect(new URL(links.maps.href).searchParams.get("q")).toBe(`${name} gần đây`);
    const android = buildExternalAppLinks(name, "android");
    expect(android.grab.href.match(/#Intent/g)).toHaveLength(1);
    expect(android.grab.href).not.toContain(";package=bad;");
  });

  it("desktop keeps normal web links and Grab's reference deeplink parameters", () => {
    const links = buildExternalAppLinks("Bún bò", "desktop");
    const grab = new URL(links.grab.href);
    expect(grab.searchParams.get("search")).toBe("Bún bò");
    expect(grab.searchParams.get("searchParameter")).toBe("Bún bò");
    expect(grab.searchParams.get("support-deeplink")).toBe("true");
    for (const link of Object.values(links)) {
      expect(new URL(link.href).protocol).toBe("https:");
      expect(link.target).toBe("_blank");
    }
  });
});
