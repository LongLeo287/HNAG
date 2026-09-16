import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CRATES } from "@/data/crates";
import { ThreeCrate } from "./ThreeCrate";

const scene = vi.hoisted(() => ({ pose: vi.fn(), turn: vi.fn(), dispose: vi.fn(), hitTest: vi.fn(), hover: vi.fn() }));
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
  expect(screen.getByText(/· 3D/)).toBeVisible();
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
  expect(screen.getByText(/· 3D/)).toBeVisible();
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

function pointer(target: HTMLElement, type: string, x = 100, y = 100, extra: Record<string, unknown> = {}) {
  const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: Number(extra.button ?? 0) });
  Object.defineProperties(event, Object.fromEntries(Object.entries({ pointerId: 1, isPrimary: true, pointerType: "mouse", ...extra }).map(([key, value]) => [key, { value }])));
  fireEvent(target, event);
}

async function interactive(props: Partial<React.ComponentProps<typeof ThreeCrate>> = {}) {
  const onOpen = vi.fn();
  const onHover = vi.fn();
  const onInteract = vi.fn();
  create.mockReturnValue(scene);
  scene.hitTest.mockReturnValue(true);
  render(<ThreeCrate crate={CRATES[0]!} onOpen={onOpen} onHover={onHover} onInteract={onInteract} {...props} />);
  if (!props.reducedMotion) await waitFor(() => expect(create).toHaveBeenCalled());
  return { target: screen.getByRole("button", { name: `Mở rương ${CRATES[0]!.name}` }), onOpen, onHover, onInteract };
}

it("opens a direct crate tap once, ignoring its synthesized mouse click", async () => {
  const { target, onOpen, onInteract } = await interactive();
  pointer(target, "pointerdown", 100, 100, { pointerType: "touch" });
  pointer(target, "pointerup", 101, 102, { pointerType: "touch" });
  fireEvent.click(target, { detail: 1 });
  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(onInteract).toHaveBeenCalled();
});

it("rotates on a left drag and does not open even when dragged back to the starting point", async () => {
  const { target, onOpen } = await interactive();
  pointer(target, "pointerdown");
  pointer(target, "pointermove", 160);
  expect(scene.turn).toHaveBeenLastCalledWith(1.2);
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-dragging", "true");
  pointer(target, "pointermove", 100);
  pointer(target, "pointerup");
  fireEvent.click(target, { detail: 1 });
  expect(onOpen).not.toHaveBeenCalled();
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-dragging", "false");
});

it("ignores right clicks, off-model clicks, canceled gestures, and secondary touches", async () => {
  const { target, onOpen } = await interactive();
  pointer(target, "pointerdown", 100, 100, { button: 2 });
  pointer(target, "pointerup", 100, 100, { button: 2 });
  scene.hitTest.mockReturnValue(false);
  pointer(target, "pointerdown");
  pointer(target, "pointerup");
  scene.hitTest.mockReturnValue(true);
  pointer(target, "pointerdown");
  pointer(target, "pointercancel");
  pointer(target, "pointerup");
  pointer(target, "pointerdown");
  pointer(target, "pointerdown", 100, 100, { isPrimary: false, pointerId: 2 });
  pointer(target, "pointerup");
  expect(onOpen).not.toHaveBeenCalled();
});

it("highlights and requests the hover cue once per entry without unlocking audio", async () => {
  const { target, onHover, onInteract } = await interactive();
  pointer(target, "pointermove");
  pointer(target, "pointermove");
  expect(scene.hover).toHaveBeenLastCalledWith(true);
  expect(onHover).toHaveBeenCalledTimes(1);
  expect(onInteract).not.toHaveBeenCalled();
  scene.hitTest.mockReturnValue(false);
  pointer(target, "pointermove");
  expect(scene.hover).toHaveBeenLastCalledWith(false);
});

it("allows keyboard rotation and opens on Enter without repeated-key duplicate draws", async () => {
  const { target, onOpen } = await interactive();
  fireEvent.keyDown(target, { key: "ArrowRight" });
  expect(scene.turn).toHaveBeenLastCalledWith(1);
  fireEvent.keyDown(target, { key: "Enter" });
  fireEvent.keyDown(target, { key: "Enter", repeat: true });
  expect(onOpen).toHaveBeenCalledTimes(1);
});

it("blocks pointer, keyboard, and assistive activation when disabled", async () => {
  const { target, onOpen, onHover } = await interactive({ disabled: true });
  pointer(target, "pointermove");
  pointer(target, "pointerdown");
  pointer(target, "pointerup");
  fireEvent.keyDown(target, { key: " " });
  fireEvent.click(target, { detail: 0 });
  expect(target).toHaveAttribute("aria-disabled", "true");
  expect(onOpen).not.toHaveBeenCalled();
  expect(onHover).not.toHaveBeenCalled();
});

it("skips Three.js for reduced motion and opens the static fallback by keyboard", async () => {
  const { target, onOpen } = await interactive({ reducedMotion: true });
  expect(create).not.toHaveBeenCalled();
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-renderer", "fallback");
  fireEvent.keyDown(target, { key: " " });
  expect(onOpen).toHaveBeenCalledTimes(1);
});

it("cancels an in-flight drag when externally disabled, including its stale release", async () => {
  create.mockReturnValue(scene);
  scene.hitTest.mockReturnValue(true);
  const onOpen = vi.fn();
  const { rerender } = render(<ThreeCrate crate={CRATES[0]!} onOpen={onOpen} />);
  await waitFor(() => expect(create).toHaveBeenCalled());
  const target = screen.getByRole("button");
  pointer(target, "pointerdown");
  pointer(target, "pointermove", 160);
  rerender(<ThreeCrate crate={CRATES[0]!} onOpen={onOpen} disabled />);
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-dragging", "false");
  rerender(<ThreeCrate crate={CRATES[0]!} onOpen={onOpen} />);
  pointer(target, "pointerup");
  expect(onOpen).not.toHaveBeenCalled();
  expect(screen.getByTestId("three-crate")).toHaveAttribute("data-dragging", "false");
});

it("safely abandons a pointer whose capture fails and still supports keyboard opening", async () => {
  const { target, onOpen } = await interactive();
  target.setPointerCapture = () => { throw new DOMException("Pointer no longer active"); };
  pointer(target, "pointerdown");
  pointer(target, "pointerup");
  expect(onOpen).not.toHaveBeenCalled();
  fireEvent.keyDown(target, { key: "Enter" });
  expect(onOpen).toHaveBeenCalledTimes(1);
});
