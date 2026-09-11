import { StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { makeItem } from "@/test/factories";
import type { FrozenSelection } from "@/features/randomizer/domain";
import { CaseReel } from "./CaseReel";

function makeFrozenSelection(): FrozenSelection {
  const winner = makeItem({ id: "winner" });
  return {
    algorithmVersion: "randomizer-v1.0.0",
    winner,
    eligiblePool: [winner, makeItem({ id: "decoy-a" }), makeItem({ id: "decoy-b" })],
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
  it(
    "still starts the spin — regression test for the mount/cleanup/remount guard bug " +
      "(a ref that only lets the *first* effect invocation schedule work never fires, " +
      "because StrictMode's synchronous cleanup cancels that first invocation before it runs)",
    async () => {
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

      await waitFor(
        () => {
          expect(strip?.style.transform).not.toBe(initialTransform);
        },
        { timeout: 2000 },
      );

      await waitFor(() => expect(onLanded).toHaveBeenCalledOnce(), { timeout: 2000 });
    },
  );
});
