import { useState } from "react";
import { CategoryArt } from "./CategoryArt";

interface DishImageProps {
  categoryId: string;
  itemId?: string;
  rarity?: string;
  alt?: string;
  className?: string;
}

const DISH_IMAGE_MAP: Record<string, string> = {
  com: "/images/dishes/com.webp",
  bun: "/images/dishes/bun.webp",
  "pho-mi": "/images/dishes/pho-mi.webp",
  "chao-sup": "/images/dishes/chao-sup.webp",
  "lau-nuong": "/images/dishes/lau-nuong.webp",
  banh: "/images/dishes/banh.webp",
  "an-vat": "/images/dishes/an-vat.webp",
  fastfood: "/images/dishes/fastfood.webp",
  cafe: "/images/dishes/cafe.webp",
  "tra-sua": "/images/dishes/tra-sua.webp",
};

/**
 * Photorealistic Dish Presentation:
 * Displays delicious real food photography on circular dark ceramic plates with
 * soft radial glow and depth, matching truanayangi.com & CS:GO case aesthetics.
 */
export function DishImage({
  categoryId,
  itemId,
  // Reserved for a future rarity-tinted frame around the photo; unused while photos are absent.
  rarity: _rarity,
  alt = "Món ăn",
  className = "h-28 w-28",
}: DishImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  // If special item or legendary mystery
  const isSpecialItem = itemId === "special-item" || categoryId === "mystery";
  const imageSrc = isSpecialItem
    ? "/images/dishes/special-item.webp"
    : DISH_IMAGE_MAP[categoryId];

  if (!imageSrc || failedSource === imageSrc) {
    return (
      <CategoryArt
        categoryId={categoryId}
        itemId={itemId}
        className={className}
      />
    );
  }

  return (
    <div className={`relative flex items-center justify-center p-1 select-none ${className}`}>
      {/* Ambient radial glow under the plate */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-1 rounded-full bg-gradient-to-b from-white/10 to-transparent blur-md opacity-40"
      />

      {/* Circular dish plate */}
      <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-105">
        <img
          src={imageSrc}
          alt={`Ảnh minh hoạ: ${alt}`}
          loading="eager"
          decoding="async"
          width={384}
          height={384}
          onError={() => setFailedSource(imageSrc)}
          className="h-full w-full object-cover"
        />
        {/* Subtle vignette overlay on the plate */}
        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_14px_rgba(0,0,0,0.5)]" />
      </div>
    </div>
  );
}
