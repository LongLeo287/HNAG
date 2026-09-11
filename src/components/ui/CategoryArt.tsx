import type { JSX } from "react";

/**
 * Enhanced Food & Drink Art:
 * Ceramic dish/cup presentation with rim lighting, depth, delicious textures and vibrant ingredients.
 * Hand-authored original SVG vectors, deterministic accent variation per item ID.
 */

const ACCENT_PALETTE = [
  "#f5b82e", // Gold / Turmeric
  "#e4472e", // Chili Red
  "#4d78e6", // Ocean Blue
  "#a44bdb", // Epic Purple
  "#38bdf8", // Sky Blue
  "#34d399", // Fresh Mint / Herb
  "#fb923c", // Crisp Orange
  "#f43f5e", // Rose
] as const;

function hashItemId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}

interface Accent {
  a: string;
  b: string;
  c: string;
}

function accentFor(itemId: string): Accent {
  const seed = hashItemId(itemId);
  const n = ACCENT_PALETTE.length;
  return {
    a: ACCENT_PALETTE[seed % n] as string,
    b: ACCENT_PALETTE[(seed + 2) % n] as string,
    c: ACCENT_PALETTE[(seed + 5) % n] as string,
  };
}

function CeramicPlate() {
  return (
    <>
      <ellipse cx="32" cy="48" rx="28" ry="8" fill="black" opacity="0.4" />
      <ellipse cx="32" cy="42" rx="28" ry="14" fill="#1b2230" stroke="#334155" strokeWidth="1.5" />
      <ellipse cx="32" cy="42" rx="24" ry="11" fill="#141a24" />
      <ellipse cx="32" cy="41" rx="22" ry="9.5" fill="#0f141d" />
    </>
  );
}

function Steam({ x, delay = "0s" }: { x: number; delay?: string }) {
  return (
    <path
      d={`M${x} 20 q -3 -5 0 -9 q 3 -5 0 -9`}
      fill="none"
      stroke="#94a3b8"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.6"
      style={{ animation: `pulse-status 2s infinite ease-in-out ${delay}` }}
    />
  );
}

const ART: Record<string, (accent: Accent) => JSX.Element> = {
  com: ({ a, b }) => (
    <>
      <CeramicPlate />
      <Steam x={26} />
      <Steam x={38} delay="0.5s" />
      {/* Steaming hot fluffy rice mound */}
      <ellipse cx="32" cy="38" rx="16" ry="8" fill="#f1f5f9" />
      <path d="M16 38 Q32 20 48 38 Z" fill="#ffffff" />
      {/* Savory main topping (grilled pork / braised ribs / chicken) */}
      <ellipse cx="28" cy="35" rx="8" ry="5" fill="#b45309" transform="rotate(-10 28 35)" />
      <ellipse cx="35" cy="37" rx="7" ry="4.5" fill="#d97706" transform="rotate(15 35 37)" />
      {/* Glaze & garnish */}
      <circle cx="28" cy="34" r="1.5" fill={a} />
      <circle cx="36" cy="36" r="1.5" fill={b} />
      {/* Scallion oil & cucumber slice */}
      <circle cx="23" cy="40" r="2" fill="#22c55e" />
      <circle cx="26" cy="41" r="1.8" fill="#16a34a" />
      <ellipse cx="41" cy="40" rx="3.5" ry="2" fill="#86efac" stroke="#15803d" strokeWidth="0.8" />
    </>
  ),
  bun: ({ a, b }) => (
    <>
      <CeramicPlate />
      <Steam x={32} />
      {/* Ceramic Soup Bowl */}
      <path d="M14 34 Q32 54 50 34 L48 40 Q32 56 16 40 Z" fill="#334155" />
      <ellipse cx="32" cy="34" rx="20" ry="8" fill="#78350f" />
      <ellipse cx="32" cy="33.5" rx="18.5" ry="7" fill="#b45309" opacity="0.9" />
      {/* White vermicelli strands */}
      <path d="M18 34 q4 -3 8 0 t8 0 t8 0" fill="none" stroke="#f8fafc" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 37 q4 -3 8 0 t8 0 t8 0" fill="none" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
      {/* Meat balls / slices */}
      <circle cx="25" cy="32" r="3.5" fill={a} />
      <circle cx="39" cy="33" r="3.5" fill={b} />
      {/* Herbs */}
      <circle cx="32" cy="31" r="2" fill="#22c55e" />
      <circle cx="34" cy="36" r="1.8" fill="#16a34a" />
    </>
  ),
  "pho-mi": ({ a }) => (
    <>
      <CeramicPlate />
      <Steam x={28} />
      <Steam x={36} delay="0.6s" />
      {/* Pho bowl with rich broth */}
      <path d="M12 33 Q32 55 52 33 L49 40 Q32 58 15 40 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
      <ellipse cx="32" cy="33" rx="21" ry="8.5" fill="#92400e" />
      {/* Flat noodles */}
      <path d="M17 34 q5 -3 10 0 t10 0 t10 0" fill="none" stroke="#f8fafc" strokeWidth="2.8" strokeLinecap="round" />
      {/* Beef slices */}
      <ellipse cx="25" cy="32" rx="5" ry="3" fill="#be123c" transform="rotate(-15 25 32)" />
      <ellipse cx="36" cy="31" rx="6" ry="3.5" fill="#991b1b" transform="rotate(10 36 31)" />
      {/* Onion rings & fresh chili */}
      <circle cx="30" cy="35" r="2.5" fill="none" stroke="#f8fafc" strokeWidth="1" />
      <circle cx="41" cy="35" r="1.6" fill={a} />
      <circle cx="22" cy="36" r="2" fill="#22c55e" />
      {/* Bamboo chopsticks resting */}
      <line x1="38" y1="12" x2="48" y2="44" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="42" y1="12" x2="52" y2="44" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  "chao-sup": ({ a, b }) => (
    <>
      <CeramicPlate />
      <Steam x={32} />
      <path d="M14 34 Q32 54 50 34 L48 40 Q32 56 16 40 Z" fill="#334155" />
      <ellipse cx="32" cy="34" rx="20" ry="8" fill="#fef3c7" />
      <ellipse cx="32" cy="34" rx="17" ry="6.5" fill="#fde68a" />
      {/* Minced meat, century egg, scallions */}
      <circle cx="26" cy="33" r="3" fill={a} />
      <circle cx="38" cy="33" r="3.2" fill={b} />
      <circle cx="32" cy="35" r="1.8" fill="#15803d" />
      <circle cx="28" cy="37" r="1.5" fill="#22c55e" />
      {/* Ceramic soup spoon */}
      <path d="M43 20 Q40 32 46 34 Q49 32 46 20 Z" fill="#f8fafc" opacity="0.9" />
    </>
  ),
  "lau-nuong": ({ a, b }) => (
    <>
      <CeramicPlate />
      <Steam x={24} />
      <Steam x={40} delay="0.4s" />
      {/* Hotpot metal pot / grill skillet */}
      <ellipse cx="32" cy="38" rx="24" ry="10" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
      <ellipse cx="32" cy="37" rx="21" ry="8" fill={a} />
      {/* Center divider for two-flavor hotpot */}
      <path d="M22 34 Q32 41 42 34" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
      {/* Ingredients bubbling */}
      <circle cx="25" cy="38" r="3" fill="#ef4444" />
      <circle cx="38" cy="38" r="3.2" fill="#f59e0b" />
      <circle cx="32" cy="35" r="2.5" fill="#22c55e" />
      <circle cx="30" cy="40" r="2" fill={b} />
    </>
  ),
  banh: ({ a }) => (
    <>
      <CeramicPlate />
      {/* Crispy Golden Vietnamese Baguette (Bánh Mì) */}
      <ellipse cx="32" cy="37" rx="22" ry="9" fill="#d97706" stroke="#92400e" strokeWidth="1" transform="rotate(-5 32 37)" />
      <ellipse cx="32" cy="36" rx="20" ry="7.5" fill="#f59e0b" transform="rotate(-5 32 36)" />
      {/* Crust score marks */}
      <path d="M20 33 q4 3 8 -1" fill="none" stroke="#78350f" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30 33 q4 3 8 -1" fill="none" stroke="#78350f" strokeWidth="1.6" strokeLinecap="round" />
      {/* Fillings peeking out: paté, cucumber, cilantro, chili */}
      <path d="M16 38 Q32 42 46 37" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="39" r="2" fill="#16a34a" />
      <circle cx="38" cy="38" r="2" fill="#22c55e" />
      <circle cx="31" cy="40" r="1.8" fill={a} />
    </>
  ),
  "an-vat": ({ a, b, c }) => (
    <>
      <CeramicPlate />
      {/* Skewer street food snacks */}
      <line x1="12" y1="46" x2="52" y2="22" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      {/* Grilled fish ball / sausage / meatball */}
      <circle cx="20" cy="41" r="5" fill={a} stroke="#78350f" strokeWidth="1" />
      <circle cx="30" cy="35" r="5" fill={b} stroke="#78350f" strokeWidth="1" />
      <circle cx="40" cy="29" r="5" fill={c} stroke="#78350f" strokeWidth="1" />
      {/* Sweet & spicy chili glaze */}
      <path d="M16 43 Q30 35 44 27" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </>
  ),
  fastfood: ({ a }) => (
    <>
      <CeramicPlate />
      {/* Gourmet Burger / Fastfood */}
      {/* Bottom bun */}
      <ellipse cx="32" cy="44" rx="16" ry="5" fill="#d97706" />
      {/* Juicy patty */}
      <rect x="17" y="38" width="30" height="5" rx="2.5" fill="#451a03" />
      {/* Melted cheddar cheese */}
      <polygon points="17,38 47,38 45,43 37,45 32,42 27,45 20,43" fill="#eab308" />
      {/* Fresh lettuce */}
      <path d="M15 37 Q23 34 32 37 Q41 34 49 37" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      {/* Tomato slice */}
      <rect x="18" y="33" width="28" height="3" rx="1.5" fill="#dc2626" />
      {/* Top sesame bun */}
      <path d="M16 33 Q32 17 48 33 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      {/* Sesame seeds */}
      <circle cx="27" cy="26" r="0.9" fill="#fef08a" />
      <circle cx="33" cy="24" r="0.9" fill="#fef08a" />
      <circle cx="38" cy="27" r="0.9" fill="#fef08a" />
      <circle cx="32" cy="29" r="0.9" fill={a} />
    </>
  ),
  cafe: ({ a }) => (
    <>
      <CeramicPlate />
      <Steam x={32} />
      {/* Phin Filter / Coffee Mug */}
      <rect x="20" y="24" width="24" height="20" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
      {/* Handle */}
      <path d="M44 28 C52 28 52 40 44 40" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      {/* Rich dark espresso / ca phe sua da */}
      <ellipse cx="32" cy="26" rx="10" ry="3.5" fill="#29180b" />
      <ellipse cx="32" cy="26" rx="8" ry="2.5" fill="#78350f" />
      {/* Condensed milk layer / crema heart */}
      <circle cx="32" cy="26" r="2" fill={a} opacity="0.9" />
    </>
  ),
  "tra-sua": ({ a }) => (
    <>
      <ellipse cx="32" cy="50" rx="20" ry="6" fill="black" opacity="0.4" />
      {/* Clear Boba Cup */}
      <path d="M20 18 L24 46 Q32 49 40 46 L44 18 Z" fill="#fde68a" opacity="0.9" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Delicious milk tea gradient liquid */}
      <path d="M21 24 L24 45 Q32 48 40 45 L43 24 Z" fill="#d97706" opacity="0.75" />
      {/* Chewy brown sugar boba pearls */}
      <circle cx="26" cy="43" r="2.4" fill="#1e1b18" />
      <circle cx="32" cy="44" r="2.6" fill="#0f0e0d" />
      <circle cx="38" cy="42" r="2.4" fill="#1e1b18" />
      <circle cx="28" cy="39" r="2.2" fill="#261f18" />
      <circle cx="34" cy="40" r="2.4" fill="#1e1b18" />
      {/* Dome lid & colorful straw */}
      <path d="M19 18 Q32 10 45 18" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
      <line x1="33" y1="6" x2="33" y2="44" stroke={a} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  tra: ({ a }) => (
    <>
      <CeramicPlate />
      <Steam x={32} />
      {/* Traditional Clay Teapot / Tea Cup */}
      <path d="M18 28 Q32 46 46 28 L44 38 Q32 50 20 38 Z" fill="#047857" stroke="#065f46" strokeWidth="1.2" />
      <ellipse cx="32" cy="28" rx="14" ry="5.5" fill="#10b981" />
      {/* Fresh green tea leaf floating */}
      <path d="M28 28 Q32 24 36 28 Q32 30 28 28 Z" fill="#6ee7b7" />
      <circle cx="34" cy="27" r="1.5" fill={a} />
    </>
  ),
  "ep-sinh-to": ({ a, b }) => (
    <>
      <ellipse cx="32" cy="50" rx="20" ry="6" fill="black" opacity="0.4" />
      {/* Tall Smoothie Glass */}
      <path d="M21 16 L24 45 Q32 48 40 45 L43 16 Z" fill={a} opacity="0.88" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Fruit garnish on rim (strawberry/orange) */}
      <circle cx="43" cy="16" r="4.5" fill="#ef4444" />
      <polygon points="41,12 43,8 45,12" fill="#22c55e" />
      {/* Drinking straw */}
      <line x1="28" y1="6" x2="35" y2="42" stroke={b} strokeWidth="2.8" strokeLinecap="round" />
    </>
  ),
  "da-xay": ({ a, b }) => (
    <>
      <ellipse cx="32" cy="50" rx="20" ry="6" fill="black" opacity="0.4" />
      {/* Frappe Cup with Whipped Cream & Caramel Drizzle */}
      <path d="M21 22 L24 46 Q32 49 40 46 L43 22 Z" fill="#78350f" opacity="0.9" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Mountain of whipped cream */}
      <ellipse cx="32" cy="22" rx="11" ry="5" fill="#ffffff" />
      <path d="M23 22 Q32 10 41 22 Z" fill="#ffffff" />
      {/* Chocolate / Caramel drizzle */}
      <path d="M26 18 Q32 14 38 18 Q34 22 30 22" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="11" r="2.5" fill={b} />
      {/* Straw */}
      <line x1="37" y1="4" x2="34" y2="44" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
    </>
  ),
};

const DEFAULT_ART = ART.com as (accent: Accent) => JSX.Element;

export function CategoryArt({
  categoryId,
  itemId,
  className,
}: {
  categoryId: string;
  /** Any stable per-item string (usually the item id) used only to vary accent colors. */
  itemId?: string;
  className?: string;
}) {
  const Illustration = ART[categoryId] ?? DEFAULT_ART;
  const accent = accentFor(itemId ?? categoryId);
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <Illustration {...accent} />
    </svg>
  );
}
