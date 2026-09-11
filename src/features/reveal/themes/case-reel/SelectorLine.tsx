/**
 * DS-023: The golden laser selector indicating where the reel halts.
 * Upgraded with CS:GO gold laser line, top/bottom arrow markers, and intense amber glow.
 */
export function SelectorLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-20 w-[3px] -translate-x-1/2 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-400 animate-laser"
    >
      {/* Top golden marker triangle */}
      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2">
        <div className="h-0 w-0 border-x-[7px] border-t-[10px] border-x-transparent border-t-gold-400 drop-shadow-[0_2px_6px_rgba(245,184,46,0.9)]" />
      </div>

      {/* Bottom golden marker triangle */}
      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2">
        <div className="h-0 w-0 border-x-[7px] border-b-[10px] border-x-transparent border-b-gold-400 drop-shadow-[0_-2px_6px_rgba(245,184,46,0.9)]" />
      </div>
    </div>
  );
}
