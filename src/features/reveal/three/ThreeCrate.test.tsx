import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CRATES } from "@/data/crates";
import { ThreeCrate } from "./ThreeCrate";

const scene = vi.hoisted(() => ({ pose: vi.fn(), turn: vi.fn(), dispose: vi.fn() }));
const create = vi.hoisted(() => vi.fn());
vi.mock("./crateScene", () => ({ createCrateScene: create }));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

it("disposes the renderer on unmount and applies the current opening phase", async () => {
  create.mockReturnValue(scene);
  const { rerender, unmount } = render(<ThreeCrate crate={CRATES[0]!} />);
  await waitFor(() => expect(screen.getByTestId("three-crate")).toHaveAttribute("data-renderer", "webgl"));
  rerender(<ThreeCrate crate={CRATES[0]!} pose="opening" />);
  expect(scene.pose).toHaveBeenLastCalledWith("opening");
  unmount();
  expect(scene.dispose).toHaveBeenCalledTimes(1);
});

it("renders desktop tier when tier='DESKTOP' is specified", async () => {
  create.mockReturnValue(scene);
  render(<ThreeCrate crate={CRATES[0]!} tier="DESKTOP" />);
  await waitFor(() => {
    expect(create).toHaveBeenCalledWith(
      expect.anything(),
      CRATES[0]!.id,
      CRATES[0]!.theme.primaryHex,
      expect.anything(),
      "desktop",
    );
  });
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-tier", "desktop");
  expect(screen.getByText(/3D \(PC\)/)).toBeVisible();
});

it("renders mobile tier when tier='MOBILE' is specified", async () => {
  create.mockReturnValue(scene);
  render(<ThreeCrate crate={CRATES[0]!} tier="MOBILE" />);
  await waitFor(() => {
    expect(create).toHaveBeenCalledWith(
      expect.anything(),
      CRATES[0]!.id,
      CRATES[0]!.theme.primaryHex,
      expect.anything(),
      "mobile",
    );
  });
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-tier", "mobile");
  expect(screen.getByText(/3D \(Mobile\)/)).toBeVisible();
});

it("renderer initialization failure keeps an accessible image fallback", async () => {
  create.mockImplementation(() => {
    throw new Error("GPU unavailable");
  });
  render(<ThreeCrate crate={CRATES[0]!} />);
  await waitFor(() => expect(create).toHaveBeenCalled());
  expect(screen.getByRole("img", { name: CRATES[0]!.name })).toBeVisible();
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-renderer", "fallback");
});

it("a synchronous first-frame failure cannot publish a blank ready renderer", async () => {
  create.mockImplementation((_host, _id, _accent, fail) => {
    fail();
    return scene;
  });
  render(<ThreeCrate crate={CRATES[0]!} />);
  await waitFor(() => expect(scene.dispose).toHaveBeenCalled());
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-renderer", "fallback");
  expect(scene.pose).not.toHaveBeenCalled();
});

it("a failure during initial pose retains fallback after disposing the renderer", async () => {
  create.mockImplementation((_host, _id, _accent, fail) => {
    scene.pose.mockImplementationOnce(fail);
    return scene;
  });
  render(<ThreeCrate crate={CRATES[0]!} />);
  await waitFor(() => expect(scene.dispose).toHaveBeenCalled());
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-renderer", "fallback");
});
