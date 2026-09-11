import type { CandidateItem } from "@/data/catalog";
import { Switch } from "@/components/ui/Switch";

interface BuiltInItemToggleListProps {
  items: CandidateItem[];
  onToggle: (itemId: string, enabled: boolean) => void;
}

/** UI-050 (list portion): the only place a full item list is ever shown — settings, not a public catalog. */
export function BuiltInItemToggleList({ items, onToggle }: BuiltInItemToggleListProps) {
  return (
    <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-2 py-1">
          <Switch
            id={`builtin-${item.id}`}
            checked={item.enabled}
            onChange={(enabled) => onToggle(item.id, enabled)}
            label={item.name}
          />
        </li>
      ))}
    </ul>
  );
}
