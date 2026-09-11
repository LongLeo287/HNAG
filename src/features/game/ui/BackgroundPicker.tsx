import { LANDMARKS } from "@/data/backgrounds";
import { Chip } from "@/components/ui/Chip";

interface BackgroundPickerProps {
  value: string;
  onChange: (landmarkId: string) => void;
}

/** User-selectable backdrop (per user request 2026-09-11) — cosmetic only, never affects the pool. */
export function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Khung cảnh</span>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Chọn khung cảnh nền">
        {LANDMARKS.map((landmark) => (
          <Chip key={landmark.id} pressed={value === landmark.id} onClick={() => onChange(landmark.id)}>
            {landmark.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
