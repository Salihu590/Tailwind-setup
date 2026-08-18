import { Link } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

// ─── MANWE Serpent Mini ───────────────────────────────────────────────────────

function ManweSerpentMini({ size = 16, opacity = 0.7 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ opacity }}
    >
      <path
        d="M6 4 L6 18 L8 18 L8 10 L12 16 L16 10 L16 18 L18 18 L18 4"
        stroke="#E8E3D8"
        strokeWidth="1.5"
        strokeLinejoin="miter"
        fill="none"
      />
      <path d="M5 4 Q3 2 5 1" stroke="#2D5A2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M19 4 Q21 2 19 1" stroke="#D4651F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.8" fill="#E8E3D8" />
    </svg>
  );
}

// ─── Adinkra Diamond ──────────────────────────────────────────────────────────

function AdinkraDiamond({ size = 8, fill = "#D4651F", opacity = 0.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0] || DEFAULT_IMAGE;
  const hoverImage = product.images?.[1] || imageUrl;

  return (
    <Link
      to={`/product/${product.id}`}
      aria-label={`View ${product.name}`}
      className="group block relative"
    >
      {/* ── Image Container ── */}
      <div className="relative w-full aspect-square bg-[#0c0c0c] border border-gray-800/60 overflow-hidden transition-all duration-500 group-hover:border-[#E8E3D8]/40">

        {/* Corner Adinkra diamonds — appear on hover */}
        <span className="absolute -top-1 -left-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <AdinkraDiamond size={7} fill="#2D5A2E" opacity={0.9} />
        </span>
        <span className="absolute -top-1 -right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <AdinkraDiamond size={7} fill="#D4651F" opacity={0.9} />
        </span>
        <span className="absolute -bottom-1 -left-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <AdinkraDiamond size={7} fill="#D4651F" opacity={0.9} />
        </span>
        <span className="absolute -bottom-1 -right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <AdinkraDiamond size={7} fill="#2D5A2E" opacity={0.9} />
        </span>

        {/* Faint serpent watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <ManweSerpentMini size={80} opacity={0.05} />
        </div>

        {/* Primary image */}
        <img
          src={imageUrl}
          alt={product.name}
          className={`
            absolute inset-0 w-full h-full object-cover transition-all duration-700
            ${!product.inStock ? "grayscale opacity-40" : ""}
            ${hoverImage !== imageUrl ? "group-hover:opacity-0" : "group-hover:scale-105"}
          `}
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }}
        />

        {/* Hover image — if second image exists */}
        {hoverImage !== imageUrl && (
          <img
            src={hoverImage}
            alt=""
            className={`
              absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700
              ${!product.inStock ? "grayscale opacity-0" : "group-hover:opacity-100"}
            `}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
            <div className="border border-[#D4651F] px-4 py-1.5">
              <span
                className="text-[#D4651F]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.4em",
                }}
              >
                OUT OF STOCK
              </span>
            </div>
          </div>
        )}

        {/* Top-left tiny badge — serpent + product number */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <ManweSerpentMini size={12} opacity={0.5} />
          <span
            className="font-mono text-gray-500 text-[8px] tracking-[0.3em]"
          >
            {String(product.id).padStart(3, "0")}
          </span>
        </div>

        {/* Hover — quick view label */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <span
            className="text-[#E8E3D8]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.3em",
            }}
          >
            VIEW PIECE
          </span>
          <span className="text-[#D4651F] font-mono text-sm">→</span>
        </div>
      </div>

      {/* ── Product Info ── */}
      <div className="mt-4 flex flex-col gap-1.5">

        {/* Category label */}
        {product.category && (
          <span
            className="text-[#2D5A2E]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.4em",
            }}
          >
            {product.category.toUpperCase()}
          </span>
        )}

        {/* Product name */}
        <h3
          className="text-[#E8E3D8] group-hover:text-[#E8E3D8] transition-colors leading-tight"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "18px",
            letterSpacing: "0.08em",
          }}
        >
          {product.name.toUpperCase()}
        </h3>

        {/* Price + subtle diamond */}
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[#E8E3D8]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              letterSpacing: "0.05em",
            }}
          >
            {product.price.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0,
            })}
          </span>
          <AdinkraDiamond size={6} fill="#D4651F" opacity={0.5} />
        </div>
      </div>
    </Link>
  );
}