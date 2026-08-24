// Cart.jsx — MANWE Bag (Production)
import { useState, useEffect, useMemo, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";

const SITE_URL = "https://manweofficial.com.ng";
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dsci2gspy/image/upload/f_auto,q_auto,w_200/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

// ─── SVGs ─────────────────────────────────────────────────────────────────────

const ManweBeastEmblem = memo(function ManweBeastEmblem({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="#1A5C2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="#C4541A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="#1A1A18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#1A1A18" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#1A5C2A" />
      <circle cx="44" cy="28" r="1.5" fill="#C4541A" />
      <path d="M37 18 L40 8 L43 18" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="40" y1="55" x2="40" y2="70" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="#1A1A18" opacity="0.7" />
      <line x1="12" y1="30" x2="22" y2="25" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.5" />
      <line x1="14" y1="35" x2="24" y2="30" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.4" />
      <line x1="68" y1="30" x2="58" y2="25" stroke="#C4541A" strokeWidth="0.8" opacity="0.5" />
      <line x1="66" y1="35" x2="56" y2="30" stroke="#C4541A" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
});

const ManweBeastMini = memo(function ManweBeastMini({ size = 18, opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M10 2 L14 8 L10 14 L6 8 Z" stroke="#1A1A18" strokeWidth="1" fill="none" />
      <path d="M3 10 L6 4 L8 8" stroke="#1A5C2A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M17 10 L14 4 L12 8" stroke="#C4541A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M7 12 L8.5 17 L10 13 L11.5 17 L13 12" stroke="#1A1A18" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="9" cy="7" r="0.7" fill="#1A5C2A" />
      <circle cx="11" cy="7" r="0.7" fill="#C4541A" />
    </svg>
  );
});

const AdinkraDiamond = memo(function AdinkraDiamond({ size = 8, fill = "#C4541A", opacity = 0.8 }) {
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
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#1A5C2A]" />
      </div>
      <div className="w-px bg-transparent" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#C4541A]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#1A5C2A]" />
      </div>
    </div>
  );
});

const ManweGradientText = memo(function ManweGradientText({
  children,
  fontSize = "32px",
  letterSpacing = "0.05em",
}) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
        lineHeight: 1,
        background:
          "linear-gradient(135deg, #1A5C2A 0%, #2D7A3E 25%, #1A1A18 50%, #D4651F 75%, #C4541A 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
});

const NGN = (n) =>
  Number(n || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

// ─── Cart Page ────────────────────────────────────────────────────────────────

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    specialInstructions,
    updateSpecialInstructions,
  } = useCart();

  const [agree, setAgree] = useState(false);
  const [instructionsFocused, setInstructionsFocused] = useState(false);
  const [toast, setToast] = useState("");
  const [shakeTerms, setShakeTerms] = useState(false);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems]
  );

  // Show reason if redirected from empty-bag checkout guard
  useEffect(() => {
    if (location.state?.reason === "empty_bag") {
      setToast("ADD PIECES TO YOUR BAG TO CHECKOUT");
    }
  }, [location.state]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!agree) {
      setShakeTerms(true);
      setToast("AGREE TO TERMS & CONDITIONS TO CONTINUE");
      setTimeout(() => setShakeTerms(false), 500);
      return;
    }
    if (cartItems.length === 0) {
      setToast("YOUR BAG IS EMPTY");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <Helmet>
        <title>Bag — MANWE</title>
        <meta name="description" content="Your MANWE bag. Review pieces and proceed to checkout." />
        <link rel="canonical" href={`${SITE_URL}/cart`} />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <div
        className="min-h-screen pt-24 pb-16 relative overflow-hidden"
        style={{ backgroundColor: "#F4EFE6", color: "#1A1A18" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <ManweBeastEmblem size={500} opacity={0.04} />
          </div>
          <div className="absolute top-32 right-10 hidden lg:block">
            <ManweBeastMini size={40} opacity={0.15} />
          </div>
          <div className="absolute bottom-32 left-10 hidden lg:block">
            <ManweBeastMini size={40} opacity={0.15} />
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 z-10">
          <FlagStrip />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Header */}
          <header className="flex flex-col items-center mb-12">
            <ManweBeastEmblem size={54} opacity={1} />

            <div className="flex items-center gap-3 mt-6 mb-4">
              <div className="w-10 h-px bg-[#1A5C2A]" />
              <AdinkraDiamond size={7} fill="#C4541A" opacity={1} />
              <span
                className="text-[#1A5C2A]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}
              >
                YOUR SELECTION
              </span>
              <AdinkraDiamond size={7} fill="#C4541A" opacity={1} />
              <div className="w-10 h-px bg-[#C4541A]" />
            </div>

            <h1 className="text-center leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 8vw, 72px)", letterSpacing: "0.05em" }}>
              <span className="text-[#1A1A18]">THE </span>
              <ManweGradientText fontSize="clamp(40px, 8vw, 72px)" letterSpacing="0.05em">
                BAG
              </ManweGradientText>
            </h1>

            {itemCount > 0 && (
              <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em] mt-4" aria-live="polite">
                {itemCount} {itemCount === 1 ? "PIECE" : "PIECES"}
              </p>
            )}
          </header>

          {/* Empty */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-8" role="status">
              <ManweBeastEmblem size={90} opacity={0.7} />
              <div className="flex items-center gap-3">
                <div className="w-12 h-px bg-[#1A5C2A]" />
                <span className="text-[#6B6558]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "0.4em" }}>
                  YOUR BAG IS EMPTY
                </span>
                <div className="w-12 h-px bg-[#C4541A]" />
              </div>
              <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em]">START THE JOURNEY</p>

              <Link
                to="/shop"
                className="group relative flex items-center gap-4 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-10 py-4 transition-all duration-300 mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]"
              >
                <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
                <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
                <span className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.35em" }}>
                  CONTINUE SHOPPING
                </span>
                <span className="text-[#C4541A] group-hover:text-[#F4EFE6] transition-colors font-mono">→</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Items */}
              <ul className="flex flex-col gap-6" aria-label="Bag items">
                {cartItems.map((item, index) => (
                  <li
                    key={`${item.id}-${item.size}-${index}`}
                    className="relative border border-[#D9D2C4] hover:border-[#1A1A18]/30 transition-colors p-5 lg:p-6"
                    style={{ backgroundColor: "#FDFAF3" }}
                  >
                    <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
                    <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                    <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                    <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>

                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      <div className="relative w-full sm:w-28 h-28 border border-[#D9D2C4] shrink-0 overflow-hidden" style={{ backgroundColor: "#F4EFE6" }}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10" aria-hidden="true">
                          <ManweBeastMini size={40} opacity={0.5} />
                        </div>
                        <img
                          src={item.image || DEFAULT_IMAGE}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                          className="relative z-10 w-full h-full object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 flex flex-col gap-2 w-full min-w-0">
                        <div className="flex items-center gap-2">
                          <ManweBeastMini size={12} opacity={0.6} />
                          <span className="text-[#1A5C2A]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "9px", letterSpacing: "0.4em" }}>
                            MANWE PIECE
                          </span>
                        </div>

                        <h2 className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "0.08em", lineHeight: 1.1 }}>
                          {item.name.toUpperCase()}
                        </h2>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em]">SIZE</span>
                          <span className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "14px", letterSpacing: "0.15em" }}>
                            {item.size}
                          </span>
                        </div>

                        <p className="text-[#1A1A18] mt-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "0.03em" }}>
                          {NGN(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="font-mono text-[9px] tracking-[0.2em] text-[#8B8577]">
                            {NGN(item.price)} × {item.quantity}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                          <div className="flex items-center border border-[#D9D2C4]" role="group" aria-label={`Quantity for ${item.name}`}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                              className="w-9 h-9 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]"
                              aria-label="Decrease quantity"
                            >
                              <span className="text-lg leading-none">−</span>
                            </button>
                            <span
                              className="w-11 h-9 flex items-center justify-center text-[#1A1A18] border-x border-[#D9D2C4]"
                              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px" }}
                              aria-live="polite"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, Math.min(20, item.quantity + 1))}
                              disabled={item.quantity >= 20}
                              className="w-9 h-9 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/5 disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]"
                              aria-label="Increase quantity"
                            >
                              <span className="text-lg leading-none">+</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              removeFromCart(item.id, item.size);
                              setToast(`${item.name.toUpperCase()} REMOVED`);
                            }}
                            className="flex items-center gap-2 text-[#8B8577] hover:text-[#C4541A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]"
                          >
                            <AdinkraDiamond size={5} fill="#C4541A" opacity={0.8} />
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "12px", letterSpacing: "0.3em" }}>
                              REMOVE
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Special instructions */}
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-px bg-[#D9D2C4]" />
                  <span className="text-[#6B6558]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "12px", letterSpacing: "0.4em" }}>
                    SPECIAL INSTRUCTIONS
                  </span>
                  <span className="font-mono text-[9px] text-[#B5AE9E] tracking-[0.2em]">OPTIONAL</span>
                  <div className="flex-1 h-px bg-[#D9D2C4]" />
                </div>

                <div
                  className={`relative border transition-all duration-300 ${instructionsFocused ? "border-[#1A1A18]" : "border-[#D9D2C4]"}`}
                  style={{ backgroundColor: "#FDFAF3" }}
                >
                  <textarea
                    value={specialInstructions || ""}
                    onChange={(e) => updateSpecialInstructions(e.target.value.slice(0, 280))}
                    onFocus={() => setInstructionsFocused(true)}
                    onBlur={() => setInstructionsFocused(false)}
                    placeholder="E.G. PLEASE WRAP AS A GIFT"
                    maxLength={280}
                    className="w-full bg-transparent outline-none text-[#1A1A18] placeholder:text-[#B5AE9E] p-4 resize-none focus-visible:ring-0"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px", letterSpacing: "0.12em" }}
                    rows={3}
                    aria-label="Special instructions"
                  />
                  <span className="absolute bottom-2 right-3 font-mono text-[9px] text-[#B5AE9E]">
                    {(specialInstructions || "").length}/280
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className={`mt-6 flex items-start gap-3 ${shakeTerms ? "manwe-shake-hover" : ""}`} style={shakeTerms ? { animation: "manwe-shake 0.35s ease-in-out" } : undefined}>
                <div className="relative pt-0.5">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="agree"
                    className={`block w-5 h-5 border cursor-pointer transition-all relative focus-within:ring-2 focus-within:ring-[#C4541A] ${
                      agree ? "border-[#1A1A18] bg-[#1A1A18]" : "border-[#D9D2C4] hover:border-[#8B8577] bg-[#FDFAF3]"
                    }`}
                  >
                    {agree && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <AdinkraDiamond size={8} fill="#C4541A" opacity={1} />
                      </span>
                    )}
                  </label>
                </div>

                <label
                  htmlFor="agree"
                  className="text-[#6B6558] cursor-pointer"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.18em" }}
                >
                  I AGREE TO THE{" "}
                  <Link to="/terms" className="text-[#1A1A18] underline underline-offset-2 hover:text-[#C4541A] transition-colors">
                    TERMS & CONDITIONS
                  </Link>
                </label>
              </div>

              {/* Total + checkout */}
              <div className="mt-10 border-t border-[#D9D2C4] pt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em]">SUBTOTAL</span>
                    <ManweGradientText fontSize="clamp(28px, 5vw, 40px)" letterSpacing="0.02em">
                      {NGN(total)}
                    </ManweGradientText>
                    <p className="font-mono text-[9px] tracking-[0.25em] text-[#B5AE9E] mt-1">
                      DELIVERY CALCULATED AT NEXT STEP
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className={`group relative flex items-center justify-center gap-4 border px-8 py-4 transition-all duration-300 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A] ${
                      agree
                        ? "border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] cursor-pointer manwe-shake-hover"
                        : "border-[#D9D2C4] cursor-pointer opacity-70"
                    }`}
                  >
                    {agree && (
                      <>
                        <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
                        <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                        <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                        <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
                      </>
                    )}
                    <span
                      className={`transition-colors ${agree ? "text-[#1A1A18] group-hover:text-[#F4EFE6]" : "text-[#8B8577]"}`}
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "17px", letterSpacing: "0.3em" }}
                    >
                      PROCEED TO CHECKOUT
                    </span>
                    <span className={`font-mono transition-colors ${agree ? "text-[#C4541A] group-hover:text-[#F4EFE6]" : "text-[#B5AE9E]"}`}>
                      →
                    </span>
                  </button>
                </div>

                <div className="mt-6">
                  <Link
                    to="/shop"
                    className="font-mono text-[10px] tracking-[0.3em] text-[#8B8577] hover:text-[#1A1A18] transition-colors"
                  >
                    ← CONTINUE SHOPPING
                  </Link>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <FlagStrip className="w-24 h-0.5" />
                  <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
                  <FlagStrip className="w-24 h-0.5" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Toast */}
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[min(92vw,400px)] ${
            toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="relative flex items-center gap-3 bg-[#1A1A18] border border-[#C4541A]/50 px-5 py-4 shadow-2xl">
            <ManweBeastMini size={14} opacity={0.9} />
            <span className="text-[#F4EFE6] flex-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.18em" }}>
              {toast}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}