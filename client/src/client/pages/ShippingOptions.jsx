// src/client/pages/ShippingOptions.jsx
import { useState, useEffect, useCallback, memo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

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

const AdinkraDiamond = memo(function AdinkraDiamond({ size = 8, fill = "#D4651F", opacity = 0.8 }) {
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
        <div className="flex-1 bg-[#2D5A2E]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
      <div className="w-px bg-transparent" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#D4651F]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
    </div>
  );
});

const ManweGradientText = memo(function ManweGradientText({ children, fontSize = "32px", letterSpacing = "0.05em" }) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
        lineHeight: 1,
        background:
          "linear-gradient(135deg, #2D5A2E 0%, #4A8C4D 25%, #1A1A18 50%, #D4651F 75%, #C4541A 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
});

const SectionLabel = memo(function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4" aria-hidden="true">
      <div className="w-4 h-px bg-[#2D5A2E]" />
      <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
      <span
        className="text-[#2D5A2E]"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.4em",
        }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D9D2C4]" />
    </div>
  );
});

// ─── Rate Skeleton ────────────────────────────────────────────────────────────

function CourierSkeleton() {
  return (
    <div className="p-5 border border-[#D9D2C4] bg-[#FDFAF3] animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-[#D9D2C4] w-36 rounded" />
        <div className="h-5 bg-[#D9D2C4] w-20 rounded" />
      </div>
      <div className="h-3 bg-[#D9D2C4] w-24 rounded" />
    </div>
  );
}

// ─── Shipping Options Page ────────────────────────────────────────────────────

export default function ShippingOptions() {
  const navigate = useNavigate();
  const { cartItems, checkoutData, specialInstructions, updateDeliveryCost } = useCart();

  const [availableRates, setAvailableRates] = useState([]);
  const [selectedRateId, setSelectedRateId] = useState("");
  const [loadingRates, setLoadingRates] = useState(true);
  const [estimatedWeight, setEstimatedWeight] = useState(1.0);

  // Fetch live courier rates from Supabase Edge Function
  const fetchCourierRates = useCallback(async () => {
    setLoadingRates(true);
    try {
      const response = await api.post("/get-shipping-rates", {
        checkoutData,
        cartItems,
      });

      const rates = response.data?.rates || [];
      const weight = response.data?.weightKg || 1.0;

      setAvailableRates(rates);
      setEstimatedWeight(weight);

      if (rates.length > 0) {
        setSelectedRateId(rates[0].id);
      }
    } catch (err) {
      console.error("Failed to load live courier rates:", err);
      // Fail-safe rate
      const fallback = [
        {
          id: "std_fallback",
          carrier: "STANDARD COURIER",
          name: "STANDARD DELIVERY",
          cost: 4500,
          estDelivery: "3–5 BUSINESS DAYS",
        },
      ];
      setAvailableRates(fallback);
      setSelectedRateId(fallback[0].id);
    } finally {
      setLoadingRates(false);
    }
  }, [checkoutData, cartItems]);

  useEffect(() => {
    fetchCourierRates();
  }, [fetchCourierRates]);

  const selectedRate = availableRates.find((r) => r.id === selectedRateId) || availableRates[0];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (selectedRate?.cost || 0);

  const addressParts = [
    checkoutData?.address,
    checkoutData?.city,
    checkoutData?.state,
    checkoutData?.country || "Nigeria",
  ].filter((part) => Boolean(part) && part.toString().toLowerCase() !== "undefined");

  const deliveryAddress = addressParts.length > 0 ? addressParts.join(", ") : "ADDRESS PENDING";

  const handleContinue = () => {
    if (!selectedRate) return;

    updateDeliveryCost(selectedRate.cost);

    sessionStorage.setItem(
      "manwe_shipping",
      JSON.stringify({
        id: selectedRate.id,
        method: selectedRate.name,
        carrier: selectedRate.carrier,
        price: selectedRate.cost,
        label: selectedRate.estDelivery,
      })
    );

    navigate("/checkout/payment");
  };

  return (
    <div
      className="min-h-screen pt-24 pb-16 relative overflow-hidden"
      style={{ backgroundColor: "#F4EFE6", color: "#1A1A18" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={500} opacity={0.04} />
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-10">
        <FlagStrip />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <ManweBeastEmblem size={54} opacity={1} />

          <div className="flex items-center gap-3 mt-6 mb-4">
            <div className="w-10 h-px bg-[#2D5A2E]" />
            <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
            <span
              className="text-[#2D5A2E]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.4em",
              }}
            >
              STEP 03 OF 04
            </span>
            <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
            <div className="w-10 h-px bg-[#D4651F]" />
          </div>

          <h1
            className="text-center leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 8vw, 72px)",
              letterSpacing: "0.05em",
            }}
          >
            <ManweGradientText fontSize="clamp(40px, 8vw, 72px)" letterSpacing="0.05em">
              DELIVERY
            </ManweGradientText>
          </h1>

          <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em] mt-4">
            LIVE COURIER RATES · PARCEL WT: {estimatedWeight}KG
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: COURIER RATES */}
          <div className="flex-1 flex flex-col gap-6">
            <SectionLabel>SELECT COURIER SERVICE</SectionLabel>

            {loadingRates ? (
              <div className="space-y-3">
                <CourierSkeleton />
                <CourierSkeleton />
              </div>
            ) : (
              <div className="space-y-3">
                {availableRates.map((rate) => {
                  const isSelected = rate.id === selectedRateId;
                  return (
                    <div
                      key={rate.id}
                      onClick={() => setSelectedRateId(rate.id)}
                      className={`
                        relative border p-5 cursor-pointer transition-all duration-200 manwe-freight group overflow-hidden
                        ${
                          isSelected
                            ? "border-[#1A1A18] bg-[#FDFAF3] shadow-md"
                            : "border-[#D9D2C4] bg-[#FDFAF3]/60 hover:border-[#1A1A18]/50"
                        }
                      `}
                    >
                      <div className="manwe-laser absolute top-0 bottom-0 w-[2px] bg-[#C4541A] z-20 opacity-0 group-hover:opacity-100 pointer-events-none" />

                      <span className="absolute -top-1 -left-1 z-10"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={isSelected ? 1 : 0.3} /></span>
                      <span className="absolute -top-1 -right-1 z-10"><AdinkraDiamond size={7} fill="#D4651F" opacity={isSelected ? 1 : 0.3} /></span>

                      <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? "border-[#1A1A18]" : "border-[#B5AE9E]"
                            }`}
                          >
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#D4651F]" />}
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <ManweBeastMini size={14} opacity={isSelected ? 0.9 : 0.5} />
                              <span
                                className="text-[#1A1A18]"
                                style={{
                                  fontFamily: "'Bebas Neue', sans-serif",
                                  fontSize: "18px",
                                  letterSpacing: "0.12em",
                                }}
                              >
                                {rate.name}
                              </span>
                            </div>
                            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.25em]">
                              ESTIMATED: {rate.estDelivery}
                            </p>
                          </div>
                        </div>

                        <span
                          className="text-[#1A1A18] font-bold"
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "22px",
                            letterSpacing: "0.03em",
                          }}
                        >
                          ₦{rate.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PREVIEW ADDRESS */}
            <div className="mt-2">
              <SectionLabel>DELIVERING TO</SectionLabel>

              <div className="border border-[#D9D2C4] p-5 relative overflow-hidden" style={{ backgroundColor: "#FDFAF3" }}>
                <div className="flex items-start gap-3 relative z-10">
                  <ManweBeastMini size={14} opacity={0.5} />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[#1A1A18] mb-1"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.1em" }}
                    >
                      {checkoutData?.firstName?.toUpperCase() || "MANWE"}{" "}
                      {checkoutData?.lastName?.toUpperCase() || "CLIENT"}
                    </p>
                    <p className="text-[#6B6558] text-sm leading-relaxed break-words">
                      {deliveryAddress.toUpperCase()}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-1 sm:gap-2 font-mono text-[#8B8577] text-[10px] tracking-[0.15em] mt-3 pt-3 border-t border-[#D9D2C4]/50 break-all">
                      <span>PH: {checkoutData?.phone || "PENDING"}</span>
                      <span className="hidden sm:inline text-[#D4651F]">/</span>
                      <span className="break-all">{checkoutData?.email?.toUpperCase() || "PENDING"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTINUE BUTTON */}
            <button
              onClick={handleContinue}
              disabled={loadingRates || !selectedRate}
              className="group relative flex items-center justify-center gap-4 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-8 py-4 transition-all duration-300 mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]"
            >
              <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>
              <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
              <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
              <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>

              <span
                className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.35em" }}
              >
                CONTINUE TO PAYMENT
              </span>
              <span className="text-[#D4651F] group-hover:text-[#F4EFE6] transition-colors font-mono">
                →
              </span>
            </button>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div
            className="flex-1 relative border border-[#D9D2C4] p-6 lg:p-8"
            style={{ backgroundColor: "#FDFAF3" }}
          >
            <SectionLabel>ORDER SUMMARY</SectionLabel>

            <div className="flex flex-col gap-5">
              {cartItems.map((item) => (
                <div
                  key={item.id + item.size}
                  className="flex items-start gap-4 pb-5 border-b border-[#D9D2C4] last:border-b-0 last:pb-0"
                >
                  <div
                    className="relative w-20 h-20 border border-[#D9D2C4] shrink-0 overflow-hidden"
                    style={{ backgroundColor: "#F4EFE6" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="relative z-10 w-full h-full object-contain p-1.5"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-[#1A1A18] mb-1"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.08em", lineHeight: 1.2 }}
                    >
                      {item.name.toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#8B8577] tracking-[0.3em]">
                      <span>SIZE {item.size}</span>
                      <span className="text-[#D9D2C4]">·</span>
                      <span>QTY {item.quantity}</span>
                    </div>
                  </div>

                  <p
                    className="text-[#1A1A18]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.03em" }}
                  >
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#D9D2C4] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#6B6558]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.3em" }}>
                  SUBTOTAL
                </span>
                <span className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px" }}>
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#6B6558]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.3em" }}>
                  DELIVERY ({selectedRate?.carrier || "COURIER"})
                </span>
                <span className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px" }}>
                  {loadingRates ? "CALCULATING..." : `₦${(selectedRate?.cost || 0).toLocaleString()}`}
                </span>
              </div>

              <div className="pt-4 mt-2 border-t border-[#D9D2C4] flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="font-mono text-[#8B8577] text-[9px] tracking-[0.4em] mb-1">TOTAL</span>
                  <span className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "14px", letterSpacing: "0.25em" }}>
                    ORDER
                  </span>
                </div>
                <ManweGradientText fontSize="clamp(24px, 4vw, 34px)" letterSpacing="0.02em">
                  ₦{total.toLocaleString()}
                </ManweGradientText>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <FlagStrip className="w-20 h-0.5" />
              <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
              <FlagStrip className="w-20 h-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}