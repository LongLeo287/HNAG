import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameShell } from "./GameShell";

beforeEach(() => {
  window.localStorage.clear();
  // Force reduced motion so the reveal resolves via the short timeout path (RANK-030),
  // avoiding a dependency on jsdom's incomplete requestAnimationFrame/layout support.
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("reduce"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
});

describe("GameShell end-to-end game loop (CODE-036: no network/DB/auth involved)", () => {
  it("FEAT-001: configure -> OPEN -> reveal -> accept returns to configuring", async () => {
    const user = userEvent.setup();
    render(<GameShell />);

    expect(screen.getByText(/không biết ăn\/uống gì/i)).toBeInTheDocument();
    const openButton = await screen.findByRole("button", { name: /mở hộp/i });

    await user.click(openButton);

    const acceptButton = await screen.findByRole("button", { name: /chốt món/i }, { timeout: 2000 });
    expect(acceptButton).toBeInTheDocument();

    await user.click(acceptButton);
    expect(await screen.findByRole("button", { name: /mở hộp/i })).toBeInTheDocument();
  });

  it("FEAT-047: re-spin returns to a reveal without navigating away", async () => {
    const user = userEvent.setup();
    render(<GameShell />);

    await user.click(await screen.findByRole("button", { name: /mở hộp/i }));
    await user.click(await screen.findByRole("button", { name: /quay tiếp/i }, { timeout: 2000 }));

    expect(await screen.findByRole("button", { name: /chốt món/i }, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quay tiếp/i })).toBeInTheDocument();
  });

  it("opens Blindbox directly with reduced motion and can reopen after dismissing the result", async () => {
    const user = userEvent.setup();
    render(<GameShell />);
    await user.click(screen.getByRole("radio", { name: /blindbox/i }));
    expect(screen.queryByRole("button", { name: /mở hộp/i })).not.toBeInTheDocument();
    const crate = screen.getByRole("button", { name: /mở rương/i });
    crate.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("button", { name: /chốt món/i }, { timeout: 2000 })).toBeVisible();
    expect(screen.getByRole("button", { name: /mở rương/i })).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("button", { name: "Đóng" }));
    const nextCrate = screen.getByRole("button", { name: /mở rương/i });
    expect(nextCrate).toHaveAttribute("aria-disabled", "false");
    nextCrate.focus();
    await user.keyboard(" ");
    expect(await screen.findByRole("button", { name: /chốt món/i }, { timeout: 2000 })).toBeVisible();
  });
});
