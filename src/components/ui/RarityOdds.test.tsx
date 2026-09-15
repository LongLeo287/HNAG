import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeItem } from "@/test/factories";
import { RarityOdds } from "./RarityOdds";

describe("displayed draw odds", () => {
  it("aggregates actual item probabilities rather than hardcoding base percentages", () => {
    render(<RarityOdds odds={{ eligiblePool: [makeItem(), makeItem(), makeItem({ rarity: "DINH" })], probabilities: [0.4, 0.5, 0.1] }} />);
    const region = screen.getByRole("region", { name: "Tỉ lệ mở hộp" });
    expect(within(region).getByText("90%")).toBeInTheDocument();
    expect(within(region).getByText("10%")).toBeInTheDocument();
    expect(within(region).getAllByText("0%")).toHaveLength(2);
    expect(within(region).getByText(/hạng không có món phù hợp/i)).toBeInTheDocument();
  });
  it("shows the singleton re-spin exception and no impossible empty odds", () => {
    const { rerender } = render(<RarityOdds respin odds={{ eligiblePool: [makeItem()], probabilities: [1] }} />);
    expect(screen.getByText(/hạng chỉ có một món có thể lặp lại/i)).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    rerender(<RarityOdds odds={{ eligiblePool: [], probabilities: [] }} />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
