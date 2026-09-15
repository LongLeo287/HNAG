import { Chip } from "@/components/ui/Chip";

interface MotionModePickerProps {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

const OPTIONS = [
  {
    value: false,
    label: "Bật hiệu ứng",
    isPressed: (val: boolean | null) => val === false || val === null,
  },
  {
    value: true,
    label: "Giảm chuyển động",
    isPressed: (val: boolean | null) => val === true,
  },
] as const;

/**
 * Menu function: manual reduced-motion override (user request: "các hiệu ứng trên HNAG đều mặc định mở").
 * Bật hiệu ứng được kích hoạt mặc định. Người dùng có thể chuyển sang "Giảm chuyển động" bất kỳ lúc nào.
 */
export function MotionModePicker({ value, onChange }: MotionModePickerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Chuyển động</span>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Chọn chế độ chuyển động">
        {OPTIONS.map((option) => (
          <Chip
            key={String(option.value)}
            pressed={option.isPressed(value)}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
