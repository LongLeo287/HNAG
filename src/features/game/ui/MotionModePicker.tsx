import { Chip } from "@/components/ui/Chip";

interface MotionModePickerProps {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

const OPTIONS: { value: boolean | null; label: string }[] = [
  { value: null, label: "Theo máy" },
  { value: false, label: "Bật hiệu ứng" },
  { value: true, label: "Giảm chuyển động" },
];

/**
 * Menu function: manual reduced-motion override (user request 2026-09-11). `null` means "follow
 * the OS/browser prefers-reduced-motion setting" — the pre-existing default behavior, unaffected
 * unless the user explicitly picks one of the other two options (RANK-030/CODE-037 still apply
 * either way — this only decides *which* signal chooses the reduced-motion path).
 */
export function MotionModePicker({ value, onChange }: MotionModePickerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Chuyển động</span>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Chọn chế độ chuyển động">
        {OPTIONS.map((option) => (
          <Chip
            key={String(option.value)}
            pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
