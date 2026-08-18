// Product.jsx — MANWE Product Page
// West African Futurism — Nigeria × Côte d'Ivoire

import { useParams } from "react-router-dom";
import products from "../data/products";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useCart } from "../context/CartContext";

// ─── MANWE Serpent-M Emblem ───────────────────────────────────────────────────

function ManweSerpentM({ size = 60, opacity = 1 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      style={{ opacity }}
    >
      <path
        d="M25 20 Q20 15 25 12 Q32 10 35 18 L35 40 L30 45 L20 50 L28 60 L25 75 Q22 85 30 88"
        stroke="#2D5A2E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M25 12 Q28 10 30 12 Q28 16 25 15" fill="#2D5A2E" />

      <path
        d="M75 20 Q80 15 75 12 Q68 10 65 18 L65 40 L70 45 L80 50 L72 60 L75 75 Q78 85 70 88"
        stroke="#D4651F"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M75 12 Q72 10 70 12 Q72 16 75 15" fill="#D4651F" />

      <path
        d="M28 45 L28 75 L35 75 L35 55"
        stroke="#E8E3D8"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path
        d="M72 45 L72 75 L65 75 L65 55"
        stroke="#E8E3D8"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path
        d="M35 55 L50 70 L65 55"
        stroke="#E8E3D8"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />

      <circle cx="50" cy="55" r="2" fill="#E8E3D8" opacity="0.9" />
      <circle cx="35" cy="45" r="1.5" fill="#2D5A2E" />
      <circle cx="65" cy="45" r="1.5" fill="#D4651F" />
    </svg>
  );
}

function ManweSerpentMini({ size = 22, opacity = 0.8 }) {
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

function AdinkraDiamond({ size = 10, fill = "#C4541A", opacity = 0.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  );
}

function FlagStrip({ className = "w-full h-0.5" }) {
  return (
    <div className={`${className} flex`}>
      <div className="flex flex-1">
        <div className="flex-1 bg-[#2D5A2E]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
      <div className="w-px bg-transparent" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#D4651F]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
    </div>
  );
}

// ─── MANWE Gradient Text ──────────────────────────────────────────────────────

function ManweGradientText({ children, fontSize = "32px", letterSpacing = "0.1em" }) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
        lineHeight: 1,
        background:
          "linear-gradient(135deg, #2D5A2E 0%, #E8E3D8 50%, #D4651F 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

// ─── Product Page ─────────────────────────────────────────────────────────────

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="bg-[#080808] text-[#E8E3D8] min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
        <ManweSerpentM size={80} opacity={0.5} />
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "32px",
            letterSpacing: "0.2em",
          }}
        >
          PIECE NOT FOUND
        </p>
      </div>
    );
  }

  if (!product.images || product.images.length === 0) {
    return (
      <div className="bg-[#080808] text-[#E8E3D8] min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
        <ManweSerpentM size={80} opacity={0.5} />
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "24px",
            letterSpacing: "0.2em",
          }}
        >
          NO IMAGES AVAILABLE
        </p>
      </div>
    );
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    delta: 10,
  });

  const handleAddToCart = () => {
    if (!product.inStock) {
      setConfirmationMessage("SORRY, THIS PIECE IS OUT OF STOCK");
      return;
    }

    if (!selectedSize) {
      setConfirmationMessage("PLEASE SELECT A SIZE");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[currentImageIndex],
    });

    setConfirmationMessage(`${product.name.toUpperCase()} ADDED TO BAG`);

    setTimeout(() => setConfirmationMessage(""), 3000);
  };

  return (
    <div className="bg-[#080808] text-[#E8E3D8] min-h-screen pt-24 pb-16 relative overflow-hidden">

      {/* ── Background watermarks ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweSerpentM size={500} opacity={0.02} />
        </div>
        <div className="absolute top-20 right-10 hidden lg:block">
          <ManweSerpentM size={60} opacity={0.05} />
        </div>
        <div className="absolute bottom-20 left-10 hidden lg:block">
          <ManweSerpentM size={40} opacity={0.04} />
        </div>
      </div>

      {/* ── Top flag strip ── */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <FlagStrip className="w-full h-0.5" />
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row gap-12 relative z-10">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* IMAGE GALLERY                                                      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        <div className="flex-1 flex flex-col items-center gap-6">

          <div
            {...swipeHandlers}
            className="w-full max-w-lg relative aspect-square bg-[#0c0c0c] border border-gray-800/60 overflow-hidden group"
          >
            <span className="absolute -top-1 -left-1 z-20">
              <AdinkraDiamond size={8} fill="#2D5A2E" opacity={0.8} />
            </span>
            <span className="absolute -top-1 -right-1 z-20">
              <AdinkraDiamond size={8} fill="#D4651F" opacity={0.8} />
            </span>
            <span className="absolute -bottom-1 -left-1 z-20">
              <AdinkraDiamond size={8} fill="#D4651F" opacity={0.8} />
            </span>
            <span className="absolute -bottom-1 -right-1 z-20">
              <AdinkraDiamond size={8} fill="#2D5A2E" opacity={0.8} />
            </span>

            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <ManweSerpentM size={200} opacity={0.3} />
            </div>

            <img
              src={product.images[currentImageIndex]}
              alt={`${product.name} — view ${currentImageIndex + 1}`}
              className={`relative z-10 w-full h-full object-contain p-4 transition-all duration-500 ${
                !product.inStock ? "grayscale opacity-40" : ""
              }`}
              onError={(e) => {
                e.target.src =
                  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";
              }}
            />

            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
                <div className="border border-[#D4651F] px-8 py-3">
                  <span
                    className="text-[#D4651F]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "22px",
                      letterSpacing: "0.4em",
                    }}
                  >
                    OUT OF STOCK
                  </span>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <ManweSerpentMini size={14} opacity={0.6} />
              <span className="text-gray-500 font-mono text-[10px] tracking-[0.3em]">
                {String(currentImageIndex + 1).padStart(2, "0")} /{" "}
                {String(product.images.length).padStart(2, "0")}
              </span>
            </div>

            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center border border-[#E8E3D8]/30 hover:border-[#E8E3D8] hover:bg-[#E8E3D8]/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <span className="text-[#E8E3D8] text-lg">←</span>
                </button>
                <button
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center border border-[#E8E3D8]/30 hover:border-[#E8E3D8] hover:bg-[#E8E3D8]/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <span className="text-[#E8E3D8] text-lg">→</span>
                </button>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-2">
              {product.images.map((_, index) => (
                <button
                  key={`${product.id}-dot-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className="transition-all duration-500"
                  style={{
                    width: currentImageIndex === index ? "24px" : "8px",
                    height: "2px",
                    backgroundColor:
                      currentImageIndex === index
                        ? "#E8E3D8"
                        : "rgba(232,227,216,0.2)",
                  }}
                />
              ))}
            </div>
          )}

          {product.images.length > 1 && (
            <div className="hidden lg:flex gap-3 mt-2">
              {product.images.slice(0, 5).map((img, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 bg-[#0c0c0c] border overflow-hidden transition-all ${
                    currentImageIndex === index
                      ? "border-[#E8E3D8]"
                      : "border-gray-800 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain p-1"
                  />
                  {currentImageIndex === index && (
                    <span className="absolute -top-0.5 -right-0.5">
                      <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PRODUCT INFO                                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        <div className="flex-1 flex flex-col gap-8 lg:pt-4">

          {/* Top — small emblem + label */}
          <div className="flex items-center gap-3">
            <ManweSerpentMini size={20} opacity={0.7} />
            <span
              className="text-[#2D5A2E]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.4em",
              }}
            >
              MANWE — {product.category?.toUpperCase() || "PIECE"}
            </span>
          </div>

          {/* Product Name */}
          <h1
            className="text-[#E8E3D8] leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 6vw, 56px)",
              letterSpacing: "0.02em",
            }}
          >
            {product.name.toUpperCase()}
          </h1>

          {/* Accent line */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-px bg-[#2D5A2E]" />
            <AdinkraDiamond size={7} fill="#D4651F" opacity={0.8} />
            <div className="w-10 h-px bg-[#D4651F]" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <ManweGradientText fontSize="36px" letterSpacing="0.05em">
              {product.price.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0,
              })}
            </ManweGradientText>
          </div>

          {/* Description — ALL LINES NOW USE BEBAS NEUE */}
          <div className="space-y-4 max-w-md">
            {product.description.map((line, index) => (
              <p
                key={index}
                className="leading-relaxed"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: index === 0 ? "17px" : "14px",
                  letterSpacing: "0.15em",
                  color: index === 0 ? "#E8E3D8" : "#9CA3AF",
                  lineHeight: index === 0 ? 1.5 : 1.7,
                }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Size selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-gray-700" />
              <span
                className="text-gray-500"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.4em",
                }}
              >
                SELECT SIZE
              </span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!product.inStock}
                  className={`
                    relative w-14 h-14 border transition-all duration-200
                    ${
                      selectedSize === size
                        ? "border-[#E8E3D8] bg-[#E8E3D8]/5"
                        : "border-gray-800 hover:border-gray-600"
                    }
                    ${
                      !product.inStock
                        ? "opacity-30 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "18px",
                    letterSpacing: "0.1em",
                    color: selectedSize === size ? "#E8E3D8" : "#6B7280",
                  }}
                >
                  {size}
                  {selectedSize === size && (
                    <span className="absolute -top-1 -right-1">
                      <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`
              group relative flex items-center justify-center gap-4 border px-8 py-4 transition-all duration-300 w-fit
              ${
                product.inStock
                  ? "border-[#E8E3D8]/30 hover:border-[#E8E3D8] hover:bg-[#E8E3D8] cursor-pointer"
                  : "border-gray-800 cursor-not-allowed opacity-40"
              }
            `}
          >
            {product.inStock && (
              <>
                <span className="absolute -top-1 -left-1">
                  <AdinkraDiamond size={7} fill="#2D5A2E" opacity={0.6} />
                </span>
                <span className="absolute -top-1 -right-1">
                  <AdinkraDiamond size={7} fill="#D4651F" opacity={0.6} />
                </span>
                <span className="absolute -bottom-1 -left-1">
                  <AdinkraDiamond size={7} fill="#D4651F" opacity={0.6} />
                </span>
                <span className="absolute -bottom-1 -right-1">
                  <AdinkraDiamond size={7} fill="#2D5A2E" opacity={0.6} />
                </span>
              </>
            )}

            <span
              className={`transition-colors ${
                product.inStock
                  ? "text-[#E8E3D8] group-hover:text-[#080808]"
                  : "text-gray-600"
              }`}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "18px",
                letterSpacing: "0.35em",
              }}
            >
              {product.inStock ? "ADD TO BAG" : "OUT OF STOCK"}
            </span>

            {product.inStock && (
              <span className="text-[#D4651F] group-hover:text-[#080808] transition-colors font-mono">
                →
              </span>
            )}
          </button>

          {/* Bottom — heritage flag strip */}
          <div className="pt-6 flex items-center gap-4">
            <FlagStrip className="w-24 h-0.5" />
            <span className="font-mono text-gray-700 text-[9px] tracking-[0.4em]">
              NGR × CIV
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONFIRMATION TOAST                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          confirmationMessage
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="relative flex items-center gap-3 bg-[#080808] border border-[#E8E3D8]/40 px-6 py-4 shadow-2xl">
          <span className="absolute -top-1 -left-1">
            <AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} />
          </span>
          <span className="absolute -top-1 -right-1">
            <AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} />
          </span>
          <span className="absolute -bottom-1 -left-1">
            <AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} />
          </span>
          <span className="absolute -bottom-1 -right-1">
            <AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} />
          </span>

          <ManweSerpentMini size={16} opacity={0.8} />

          <span
            className="text-[#E8E3D8]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.25em",
            }}
          >
            {confirmationMessage}
          </span>
        </div>
      </div>
    </div>
  );
}