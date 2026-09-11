import type { CandidateItem } from "@/data/catalog";
import type { FrozenSelection } from "@/features/randomizer/domain";
import { CaseReel } from "@/features/reveal/themes/case-reel/CaseReel";
import { BlindboxReveal } from "@/features/reveal/themes/blindbox/BlindboxReveal";
import { WheelReveal } from "@/features/reveal/themes/wheel/WheelReveal";
import { SlotMachineReveal } from "@/features/reveal/themes/slot-machine/SlotMachineReveal";
import { CardFlipReveal } from "@/features/reveal/themes/card-flip/CardFlipReveal";

interface RevealThemeRendererProps {
  themeId: string;
  frozenSelection: FrozenSelection;
  decoyPool: CandidateItem[];
  caseReelDurationMs: number;
  onTick: () => void;
  onLanded: () => void;
}

/**
 * UI-052: picks the active RevealTheme by id. Every branch receives the exact same
 * `frozenSelection` and can only present it — none of them may re-draw the winner
 * (RANK-021/CODE-019). Adding a new theme means adding one case here, nothing else.
 */
export function RevealThemeRenderer({
  themeId,
  frozenSelection,
  decoyPool,
  caseReelDurationMs,
  onTick,
  onLanded,
}: RevealThemeRendererProps) {
  switch (themeId) {
    case "blindbox":
      return <BlindboxReveal frozenSelection={frozenSelection} onTick={onTick} onLanded={onLanded} />;
    case "wheel":
      return (
        <WheelReveal
          frozenSelection={frozenSelection}
          decoyPool={decoyPool}
          onTick={onTick}
          onLanded={onLanded}
        />
      );
    case "slot-machine":
      return (
        <SlotMachineReveal
          frozenSelection={frozenSelection}
          decoyPool={decoyPool}
          onTick={onTick}
          onLanded={onLanded}
        />
      );
    case "card-flip":
      return <CardFlipReveal frozenSelection={frozenSelection} onTick={onTick} onLanded={onLanded} />;
    case "case-reel":
    default:
      return (
        <CaseReel
          frozenSelection={frozenSelection}
          decoyPool={decoyPool}
          durationMs={caseReelDurationMs}
          onTick={onTick}
          onLanded={onLanded}
        />
      );
  }
}
