import { cx } from "@/lib/cx";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}

/** Local accessible switch — native checkbox semantics, styled, not a @base-ui/react wrapper. */
export function Switch({ checked, onChange, label, id }: SwitchProps) {
  return (
    <label htmlFor={id} className="inline-flex min-h-11 cursor-pointer items-center gap-3 select-none">
      <span className="text-sm font-medium text-ink-900">{label}</span>
      <span className="relative inline-flex h-7 w-12 shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cx(
            "absolute inset-0 rounded-full transition-colors",
            checked ? "bg-leaf-500" : "bg-ink-900/20",
          )}
        />
        <span
          className={cx(
            "absolute size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </span>
    </label>
  );
}
