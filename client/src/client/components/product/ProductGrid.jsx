// ProductGrid.jsx — MANWE
import { motion } from "framer-motion";
import { memo } from "react";
import ProductCard from "./ProductCard";

// ─── Skeleton (dark) ──────────────────────────────────────────────────────────

const SkeletonBox = memo(function SkeletonBox({ className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-[#0c0c0c] border border-white/5 ${className}`}>
      <div className="manwe-shimmer absolute inset-0" />
    </div>
  );
});

const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonBox className="w-full aspect-[4/5]" />
      <div className="flex flex-col gap-2">
        <SkeletonBox className="h-2.5 w-16" />
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-5 w-24 mt-1" />
      </div>
    </div>
  );
});

function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ─── Empty state serpent ──────────────────────────────────────────────────────

function ManweSerpentM({ size = 70, opacity = 0.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M25 20 Q20 15 25 12 Q32 10 35 18 L35 40 L30 45 L20 50 L28 60 L25 75 Q22 85 30 88" stroke="#1A5C2A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M25 12 Q28 10 30 12 Q28 16 25 15" fill="#1A5C2A" />
      <path d="M75 20 Q80 15 75 12 Q68 10 65 18 L65 40 L70 45 L80 50 L72 60 L75 75 Q78 85 70 88" stroke="#C4541A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M75 12 Q72 10 70 12 Q72 16 75 15" fill="#C4541A" />
      <path d="M28 45 L28 75 L35 75 L35 55" stroke="#E8E3D8" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <path d="M72 45 L72 75 L65 75 L65 55" stroke="#E8E3D8" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <path d="M35 55 L50 70 L65 55" stroke="#E8E3D8" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <circle cx="50" cy="55" r="2" fill="#E8E3D8" opacity="0.9" />
      <circle cx="35" cy="45" r="1.5" fill="#1A5C2A" />
      <circle cx="65" cy="45" r="1.5" fill="#C4541A" />
    </svg>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export default function ProductGrid({ products, isLoading, onClearSearch }) {
  if (isLoading) {
    return <SkeletonGrid count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6" role="status">
        <ManweSerpentM size={70} opacity={0.4} />
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-[#1A5C2A]" />
          <span
            className="text-gray-500"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "0.4em" }}
          >
            NO PIECES FOUND
          </span>
          <div className="w-12 h-px bg-[#C4541A]" />
        </div>
        <p className="text-gray-700 font-mono text-[10px] tracking-[0.4em]">
          MANWE — TRY ANOTHER CATEGORY
        </p>
        {onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="font-mono text-[10px] tracking-[0.3em] text-[#C4541A] hover:text-[#E8E3D8] transition-colors"
          >
            CLEAR SEARCH →
          </button>
        )}
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}