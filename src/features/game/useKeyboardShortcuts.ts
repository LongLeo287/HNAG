import { useEffect } from "react";
import type { GameAudio } from "@/features/audio/gameAudio";

export interface KeyboardShortcutsOptions {
  enabled?: boolean;
  canOpenCase?: boolean;
  hasOpenModal?: boolean;
  onOpenCase: () => void;
  onSelectCrateByIndex: (index: number) => void;
  onCycleCrate: (direction: 1 | -1) => void;
  onToggleKind: (kind?: "FOOD" | "DRINK") => void;
  onCycleTheme: () => void;
  onToggleSettings: () => void;
  onToggleSound: () => void;
  onToggleOdds: () => void;
  onToggleCustomPool: () => void;
  onToggleShortcutsModal: () => void;
  onRespin?: () => void;
  onAccept?: () => void;
  onCloseModals?: () => void;
  audio?: GameAudio;
}

function isTyping(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement | null;
  if (!target || !target.tagName) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    Boolean(target.isContentEditable)
  );
}

/**
 * Global Keyboard Navigation & Hotkeys for #HNAG:
 * Enables complete tactile gaming feel with Space, Numbers 1-5, Arrows, F/D, S, M, O, P, C, R, Esc, and ?.
 */
export function useKeyboardShortcuts({
  enabled = true,
  canOpenCase = false,
  hasOpenModal = false,
  onOpenCase,
  onSelectCrateByIndex,
  onCycleCrate,
  onToggleKind,
  onCycleTheme,
  onToggleSettings,
  onToggleSound,
  onToggleOdds,
  onToggleCustomPool,
  onToggleShortcutsModal,
  onRespin,
  onAccept,
  onCloseModals,
  audio,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in an input field, only allow Escape
      if (isTyping(e)) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
          onCloseModals?.();
        }
        return;
      }

      // Ignore if modifier keys (Ctrl/Meta/Alt) are pressed to avoid interfering with browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      switch (e.key) {
        case " ": {
          e.preventDefault();
          if (hasOpenModal && onAccept) {
            audio?.playShortcutCue();
            onAccept();
          } else if (canOpenCase) {
            audio?.playShortcutCue();
            onOpenCase();
          }
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (hasOpenModal && onAccept) {
            audio?.playShortcutCue();
            onAccept();
          } else if (canOpenCase) {
            audio?.playShortcutCue();
            onOpenCase();
          }
          break;
        }
        case "1":
        case "2":
        case "3":
        case "4":
        case "5": {
          e.preventDefault();
          const index = parseInt(e.key, 10) - 1;
          audio?.playShortcutCue();
          onSelectCrateByIndex(index);
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          audio?.playShortcutCue();
          onCycleCrate(-1);
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          audio?.playShortcutCue();
          onCycleCrate(1);
          break;
        }
        case "f":
        case "F": {
          e.preventDefault();
          audio?.playShortcutCue();
          onToggleKind("FOOD");
          break;
        }
        case "d":
        case "D": {
          e.preventDefault();
          audio?.playShortcutCue();
          onToggleKind("DRINK");
          break;
        }
        case "c":
        case "C": {
          e.preventDefault();
          audio?.playShortcutCue();
          onCycleTheme();
          break;
        }
        case "s":
        case "S": {
          e.preventDefault();
          audio?.playShortcutCue();
          onToggleSettings();
          break;
        }
        case "m":
        case "M": {
          e.preventDefault();
          audio?.playShortcutCue();
          onToggleSound();
          break;
        }
        case "o":
        case "O": {
          e.preventDefault();
          audio?.playShortcutCue();
          onToggleOdds();
          break;
        }
        case "p":
        case "P": {
          e.preventDefault();
          audio?.playShortcutCue();
          onToggleCustomPool();
          break;
        }
        case "r":
        case "R": {
          if (onRespin) {
            e.preventDefault();
            audio?.playShortcutCue();
            onRespin();
          }
          break;
        }
        case "?":
        case "/": {
          e.preventDefault();
          audio?.playShortcutCue();
          onToggleShortcutsModal();
          break;
        }
        case "Escape": {
          onCloseModals?.();
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enabled,
    canOpenCase,
    hasOpenModal,
    onOpenCase,
    onSelectCrateByIndex,
    onCycleCrate,
    onToggleKind,
    onCycleTheme,
    onToggleSettings,
    onToggleSound,
    onToggleOdds,
    onToggleCustomPool,
    onToggleShortcutsModal,
    onRespin,
    onAccept,
    onCloseModals,
    audio,
  ]);
}
