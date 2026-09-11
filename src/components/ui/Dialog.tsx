import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

/**
 * Local accessible dialog built on the native <dialog> element: focus trap, Esc-to-close and
 * top-layer stacking come from the browser for free, no @base-ui/react dependency (UI-050).
 */
export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="m-auto w-[min(92vw,32rem)] max-h-[85vh] overflow-y-auto rounded-hnag border border-ink-900/10 bg-canvas-200 p-0 backdrop:bg-black/60"
      onClose={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
    >
      <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
        <h2 id={titleId} className="text-lg font-semibold text-ink-900">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Đóng"
          className="min-h-11 min-w-11 rounded-hnag text-ink-900 hover:bg-ink-900/5"
        >
          ✕
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
