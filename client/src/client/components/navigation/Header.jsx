import { memo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Menu, X as XIcon, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const LOGO_URL =
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

// ─── SVGs (memoized) ──────────────────────────────────────────────────────────

const ManweBeastEmblem = memo(function ManweBeastEmblem({ size = 40, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }} aria-hidden="true" focusable="false">
      <path d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="#1A5C2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="#C4541A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="#E8E3D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#E8E3D8" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#1A5C2A" />
      <circle cx="44" cy="28" r="1.5" fill="#C4541A" />
      <path d="M37 18 L40 8 L43 18" stroke="#E8E3D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="40" y1="55" x2="40" y2="70" stroke="#E8E3D8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="#E8E3D8" opacity="0.6" />
      <line x1="12" y1="30" x2="22" y2="25" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.5" />
      <line x1="14" y1="35" x2="24" y2="30" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.4" />
      <line x1="68" y1="30" x2="58" y2="25" stroke="#C4541A" strokeWidth="0.8" opacity="0.5" />
      <line x1="66" y1="35" x2="56" y2="30" stroke="#C4541A" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
});

const ManweBeastMini = memo(function ManweBeastMini({ size = 18, opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }} aria-hidden="true" focusable="false">
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
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }} aria-hidden="true" focusable="false">
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  );
});

const ManweGradientText = memo(function ManweGradientText({ fontSize = "32px", letterSpacing = "0.16em" }) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
        lineHeight: 1,
        background:
          "linear-gradient(135deg, #1A5C2A 0%, #2D7A3E 20%, #E8E3D8 50%, #D4651F 80%, #C4541A 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      MANWE
    </span>
  );
});

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header({
  toggleMenu,
  toggleSearch,
  menuOpen = false,
  searchOpen = false,
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  const { pathname } = useLocation();
  const isProductPage = pathname.startsWith("/product/");

  const { cartItems } = useCart();
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const hasItems = cartCount > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#080808]/80 backdrop-blur-xl border-b border-white/10">
      
      <style dangerouslySetInnerHTML={{ __html: `
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration {
          -webkit-appearance: none;
          appearance: none;
          display: none;
        }
        input[type="search"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}} />

      {/* West African flag line */}
      <div className="flex w-full h-[3px]" aria-hidden="true">
        <div className="flex flex-1">
          <div className="flex-1 bg-[#1A5C2A]" />
          <div className="flex-1 bg-[#E8E3D8]" />
          <div className="flex-1 bg-[#1A5C2A]" />
        </div>
        <div className="w-[2px] bg-[#080808]" />
        <div className="flex flex-1">
          <div className="flex-1 bg-[#C4541A]" />
          <div className="flex-1 bg-[#E8E3D8]" />
          <div className="flex-1 bg-[#1A5C2A]" />
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE HEADER                                                    */}
      {/* ================================================================ */}

      <div className="lg:hidden flex items-center justify-between h-[72px] px-5 relative z-50">
        <div className="flex items-center w-20">
          {!isProductPage && !menuOpen && (
            <button
              onClick={toggleSearch}
              className="text-[#E8E3D8] active:scale-90 transition-transform"
              aria-label={searchOpen ? "Close search bar" : "Open search bar"}
            >
              {searchOpen ? <FiX size={21} /> : <FiSearch size={21} />}
            </button>
          )}
        </div>

        <Link
          to="/shop"
          aria-label="MANWE Homepage"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
        >
          <ManweBeastMini size={22} opacity={0.9} />
          <ManweGradientText fontSize="26px" letterSpacing="0.14em" />
        </Link>

        <div className="flex items-center justify-end gap-5 w-20">
          {!menuOpen && (
            <Link
              to="/cart"
              aria-label={`Shopping bag containing ${cartCount} items`}
              className="relative text-[#E8E3D8] active:scale-90 transition-transform"
            >
              <ShoppingBag size={21} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[17px] h-[17px] px-1 flex items-center justify-center bg-[#C4541A] text-[#E8E3D8] text-[9px] font-bold rounded-full leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={toggleMenu}
            className="text-[#E8E3D8] active:scale-90 transition-transform"
            aria-label={menuOpen ? "Close main navigation menu" : "Open main navigation menu"}
          >
            {menuOpen ? (
              <XIcon size={24} strokeWidth={1.8} />
            ) : (
              <Menu size={23} strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE SEARCH                                                    */}
      {/* ================================================================ */}

      <div
        className={`
          lg:hidden overflow-hidden transition-all duration-500 ease-in-out
          ${searchOpen && !isProductPage && !menuOpen ? "max-h-28 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-5 pb-5 pt-2 bg-[#080808]/95">
          <div className="flex items-center gap-1 mb-2 opacity-30" aria-hidden="true">
            <div className="flex-1 h-px bg-[#1A5C2A]" />
            <ManweBeastMini size={12} opacity={0.5} />
            <div className="flex-1 h-px bg-[#C4541A]" />
          </div>

          <div className="flex items-center gap-4 border-b border-[#E8E3D8]/20 pb-3">
            <FiSearch className="text-gray-500 shrink-0" size={17} />
            <input
              type="search"
              placeholder="SEARCH MANWE"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              className="w-full bg-transparent outline-none text-[#E8E3D8] placeholder:text-gray-700"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "19px",
                letterSpacing: "0.18em",
              }}
              aria-label="Search items"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear current query"
                className="text-gray-600 hover:text-[#E8E3D8] transition-colors shrink-0"
              >
                <FiX size={17} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* DESKTOP HEADER                                                   */}
      {/* ================================================================ */}

      <div className="hidden lg:flex items-center justify-between h-[84px] px-8 xl:px-12 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          <ManweBeastEmblem size={60} opacity={0.03} />
        </div>

        <Link
          to="/shop"
          aria-label="MANWE home page"
          className="flex items-center gap-4 group relative"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <img
              src={LOGO_URL}
              alt=""
              className="absolute inset-0 w-10 h-10 object-contain transition-opacity duration-300 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ManweBeastEmblem size={38} opacity={1} />
            </div>
          </div>

          <div className="flex flex-col">
            <ManweGradientText fontSize="32px" letterSpacing="0.16em" />
            <div className="flex items-center gap-1.5 mt-0.5" aria-hidden="true">
              <AdinkraDiamond size={5} fill="#1A5C2A" opacity={0.8} />
              <span
                className="text-[#1A5C2A]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.32em",
                }}
              >
                WEST AFRICAN FUTURISM
              </span>
              <AdinkraDiamond size={5} fill="#C4541A" opacity={0.8} />
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-8">
          {!isProductPage && (
            <div className="group flex items-center gap-2 border-b border-white/20 focus-within:border-[#E8E3D8] transition-colors pb-2 w-56">
              <ManweBeastMini size={14} opacity={0.2} aria-hidden="true" />
              <FiSearch
                size={15}
                className="text-gray-500 group-focus-within:text-[#E8E3D8] transition-colors shrink-0"
              />
              <input
                type="search"
                placeholder="SEARCH"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                className="bg-transparent outline-none w-full text-[#E8E3D8] placeholder:text-gray-700"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "15px",
                  letterSpacing: "0.2em",
                }}
                aria-label="Search catalog"
              />
              {searchQuery.length > 0 && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear navigation search"
                  className="text-gray-600 hover:text-[#E8E3D8] transition-colors shrink-0"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          )}

          <Link
            to="/shop"
            className="text-[#E8E3D8]/60 hover:text-[#E8E3D8] transition-colors manwe-link"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              letterSpacing: "0.18em",
            }}
          >
            SHOP
          </Link>

          <Link
            to="/cart"
            aria-label={`Shopping bag containing ${cartCount} items`}
            className="group flex items-center gap-2 text-[#E8E3D8]/60 hover:text-[#E8E3D8] transition-colors manwe-link"
          >
            <span className="relative inline-flex items-center justify-center">
              <ShoppingBag size={18} strokeWidth={1.6} className="shrink-0" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center bg-[#C4541A] text-[#E8E3D8] text-[9px] font-bold leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "18px",
                letterSpacing: "0.18em",
              }}
            >
              BAG
            </span>
          </Link>

          {hasItems ? (
            <Link
              to="/checkout"
              aria-label="Proceed to checkout interface"
              className="group relative flex items-center border border-[#E8E3D8]/30 hover:border-[#E8E3D8] px-6 py-2.5 hover:bg-[#E8E3D8] transition-all duration-300 manwe-shake-hover"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "17px",
                letterSpacing: "0.18em",
              }}
            >
              <span className="absolute -top-1 -left-1">
                <AdinkraDiamond size={7} fill="#1A5C2A" opacity={0.6} />
              </span>
              <span className="absolute -top-1 -right-1">
                <AdinkraDiamond size={7} fill="#C4541A" opacity={0.6} />
              </span>
              <span className="absolute -bottom-1 -left-1">
                <AdinkraDiamond size={7} fill="#C4541A" opacity={0.6} />
              </span>
              <span className="absolute -bottom-1 -right-1">
                <AdinkraDiamond size={7} fill="#1A5C2A" opacity={0.6} />
              </span>
              <span className="text-[#E8E3D8] group-hover:text-[#080808] transition-colors">
                CHECKOUT
              </span>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-label="Cart is empty"
              title="Add items to your bag to proceed"
              className="relative flex items-center border border-[#E8E3D8]/10 px-6 py-2.5 cursor-not-allowed opacity-40"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "17px",
                letterSpacing: "0.18em",
              }}
            >
              <span className="text-[#E8E3D8]/50">CHECKOUT</span>
            </button>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* DUAL-NATION MARQUEE — Nigeria × Côte d'Ivoire                    */}
      {/* ================================================================ */}
      <div
        className="manwe-nation-marquee w-full overflow-hidden py-2 border-t border-white/10 relative z-40 group"
        aria-hidden="true"
      >
        <div className="manwe-nation-marquee__bg absolute inset-0" />
        <div className="manwe-nation-marquee__sheen absolute inset-0 pointer-events-none" />

        <div className="absolute left-0 top-0 bottom-0 w-[3px] flex flex-col z-20">
          <span className="flex-1 bg-[#1A5C2A]" />
          <span className="flex-1 bg-[#E8E3D8]" />
          <span className="flex-1 bg-[#1A5C2A]" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[3px] flex flex-col z-20">
          <span className="flex-1 bg-[#C4541A]" />
          <span className="flex-1 bg-[#E8E3D8]" />
          <span className="flex-1 bg-[#1A5C2A]" />
        </div>

        <div className="relative z-10 flex manwe-marquee whitespace-nowrap">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-10 px-8 shrink-0 text-[11px] tracking-[0.35em] font-mono select-none font-bold"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="manwe-flag-chip manwe-flag-chip--ng" title="Nigeria">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="manwe-mq-text manwe-mq-text--ng">NIGERIA</span>
                </span>

                <span className="manwe-mq-sep">✦</span>

                <span className="manwe-mq-text manwe-mq-text--core">
                  MANWE OFFICIAL DIGITAL FLAGSHIP
                </span>

                <span className="manwe-mq-sep">✦</span>

                <span className="manwe-mq-text manwe-mq-text--core">
                  COUTURE &amp; WEST AFRICAN STREETWEAR
                </span>

                <span className="manwe-mq-sep">✦</span>

                <span className="inline-flex items-center gap-2">
                  <span className="manwe-flag-chip manwe-flag-chip--civ" title="Côte d'Ivoire">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="manwe-mq-text manwe-mq-text--civ">CÔTE D&apos;IVOIRE</span>
                </span>

                <span className="manwe-mq-sep">✦</span>

                <span className="manwe-mq-text manwe-mq-text--cross">
                  NGR × CIV
                </span>

                <span className="manwe-mq-sep">✦</span>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
}