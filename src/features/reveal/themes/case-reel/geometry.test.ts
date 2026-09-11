import { describe, expect, it } from "vitest";
import { makeItem } from "@/test/factories";
import { WINNER_SLOT_INDEX } from "./constants";
import { buildReelSlots, cardStep, currentSlotIndex, finalTranslateXPx } from "./geometry";

const VIEWPORTS_PX = [320, 375, 390, 430, 768, 1024, 1440];

describe("case-reel geometry", () => {
  it.each(VIEWPORTS_PX)("centers the winner under the selector at %ipx viewport width", (viewportWidthPx) => {
    const geometry = { viewportWidthPx, cardWidthPx: 120, cardGapPx: 10 };
    const translateX = finalTranslateXPx(geometry);
    // Inverting the geometry from the computed translateX must land exactly back on the winner slot.
    expect(currentSlotIndex(geometry, translateX)).toBe(WINNER_SLOT_INDEX);
  });

  it("cardStep is width + gap", () => {
    expect(cardStep({ viewportWidthPx: 400, cardWidthPx: 100, cardGapPx: 8 })).toBe(108);
  });

  it("buildReelSlots always places the winner at WINNER_SLOT_INDEX", () => {
    const winner = makeItem({ id: "winner" });
    const decoys = [makeItem({ id: "d1" }), makeItem({ id: "d2" })];
    const slots = buildReelSlots(winner, decoys);
    expect(slots[WINNER_SLOT_INDEX]?.id).toBe("winner");
    expect(slots).toHaveLength(48);
  });

  it("buildReelSlots never crashes with an empty decoy pool", () => {
    const winner = makeItem({ id: "only" });
    const slots = buildReelSlots(winner, []);
    expect(slots[WINNER_SLOT_INDEX]?.id).toBe("only");
    expect(slots.every((slot) => slot.id === "only")).toBe(true);
  });
});
