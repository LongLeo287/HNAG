import { describe, expect, it } from "vitest";
import { makeItem } from "@/test/factories";
import { sampleDecoy } from "./decoys";

describe("cosmetic decoys", () => {
  const pool = [makeItem({ rarity: "THUONG" }), makeItem({ rarity: "HUYEN_THOAI" })];
  it("uses frozen probabilities instead of flooding the strip with high-rank cards", () => {
    expect(sampleDecoy(pool, [0.995, 0.005], () => 0.9)).toBe(pool[0]);
    expect(sampleDecoy(pool, [0.995, 0.005], () => 0.999)).toBe(pool[1]);
  });
  it("handles empty and singleton visual pools", () => {
    expect(sampleDecoy([], [])).toBeUndefined();
    expect(sampleDecoy([pool[0]!], [1])).toBe(pool[0]);
  });
});
