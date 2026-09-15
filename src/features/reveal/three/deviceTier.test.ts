import { describe, expect, it, vi } from "vitest";
import { resolveCrateTier } from "./deviceTier";

describe("resolveCrateTier", () => {
  it("honors explicit MOBILE preference regardless of device", () => {
    expect(resolveCrateTier("MOBILE")).toBe("mobile");
  });

  it("honors explicit DESKTOP preference regardless of device", () => {
    expect(resolveCrateTier("DESKTOP")).toBe("desktop");
  });

  it("resolves to mobile when screen is narrow (< 768px)", () => {
    vi.stubGlobal("innerWidth", 390);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
    expect(resolveCrateTier("AUTO")).toBe("mobile");
  });

  it("resolves to mobile when coarse pointer (touch) is detected", () => {
    vi.stubGlobal("innerWidth", 1024);
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation((query) => ({
      matches: query === "(pointer: coarse)",
    })));
    expect(resolveCrateTier("AUTO")).toBe("mobile");
  });

  it("resolves to desktop on large screens with fine pointer", () => {
    vi.stubGlobal("innerWidth", 1440);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
    expect(resolveCrateTier("AUTO")).toBe("desktop");
  });
});
