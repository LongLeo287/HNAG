import { StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { makeItem } from "@/test/factories";
import type { FrozenSelection } from "@/features/randomizer/domain";
import { CaseReel } from "./CaseReel";

function makeFrozenSelection(): FrozenSelection {
  const winner = makeItem({ id: "winner" });
  return {
    algorithmVersion: "randomizer-v2.1.0",
    winner,
    eligiblePool: [winner, makeItem({ id: "decoy-a" }), makeItem({ id: "decoy-b" })],
    probabilities: [1 / 3, 1 / 3, 1 / 3],
    context: {
      kind: "FOOD",
      categoryIds: [],
      vegetarianOnly: false,
      budgetMode: "NONE",
    },
    frozenAtMs: Date.now(),
  };
}

describe("CaseReel under React.StrictMode (dev-mode double-effect-invoke)", () => {
  afterEach(() => vi.useRealTimers());

  it(
    "still starts the spin — regression test for the mount/cleanup/remount guard bug " +
      "(a ref that only lets the *first* effect invocation schedule work never fires, " +
      "because StrictMode's synchronous cleanup cancels that first invocation before it runs)",
    async () => {
      // Exercise actual RAF scheduling/cancellation without depending on machine load.
      vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
      const onTick = vi.fn();
      const onLanded = vi.fn();

      render(
        <StrictMode>
          <CaseReel
            frozenSelection={makeFrozenSelection()}
            decoyPool={[]}
            durationMs={600}
            onTick={onTick}
            onLanded={onLanded}
          />
        </StrictMode>,
      );

      const track = screen.getByRole("status", { name: /đang quay chọn món/i });
      const strip = track.firstElementChild?.nextElementSibling as HTMLElement | null;
      expect(strip).not.toBeNull();

      // At mount, translateX is 0 (matrix identity / no transform yet).
      const initialTransform = strip?.style.transform;

      await act(async () => { await vi.advanceTimersByTimeAsync(64); });
      expect(strip?.style.transform).not.toBe(initialTransform);
      expect(onLanded).not.toHaveBeenCalled();

      await act(async () => { await vi.advanceTimersByTimeAsync(700); });
      expect(onLanded).toHaveBeenCalledOnce();
    },
  );
});
