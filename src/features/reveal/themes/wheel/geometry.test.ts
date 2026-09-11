import { describe, expect, it } from "vitest";
import { makeItem } from "@/test/factories";
import {
  WHEEL_SEGMENT_COUNT,
  WHEEL_WINNER_INDEX,
  buildWheelSegments,
  currentSegmentIndex,
  finalAngleDeg,
} from "./geometry";

describe("wheel geometry", () => {
  it("buildWheelSegments always places the winner at WHEEL_WINNER_INDEX", () => {
    const winner = makeItem({ id: "winner" });
    const segments = buildWheelSegments(winner, [makeItem({ id: "d1" }), makeItem({ id: "d2" })]);
    expect(segments).toHaveLength(WHEEL_SEGMENT_COUNT);
    expect(segments[WHEEL_WINNER_INDEX]?.id).toBe("winner");
  });

  it.each([0, 1, 3, 5, 9])("finalAngleDeg/currentSegmentIndex round-trip for winnerIndex=%i", (winnerIndex) => {
    const angle = finalAngleDeg(winnerIndex);
    expect(currentSegmentIndex(angle)).toBe(winnerIndex);
  });

  it("finalAngleDeg always includes multiple full spins (visually satisfying, not an instant snap)", () => {
    expect(finalAngleDeg(0)).toBeGreaterThan(360 * 4);
  });
});
