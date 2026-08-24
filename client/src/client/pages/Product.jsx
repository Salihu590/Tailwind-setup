// Product.jsx — MANWE Product Page (Production)
// West African Futurism — Nigeria × Côte d'Ivoire

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { Helmet } from "react-helmet-async";
import products from "../data/products";
import { useCart } from "../context/CartContext";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dsci2gspy/image/upload/f_auto,q_auto,w_800/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

const SITE_URL = "https://manweofficial.com.ng";

// ─── SVGs ─────────────────────────────────────────────────────────────────────

const ManweBeastEmblem = memo(function ManweBeastEmblem({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="#1A5C2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="#C4541A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="#E8E3D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#E8E3D8" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#1A5C2A" />
      <circle cx="44" cy="28" r="1.5" fill="#C4541A" />
      <path d="M37 18 L40 8 L43 18" stroke="#E8E3D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="40" y1="55" x2="40" y2="70" stroke="#E8E3D8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="#E8E3D8" opacity="0.6" />
    </svg>
  );
});

const ManweBeastMini = memo(function ManweBeastMini({ size = 18, opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M10 2 L14 8 L10 14 L6 8 Z" stroke="#E8E3D8" strokeWidth="1" fill="none" />
      <path d="M3 10 L6 4 L8 8" stroke="#1A5C2A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M17 10 L14 4 L12 8" stroke="#C4541A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M7 12 L8.5 17 L10 13 L11.5 17 L13 12" stroke="#E8E3D8" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="9" cy="7" r="0.7" fill="#1A5C2A" />
      <circle cx="11" cy="7" r="0.7" fill="#C4541A" />
    </svg>
  );
});

const AdinkraDiamond = memo(function AdinkraDiamond({ size = 10, fill = "#C4541A", opacity = 0.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  );
});

const FlagStrip = memo(function FlagStrip({ className = "w-full h-0.5" }) {
  return (
    <div className={`${className} flex`} aria-hidden="true">
      <div className="flex flex-1">
        <div className="flex-1 bg-[#1A5C2A]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#1A5C2A]" />
      </div>
      <div className="w-px bg-transparent" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#C4541A]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#1A5C2A]" />
      </div>
    </div>
  );
});

const ManweGradientText = memo(function ManweGradientText({
  children,
  fontSize = "32px",
  letterSpacing = "0.1em",
}) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
        lineHeight: 1,
        background: "linear-gradient(135deg, #1A5C2A 0%, #E8E3D8 50%, #C4541A 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
});

// ─── Product Page ─────────────────────────────────────────────────────────────

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const imageRef = useRef(null);

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [id]
  );

  const images = product?.images?.length ? product.images : [DEFAULT_IMAGE];

  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [imgLoaded, setImgLoaded] = useState(false);

  // Check if image is already cached/completed in browser memory immediately
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImgLoaded(true);
    }
  }, [currentImageIndex, id]);

  // Reset state when product ID changes
  useEffect(() => {
    setSelectedSize("");
    setCurrentImageIndex(0);
    setToast({ message: "", type: "info" });
    setImgLoaded(false);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [id]);

  // Clear size error when size is picked
  useEffect(() => {
    if (selectedSize && toast.type === "error" && toast.message.includes("SIZE")) {
      setToast({ message: "", type: "info" });
    }
  }, [selectedSize, toast]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast.message) return;
    const t = setTimeout(() => setToast({ message: "", type: "info" }), 3200);
    return () => clearTimeout(t);
  }, [toast.message]);

  const handleNextImage = useCallback(() => {
    setImgLoaded(false);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handlePrevImage = useCallback(() => {
    setImgLoaded(false);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToImage = useCallback((index) => {
    setImgLoaded(false);
    setCurrentImageIndex(index);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
    trackTouch: true,
    delta: 12,
    preventScrollOnSwipe: true,
  });

  const handleAddToCart = () => {
    if (!product) return;

    if (!product.inStock) {
      setToast({ message: "SORRY — THIS PIECE IS OUT OF STOCK", type: "error" });
      return;
    }
    if (!selectedSize) {
      setToast({ message: "PLEASE SELECT A SIZE", type: "error" });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: images[0] || DEFAULT_IMAGE,
      quantity: 1,
    });

    setToast({
      message: `${product.name.toUpperCase()} · SIZE ${selectedSize} · ADDED`,
      type: "success",
    });
  };

  // ─── Not found ────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <>
        <Helmet>
          <title>Piece Not Found — MANWE</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <div className="bg-[#080808] text-[#E8E3D8] min-h-screen flex flex-col items-center justify-center gap-8 px-6 pt-24">
          <ManweBeastEmblem size={80} opacity={0.5} />
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "32px",
              letterSpacing: "0.2em",
            }}
          >
            PIECE NOT FOUND
          </p>
          <p className="font-mono text-[10px] tracking-[0.35em] text-gray-600">
            THIS SKU IS NOT IN THE MANIFEST
          </p>
          <Link
            to="/shop"
            className="border border-[#E8E3D8]/30 hover:border-[#E8E3D8] hover:bg-[#E8E3D8] hover:text-[#080808] px-8 py-3 transition-all"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "16px",
              letterSpacing: "0.25em",
            }}
          >
            RETURN TO SHOP
          </Link>
        </div>
      </>
    );
  }

  const priceLabel = product.price.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

  const descriptionLines = Array.isArray(product.description)
    ? product.description
    : product.description
    ? [product.description]
    : [];

  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];

  return (
    <>
      <Helmet>
        <title>{`${product.name} — MANWE`}</title>
        <meta
          name="description"
          content={
            descriptionLines[0] ||
            `${product.name} — West African Futurism streetwear by MANWE.`
          }
        />
        <link rel="canonical" href={`${SITE_URL}/product/${product.id}`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} — MANWE`} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:url" content={`${SITE_URL}/product/${product.id}`} />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="NGN" />
      </Helmet>

      <div className="bg-[#080808] text-[#E8E3D8] min-h-screen pt-28 pb-20 relative overflow-hidden">
        {/* Background watermarks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <ManweBeastEmblem size={480} opacity={0.025} />
          </div>
          <div className="absolute top-24 right-12 hidden lg:block">
            <ManweBeastEmblem size={56} opacity={0.05} />
          </div>
          <div className="absolute bottom-24 left-12 hidden lg:block">
            <ManweBeastMini size={40} opacity={0.06} />
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 z-10">
          <FlagStrip />
        </div>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8 relative z-10">
          <nav className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-gray-600" aria-label="Breadcrumb">
            <Link to="/shop" className="hover:text-[#E8E3D8] transition-colors">
              SHOP
            </Link>
            <span className="text-gray-800">/</span>
            {product.category && (
              <>
                <span className="text-[#1A5C2A]">{product.category.toUpperCase()}</span>
                <span className="text-gray-800">/</span>
              </>
            )}
            <span className="text-gray-500 truncate max-w-[180px] sm:max-w-none">
              {product.name.toUpperCase()}
            </span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10">
          {/* ═══ GALLERY ═══ */}
          <div className="flex-1 flex flex-col items-center gap-5">
            <div
              {...swipeHandlers}
              className="manwe-card w-full max-w-lg relative aspect-square bg-[#0c0c0c] overflow-hidden group select-none"
            >
              <span className="manwe-card__border" aria-hidden="true" />
              <span className="manwe-card__glow" aria-hidden="true" />

              <span className="absolute -top-1 -left-1 z-30">
                <AdinkraDiamond size={8} fill="#1A5C2A" opacity={0.9} />
              </span>
              <span className="absolute -top-1 -right-1 z-30">
                <AdinkraDiamond size={8} fill="#C4541A" opacity={0.9} />
              </span>
              <span className="absolute -bottom-1 -left-1 z-30">
                <AdinkraDiamond size={8} fill="#C4541A" opacity={0.9} />
              </span>
              <span className="absolute -bottom-1 -right-1 z-30">
                <AdinkraDiamond size={8} fill="#1A5C2A" opacity={0.9} />
              </span>

              {/* Load shimmer */}
              {!imgLoaded && <span className="manwe-card__shimmer" aria-hidden="true" />}

              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none" aria-hidden="true">
                <ManweBeastEmblem size={200} opacity={1} />
              </div>

              {/* MAIN PRODUCT IMAGE — Ref added & opacity issue fixed */}
              <img
                ref={imageRef}
                key={`${product.id}-${currentImageIndex}`}
                src={images[currentImageIndex]}
                alt={`${product.name} — view ${currentImageIndex + 1}`}
                loading="eager"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMAGE;
                  setImgLoaded(true);
                }}
                className={`
                  manwe-card__img relative z-10 w-full h-full object-contain p-5
                  transition-all duration-300
                  ${!product.inStock ? "grayscale opacity-40" : "opacity-100"}
                `}
              />

              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#080808]/55 backdrop-blur-[2px]">
                  <div className="border border-[#C4541A] px-8 py-3 bg-[#080808]/70">
                    <span
                      className="text-[#C4541A]"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "20px",
                        letterSpacing: "0.4em",
                      }}
                    >
                      OUT OF STOCK
                    </span>
                  </div>
                </div>
              )}

              {/* Image counter chip */}
              <div className="absolute top-4 left-4 z-20">
                <span className="manwe-card__idchip">
                  <ManweBeastMini size={12} opacity={0.7} />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#E8E3D8]/70">
                    {String(currentImageIndex + 1).padStart(2, "0")} /{" "}
                    {String(images.length).padStart(2, "0")}
                  </span>
                </span>
              </div>

              {/* SKU chip */}
              <div className="absolute top-4 right-4 z-20">
                <span className="manwe-card__idchip">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#E8E3D8]/50">
                    MW-{String(product.id).padStart(3, "0")}
                  </span>
                </span>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center border border-[#E8E3D8]/25 hover:border-[#E8E3D8] bg-[#080808]/50 hover:bg-[#080808]/80 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <span className="text-[#E8E3D8] text-lg leading-none">←</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center border border-[#E8E3D8]/25 hover:border-[#E8E3D8] bg-[#080808]/50 hover:bg-[#080808]/80 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <span className="text-[#E8E3D8] text-lg leading-none">→</span>
                  </button>
                </>
              )}
            </div>

            {/* Progress dots */}
            {images.length > 1 && (
              <div className="flex items-center gap-2" role="tablist" aria-label="Image gallery">
                {images.map((_, index) => (
                  <button
                    key={`${product.id}-dot-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={currentImageIndex === index}
                    aria-label={`View image ${index + 1}`}
                    onClick={() => goToImage(index)}
                    className="transition-all duration-500 focus-visible:outline-none"
                    style={{
                      width: currentImageIndex === index ? "28px" : "8px",
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

            {/* Thumbnails desktop */}
            {images.length > 1 && (
              <div className="hidden lg:flex gap-3 mt-1 flex-wrap justify-center">
                {images.slice(0, 6).map((img, index) => (
                  <button
                    key={`${product.id}-thumb-${index}`}
                    type="button"
                    onClick={() => goToImage(index)}
                    aria-label={`Thumbnail ${index + 1}`}
                    className={`relative w-16 h-16 bg-[#0c0c0c] border overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4541A] ${
                      currentImageIndex === index
                        ? "border-[#E8E3D8]"
                        : "border-white/10 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-1"
                    />
                    {currentImageIndex === index && (
                      <span className="absolute -top-0.5 -right-0.5">
                        <AdinkraDiamond size={6} fill="#C4541A" opacity={1} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <p className="lg:hidden font-mono text-[9px] tracking-[0.3em] text-gray-700">
              SWIPE TO VIEW
            </p>
          </div>

          {/* ═══ INFO ═══ */}
          <div className="flex-1 flex flex-col gap-7 lg:pt-2 max-w-xl">
            <div className="flex items-center gap-3">
              <ManweBeastMini size={18} opacity={0.75} />
              <span
                className="text-[#1A5C2A]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.4em",
                }}
              >
                MANWE — {product.category?.toUpperCase() || "PIECE"}
              </span>
              {product.isNew && product.inStock && (
                <span className="manwe-card__badge manwe-card__badge--new ml-auto sm:ml-2">
                  NEW DROP
                </span>
              )}
            </div>

            <h1
              className="text-[#E8E3D8] leading-none manwe-tape"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(36px, 6vw, 56px)",
                letterSpacing: "0.02em",
              }}
            >
              {product.name.toUpperCase()}
            </h1>

            <div className="flex items-center gap-2" aria-hidden="true">
              <div className="w-10 h-px bg-[#1A5C2A]" />
              <AdinkraDiamond size={7} fill="#C4541A" opacity={0.9} />
              <div className="w-10 h-px bg-[#C4541A]" />
            </div>

            <div className="flex items-baseline gap-3">
              <ManweGradientText fontSize="clamp(28px, 5vw, 36px)" letterSpacing="0.05em">
                {priceLabel}
              </ManweGradientText>
            </div>

            {/* Description */}
            {descriptionLines.length > 0 && (
              <div className="space-y-3 max-w-md border-l border-white/10 pl-4">
                {descriptionLines.map((line, index) => (
                  <p
                    key={index}
                    className="leading-relaxed"
                    style={{
                      fontFamily: index === 0 ? "'Bebas Neue', sans-serif" : "ui-monospace, monospace",
                      fontSize: index === 0 ? "16px" : "11px",
                      letterSpacing: index === 0 ? "0.12em" : "0.06em",
                      color: index === 0 ? "#E8E3D8" : "#6B7280",
                      lineHeight: 1.7,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}

            {/* Size selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-gray-700" aria-hidden="true" />
                <span
                  className="text-gray-500"
                  id="size-label"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.4em",
                  }}
                >
                  SELECT SIZE
                  {selectedSize && (
                    <span className="text-[#C4541A] ml-2">— {selectedSize}</span>
                  )}
                </span>
                <div className="flex-1 h-px bg-gray-800" aria-hidden="true" />
              </div>

              <div
                className="flex flex-wrap gap-3"
                role="radiogroup"
                aria-labelledby="size-label"
              >
                {sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.inStock}
                      className={`
                        relative w-14 h-14 border transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]
                        ${
                          active
                            ? "border-[#E8E3D8] bg-[#E8E3D8]/5 text-[#E8E3D8]"
                            : "border-white/10 text-gray-500 hover:border-white/30"
                        }
                        ${!product.inStock ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                      `}
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "18px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {size}
                      {active && (
                        <span className="absolute -top-1 -right-1">
                          <AdinkraDiamond size={7} fill="#C4541A" opacity={1} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`
                  group relative flex items-center justify-center gap-4 border px-8 py-4 transition-all duration-300 w-full sm:w-fit
                  manwe-shake-hover
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]
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
                      <AdinkraDiamond size={7} fill="#1A5C2A" opacity={0.7} />
                    </span>
                    <span className="absolute -top-1 -right-1">
                      <AdinkraDiamond size={7} fill="#C4541A" opacity={0.7} />
                    </span>
                    <span className="absolute -bottom-1 -left-1">
                      <AdinkraDiamond size={7} fill="#C4541A" opacity={0.7} />
                    </span>
                    <span className="absolute -bottom-1 -right-1">
                      <AdinkraDiamond size={7} fill="#1A5C2A" opacity={0.7} />
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
                  <span className="text-[#C4541A] group-hover:text-[#080808] transition-colors font-mono">
                    →
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="font-mono text-[10px] tracking-[0.3em] text-gray-500 hover:text-[#E8E3D8] transition-colors px-2 py-3 text-center sm:text-left"
              >
                VIEW BAG →
              </button>
            </div>

            {/* Meta strip */}
            <div className="pt-4 flex flex-col gap-3 border-t border-white/5">
              <div className="flex items-center gap-4">
                <FlagStrip className="w-24 h-0.5" />
                <span className="font-mono text-gray-700 text-[9px] tracking-[0.4em]">
                  NGR × CIV
                </span>
              </div>
              <p className="font-mono text-[9px] tracking-[0.25em] text-gray-700 leading-relaxed">
                HANDLED BETWEEN LAGOS / ABUJA / ABIDJAN · STANDARD DELIVERY 3–7 DAYS
              </p>
            </div>
          </div>
        </div>

        {/* ═══ TOAST ═══ */}
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[min(92vw,420px)] ${
            toast.message
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          role="status"
          aria-live="polite"
        >
          <div
            className={`relative flex items-center gap-3 bg-[#080808] border px-5 py-4 shadow-2xl ${
              toast.type === "error"
                ? "border-[#C4541A]/70"
                : toast.type === "success"
                ? "border-[#1A5C2A]/70"
                : "border-[#E8E3D8]/40"
            }`}
          >
            <span className="absolute -top-1 -left-1">
              <AdinkraDiamond size={6} fill="#1A5C2A" opacity={0.9} />
            </span>
            <span className="absolute -top-1 -right-1">
              <AdinkraDiamond size={6} fill="#C4541A" opacity={0.9} />
            </span>
            <span className="absolute -bottom-1 -left-1">
              <AdinkraDiamond size={6} fill="#C4541A" opacity={0.9} />
            </span>
            <span className="absolute -bottom-1 -right-1">
              <AdinkraDiamond size={6} fill="#1A5C2A" opacity={0.9} />
            </span>

            <ManweBeastMini size={16} opacity={0.85} />

            <span
              className="text-[#E8E3D8] flex-1 min-w-0"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.18em",
              }}
            >
              {toast.message}
            </span>

            {toast.type === "success" && (
              <Link
                to="/cart"
                className="shrink-0 font-mono text-[9px] tracking-[0.25em] text-[#C4541A] hover:text-[#E8E3D8] transition-colors"
              >
                BAG →
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}