/**
 * The pre-spin centerpiece — a Vietnamese three-tier lunch carrier ("cà mèn") standing in for
 * CS2's weapon crate (user reference 2026-09-11: "Unlock Container" screen). Original flat
 * illustration, not traced from any photo/asset; the front decal reuses the bowl-rim-forms-"?"
 * mark from public/favicon.svg (BR-004) so the two placeholder brand marks stay consistent.
 */
export function HeroBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden focusable="false">
      {/* ground shadow */}
      <ellipse cx="100" cy="205" rx="52" ry="8" fill="black" opacity="0.35" />

      {/* handle */}
      <path
        d="M78 42 Q100 10 122 42"
        fill="none"
        stroke="var(--color-steel-500)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect x="72" y="40" width="10" height="14" rx="3" fill="var(--color-steel-500)" />
      <rect x="118" y="40" width="10" height="14" rx="3" fill="var(--color-steel-500)" />

      {/* clip/latch */}
      <rect x="92" y="48" width="16" height="10" rx="2" fill="var(--color-turmeric-500)" />

      {/* three tiers, each with a visible outline so the stack reads clearly */}
      <rect x="52" y="56" width="96" height="46" rx="10" fill="var(--color-steel-400)" stroke="var(--color-canvas-100)" strokeWidth="2" />
      <rect x="48" y="100" width="104" height="50" rx="10" fill="var(--color-steel-500)" stroke="var(--color-canvas-100)" strokeWidth="2" />
      <rect x="52" y="148" width="96" height="46" rx="10" fill="var(--color-steel-400)" stroke="var(--color-canvas-100)" strokeWidth="2" />

      {/* corrugation ridges per tier */}
      {[64, 70, 76].map((y) => (
        <rect key={y} x="58" y={y} width="84" height="1.6" fill="var(--color-canvas-100)" opacity="0.35" />
      ))}
      {[110, 118, 126, 134].map((y) => (
        <rect key={y} x="54" y={y} width="92" height="1.6" fill="var(--color-canvas-100)" opacity="0.3" />
      ))}
      {[156, 162, 168, 174].map((y) => (
        <rect key={y} x="58" y={y} width="84" height="1.6" fill="var(--color-canvas-100)" opacity="0.35" />
      ))}

      {/* tier seams */}
      <rect x="48" y="97" width="104" height="5" rx="2" fill="var(--color-canvas-100)" opacity="0.7" />
      <rect x="48" y="146" width="104" height="5" rx="2" fill="var(--color-canvas-100)" opacity="0.7" />

      {/* highlight */}
      <rect x="60" y="64" width="8" height="120" rx="4" fill="white" opacity="0.14" />

      {/* front decal: bowl rim forms the bottom of "?" — echoes favicon.svg */}
      <circle cx="100" cy="123" r="20" fill="var(--color-canvas-200)" stroke="var(--color-chili-500)" strokeWidth="2" />
      <path
        d="M92 114 C92 109 97 106 102 107.5 C107 109 108 114 104 116.5 C101 118.3 100 120 100 122"
        fill="none"
        stroke="var(--color-ink-900)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="100" cy="128" r="1.8" fill="var(--color-ink-900)" />

      {/* steam */}
      <path d="M84 36 q-4 -6 0 -12 q4 -6 0 -12" fill="none" stroke="var(--color-ink-500)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M116 36 q4 -6 0 -12 q-4 -6 0 -12" fill="none" stroke="var(--color-ink-500)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
