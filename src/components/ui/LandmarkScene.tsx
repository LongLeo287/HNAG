import type { JSX } from "react";

/**
 * Original flat-silhouette illustrations for the user-selectable backdrop (docs/decisions.md,
 * "Vietnamese landmark backdrop"). Deliberately low-detail/low-contrast — this sits *behind*
 * the game, not competing with OPEN/reveal (CODE-039). No photography, nothing traced from any
 * real photo/logo — plain geometric shapes only.
 */
function HoGuom() {
  return (
    <>
      <circle cx="330" cy="34" r="16" fill="var(--color-turmeric-500)" opacity="0.5" />
      <rect x="0" y="120" width="400" height="80" fill="var(--color-rare-500)" opacity="0.18" />
      <path d="M40 130 Q60 90 80 130 Z" fill="var(--color-epic-500)" opacity="0.22" />
      <path d="M170 100 h10 v10 h-10 Z M172 90 h6 v10 h-6 Z M174 82 h2 v8 h-2 Z" fill="var(--color-steel-400)" opacity="0.3" />
      <ellipse cx="176" cy="128" rx="30" ry="6" fill="var(--color-steel-500)" opacity="0.2" />
      <path
        d="M220 128 Q280 70 340 128"
        fill="none"
        stroke="var(--color-chili-500)"
        strokeWidth="4"
        opacity="0.25"
      />
    </>
  );
}

function BenThanh() {
  return (
    <>
      <rect x="0" y="140" width="400" height="60" fill="var(--color-steel-500)" opacity="0.14" />
      <path d="M150 140 V90 L200 60 L250 90 V140 Z" fill="var(--color-steel-400)" opacity="0.28" />
      <circle cx="200" cy="88" r="12" fill="var(--color-turmeric-500)" opacity="0.4" />
      <rect x="90" y="120" width="50" height="20" fill="var(--color-steel-500)" opacity="0.2" />
      <rect x="260" y="120" width="50" height="20" fill="var(--color-steel-500)" opacity="0.2" />
    </>
  );
}

function CauRong() {
  return (
    <>
      <rect x="0" y="150" width="400" height="50" fill="var(--color-rare-500)" opacity="0.18" />
      <path d="M20 138 Q200 90 380 138" fill="none" stroke="var(--color-steel-400)" strokeWidth="5" opacity="0.28" />
      <path
        d="M340 138 q18 -10 26 -28 q4 8 -2 18 q10 -4 14 -14 q0 12 -12 22 q8 0 14 -6 q-6 14 -22 16 Z"
        fill="var(--color-epic-500)"
        opacity="0.3"
      />
    </>
  );
}

function HaLong() {
  return (
    <>
      <rect x="0" y="150" width="400" height="50" fill="var(--color-rare-500)" opacity="0.2" />
      <path d="M10 150 Q30 100 50 150 Z" fill="var(--color-steel-500)" opacity="0.24" />
      <path d="M60 150 Q95 80 130 150 Z" fill="var(--color-steel-400)" opacity="0.22" />
      <path d="M180 150 Q210 110 240 150 Z" fill="var(--color-steel-500)" opacity="0.2" />
      <path d="M280 150 Q320 90 360 150 Z" fill="var(--color-steel-400)" opacity="0.22" />
      <path d="M150 148 l14 -6 l14 6 Z" fill="var(--color-chili-500)" opacity="0.3" />
    </>
  );
}

function HoiAn() {
  return (
    <>
      <rect x="0" y="150" width="400" height="50" fill="var(--color-epic-500)" opacity="0.14" />
      <path d="M160 150 v-14 q40 -18 80 0 v14 Z" fill="var(--color-steel-500)" opacity="0.26" />
      {[60, 100, 300, 340].map((cx) => (
        <circle key={cx} cx={cx} cy={70 + (cx % 40)} r="7" fill="var(--color-turmeric-500)" opacity="0.4" />
      ))}
    </>
  );
}

function ChoNoi() {
  return (
    <>
      <rect x="0" y="140" width="400" height="60" fill="var(--color-rare-500)" opacity="0.2" />
      <path d="M40 148 q30 -6 60 0 l-6 12 h-48 Z" fill="var(--color-steel-500)" opacity="0.26" />
      <path d="M200 152 q30 -6 60 0 l-6 12 h-48 Z" fill="var(--color-steel-400)" opacity="0.24" />
      <path d="M60 140 l8 -10 l8 10 Z" fill="var(--color-turmeric-500)" opacity="0.35" />
      <path d="M225 144 l8 -10 l8 10 Z" fill="var(--color-turmeric-500)" opacity="0.35" />
    </>
  );
}

const SCENES: Record<string, () => JSX.Element> = {
  "ho-guom": HoGuom,
  "ben-thanh": BenThanh,
  "cau-rong": CauRong,
  "ha-long": HaLong,
  "hoi-an": HoiAn,
  "cho-noi": ChoNoi,
};

export function LandmarkScene({ landmarkId, className }: { landmarkId: string; className?: string }) {
  const Scene = SCENES[landmarkId] ?? HoGuom;
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      <Scene />
    </svg>
  );
}
