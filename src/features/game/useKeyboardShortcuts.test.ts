import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  it("triggers onOpenCase on Space and Enter when canOpenCase is true", () => {
    const onOpenCase = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onOpenCase,
        canOpenCase: true,
        onSelectCrateByIndex: vi.fn(),
        onCycleCrate: vi.fn(),
        onToggleKind: vi.fn(),
        onCycleTheme: vi.fn(),
        onToggleSettings: vi.fn(),
        onToggleSound: vi.fn(),
        onToggleOdds: vi.fn(),
        onToggleCustomPool: vi.fn(),
        onToggleShortcutsModal: vi.fn(),
      })
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    expect(onOpenCase).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(onOpenCase).toHaveBeenCalledTimes(2);
  });

  it("triggers onSelectCrateByIndex on number keys 1-5", () => {
    const onSelectCrateByIndex = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onOpenCase: vi.fn(),
        onSelectCrateByIndex,
        onCycleCrate: vi.fn(),
        onToggleKind: vi.fn(),
        onCycleTheme: vi.fn(),
        onToggleSettings: vi.fn(),
        onToggleSound: vi.fn(),
        onToggleOdds: vi.fn(),
        onToggleCustomPool: vi.fn(),
        onToggleShortcutsModal: vi.fn(),
      })
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "1" }));
    expect(onSelectCrateByIndex).toHaveBeenCalledWith(0);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "3" }));
    expect(onSelectCrateByIndex).toHaveBeenCalledWith(2);
  });

  it("does not trigger shortcuts when user is typing in an input field", () => {
    const onOpenCase = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onOpenCase,
        canOpenCase: true,
        onSelectCrateByIndex: vi.fn(),
        onCycleCrate: vi.fn(),
        onToggleKind: vi.fn(),
        onCycleTheme: vi.fn(),
        onToggleSettings: vi.fn(),
        onToggleSound: vi.fn(),
        onToggleOdds: vi.fn(),
        onToggleCustomPool: vi.fn(),
        onToggleShortcutsModal: vi.fn(),
      })
    );

    const input = document.createElement("input");
    document.body.appendChild(input);

    const event = new KeyboardEvent("keydown", { key: " " });
    Object.defineProperty(event, "target", { value: input, enumerable: true });
    window.dispatchEvent(event);

    expect(onOpenCase).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
