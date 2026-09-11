import { Switch } from "@/components/ui/Switch";

interface SfxToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

/** UI-049: mute/unmute, persisted by the caller. Audio failure never blocks a spin either way. */
export function SfxToggle({ enabled, onChange }: SfxToggleProps) {
  return <Switch id="sfx-toggle" checked={enabled} onChange={onChange} label="Âm thanh 🔊" />;
}
