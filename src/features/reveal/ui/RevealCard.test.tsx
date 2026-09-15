import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { makeItem } from "@/test/factories";
import { RevealCard } from "./RevealCard";
afterEach(cleanup);

describe("regional reveal presentation", () => {
  it("only decorates a verified specialty and respects reduced motion", () => {
    const winner = makeItem({name:"Bún bò Huế",regionalSpecialty:{familyId:"bun-bo-hue",locality:"Huế",region:"CENTRAL",sourceUrl:"https://vietnam.travel/things-to-do/vietnam-foodie-guide-region"}});
    const {rerender} = render(<RevealCard winner={winner} winningProbability={.0025} />);
    expect(screen.getByTestId("winner-card")).toHaveClass("specialty-reveal");
    expect(screen.getByTestId("winner-card")).toHaveAttribute("data-specialty-region","CENTRAL");
    expect(screen.getByTestId("winner-probability")).toHaveTextContent("0,25%");
    expect(screen.getByRole("link",{name:/nguồn gốc món/})).toHaveAttribute("href",winner.regionalSpecialty!.sourceUrl);
    rerender(<RevealCard winner={winner} reducedMotion />);
    expect(screen.getByTestId("winner-card")).not.toHaveClass("specialty-reveal");
    rerender(<RevealCard winner={makeItem({province:"Huế"})} />);
    expect(screen.getByTestId("winner-card")).not.toHaveClass("specialty-card");
    expect(screen.queryByText(/Đặc sản vùng miền/)).not.toBeInTheDocument();
  });
});
