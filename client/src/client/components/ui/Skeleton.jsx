// src/client/components/ui/Skeleton.jsx
import { memo } from "react";

// Base shimmering box (Dark theme)
export const SkeletonBox = memo(function SkeletonBox({ className = "", style = {} }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#0c0c0c] border border-white/5 ${className}`}
      style={style}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(232, 227, 216, 0.04) 50%, transparent 100%)",
          animation: "manwe-shimmer 1.5s infinite linear",
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes manwe-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
});

// Matches the layout of ProductCard.jsx
export const SkeletonProductCard = memo(function SkeletonProductCard() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonBox className="w-full aspect-square" />
      <div className="flex flex-col gap-2">
        <SkeletonBox className="h-3 w-16" /> {/* Category */}
        <SkeletonBox className="h-5 w-3/4" /> {/* Title */}
        <SkeletonBox className="h-5 w-24 mt-1" /> {/* Price */}
      </div>
    </div>
  );
});

// Grid wrapper for skeletons
export const SkeletonProductGrid = memo(function SkeletonProductGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
});