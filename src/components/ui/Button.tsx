import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-chili-500 text-paper hover:bg-chili-600 active:bg-chili-600",
  secondary: "bg-canvas-200 text-ink-900 border border-ink-900/15 hover:bg-canvas-200/70",
  ghost: "bg-transparent text-ink-900 hover:bg-ink-900/5 active:bg-ink-900/10 border border-ink-900/15",
};

const SIZE_CLASS: Record<Size, string> = {
  // DS-019: >=44px touch target for primary controls.
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-hnag font-semibold transition-colors",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...props}
    />
  );
}
