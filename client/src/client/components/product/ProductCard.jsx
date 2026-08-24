// ProductCard.jsx — MANWE cinematic card
import { Link } from "react-router-dom";
import { memo, useState } from "react";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

const NGN = (n) =>
  Number(n).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

function AdinkraDiamond({ size = 8, fill = "#D4651F", opacity = 0.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  );
}

function ManweSerpentMini({ size = 16, opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M6 4 L6 18 L8 18 L8 10 L12 16 L16 10 L16 18 L18 18 L18 4" stroke="#E8E3D8" strokeWidth="1.5" fill="none" />
      <path d="M5 4 Q3 2 5 1" stroke="#1A5C2A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M19 4 Q21 2 19 1" stroke="#C4541A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.8" fill="#E8E3D8" />
    </svg>
  );
}

const ProductCard = memo(function ProductCard({ product }) {
  const imageUrl = product.images?.[0] || DEFAULT_IMAGE;
  const hoverImage = product.images?.[1] || imageUrl;
  const hasHover = hoverImage !== imageUrl;

  const [primaryLoaded, setPrimaryLoaded] = useState(false);

  return (
    <Link
      to={`/product/${product.id}`}
      aria-label={`View ${product.name}`}
      className="manwe-card group relative block focus-visible:outline-none"
    >
      {/* IMAGE FRAME */}
      <div className="manwe-card__frame relative w-full aspect-[4/5] overflow-hidden bg-[#0c0c0c]">
        {/* Gradient stroke border (masked) */}
        <span className="manwe-card__border" aria-hidden="true" />

        {/* Ambient glow */}
        <span className="manwe-card__glow" aria-hidden="true" />

        {/* Adinkra corner marks */}
        <span className="absolute -top-[3px] -left-[3px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <AdinkraDiamond size={8} fill="#1A5C2A" opacity={1} />
        </span>
        <span className="absolute -top-[3px] -right-[3px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <AdinkraDiamond size={8} fill="#C4541A" opacity={1} />
        </span>
        <span className="absolute -bottom-[3px] -left-[3px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <AdinkraDiamond size={8} fill="#C4541A" opacity={1} />
        </span>
        <span className="absolute -bottom-[3px] -right-[3px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <AdinkraDiamond size={8} fill="#1A5C2A" opacity={1} />
        </span>

        {/* Progressive load shimmer */}
        {!primaryLoaded && <span className="manwe-card__shimmer" aria-hidden="true" />}

        {/* Primary image */}
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setPrimaryLoaded(true)}
          onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
          className={`
            manwe-card__img absolute inset-0 w-full h-full object-cover
            transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
            ${primaryLoaded ? "opacity-100" : "opacity-0"}
            ${!product.inStock ? "grayscale opacity-40" : ""}
            ${hasHover ? "group-hover:opacity-0" : "group-hover:scale-[1.06]"}
          `}
        />

        {/* Secondary hover image */}
        {hasHover && (
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
            className={`
              manwe-card__img manwe-card__img--hover absolute inset-0 w-full h-full object-cover
              opacity-0 scale-[1.02] transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
              ${!product.inStock ? "grayscale" : "group-hover:opacity-100 group-hover:scale-100"}
            `}
          />
        )}

        {/* Cinematic bottom vignette */}
        <div className="manwe-card__vignette" aria-hidden="true" />

        {/* Top-left: ID chip */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          <span className="manwe-card__idchip">
            <ManweSerpentMini size={11} opacity={0.7} />
            <span className="font-mono text-[8px] tracking-[0.3em] text-[#E8E3D8]/70">
              MW-{String(product.id).padStart(3, "0")}
            </span>
          </span>
        </div>

        {/* Top-right: New / OOS badge */}
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
          {product.isNew && product.inStock && (
            <span className="manwe-card__badge manwe-card__badge--new">NEW DROP</span>
          )}
          {!product.inStock && (
            <span className="manwe-card__badge manwe-card__badge--oos">SOLD OUT</span>
          )}
        </div>

        {/* Bottom hover CTA rail */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pt-8 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="manwe-card__cta">
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.32em",
              }}
              className="text-[#E8E3D8]"
            >
              VIEW PIECE
            </span>
            <span className="manwe-card__cta-arrow" aria-hidden="true">
              <AdinkraDiamond size={5} fill="#C4541A" opacity={1} />
              <span className="font-mono text-[13px] text-[#C4541A]">→</span>
            </span>
          </div>
        </div>

        {/* Out-of-stock lock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#080808]/55 backdrop-blur-[2px]">
            <div className="border border-[#C4541A] px-4 py-1.5 bg-[#080808]/70">
              <span
                className="text-[#C4541A]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "12px", letterSpacing: "0.4em" }}
              >
                OUT OF STOCK
              </span>
            </div>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="mt-4 flex flex-col gap-1.5 relative">
        {product.category && (
          <div className="flex items-center gap-2">
            <span className="w-4 h-px bg-[#1A5C2A]" aria-hidden="true" />
            <span
              className="text-[#1A5C2A]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.4em",
              }}
            >
              {product.category.toUpperCase()}
            </span>
          </div>
        )}

        <h3
          className="manwe-card__title text-[#E8E3D8] leading-tight"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "19px",
            letterSpacing: "0.08em",
          }}
        >
          {product.name.toUpperCase()}
        </h3>

        <div className="flex items-baseline justify-between mt-1">
          <span
            className="text-[#E8E3D8]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              letterSpacing: "0.05em",
            }}
          >
            {NGN(product.price)}
          </span>
          <span className="flex items-center gap-1">
            <AdinkraDiamond size={5} fill="#1A5C2A" opacity={0.7} />
            <AdinkraDiamond size={5} fill="#C4541A" opacity={0.7} />
          </span>
        </div>
      </div>
    </Link>
  );
});

export default ProductCard;