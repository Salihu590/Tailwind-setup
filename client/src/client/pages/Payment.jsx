// Payment.jsx — MANWE Order Finalization & Paystack Gateway (Production)
// West African Futurism — Nigeria × Côte d'Ivoire

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMailOutline, IoCallOutline } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { supabase } from "../../lib/supabase";
import { api } from "../../lib/api";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dsci2gspy/image/upload/f_auto,q_auto,w_200/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

// ─── SVGs (memoized) ──────────────────────────────────────────────────────────

const ManweBeastEmblem = memo(function ManweBeastEmblem({ size = 60, opacity = 1, animate = false }) {
  const pathClass = animate ? "animate-path" : "";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }} aria-hidden="true">
      <path className={pathClass} d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="#1A5C2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path className={pathClass} d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="#C4541A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path className={pathClass} d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="#1A1A18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path className={pathClass} d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#1A1A18" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#1A5C2A" />
      <circle cx="44" cy="28" r="1.5" fill="#C4541A" />
      <path className={pathClass} d="M37 18 L40 8 L43 18" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line className={pathClass} x1="40" y1="55" x2="40" y2="70" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" />
      <path className={pathClass} d="M40 70 L43 74 L40 78 L37 74 Z" fill="#1A1A18" opacity="0.7" />
      <line className={pathClass} x1="12" y1="30" x2="22" y2="25" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.5" />
      <line className={pathClass} x1="14" y1="35" x2="24" y2="30" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.4" />
      <line className={pathClass} x1="68" y1="30" x2="58" y2="25" stroke="#C4541A" strokeWidth="0.8" opacity="0.5" />
      <line className={pathClass} x1="66" y1="35" x2="56" y2="30" stroke="#C4541A" strokeWidth="0.8" opacity="0.4" />
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateOrderId = () => {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `MW-${Date.now().toString().slice(-6)}-${rand}`;
};

function normalizeCartItems(items = []) {
  return items.map((item) => ({
    id: item.id,
    name: item.name || "MANWE PIECE",
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
    size: item.size || "N/A",
    image: item.image || item.img || DEFAULT_IMAGE,
  }));
}

// ─── Payment Page Component ───────────────────────────────────────────────────

export default function Payment() {
  const navigate = useNavigate();
  const { cartItems, checkoutData, specialInstructions, clearCart, deliveryCost } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const paystackScriptRef = useRef(null);

  // 1. DYNAMIC COURIER RATE: Pull real selected courier fee from sessionStorage or context
  const savedShipping = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("manwe_shipping");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const shippingCost = Number(savedShipping?.price ?? deliveryCost ?? 4500);
  const selectedCourierName = savedShipping?.method || "STANDARD DELIVERY";

  // 2. Normalize cart items
  const normalizedCart = useMemo(() => normalizeCartItems(cartItems), [cartItems]);

  const subtotal = useMemo(
    () => normalizedCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [normalizedCart]
  );

  const total = subtotal + shippingCost;

  // Guard: if cart is empty and not on success screen, redirect back to cart
  useEffect(() => {
    if (!cartItems?.length && !isPaymentSuccessful) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems, isPaymentSuccessful, navigate]);

  // Load Paystack Inline script dynamically
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackReady(true);
    script.onerror = () => console.error("Failed to load Paystack script");

    paystackScriptRef.current = script;
    document.body.appendChild(script);

    return () => {
      if (paystackScriptRef.current?.parentNode) {
        document.body.removeChild(paystackScriptRef.current);
      }
    };
  }, []);

  const createOrder = async (orderId) => {
    const { error } = await supabase.from("orders").insert([
      {
        order_id: orderId,
        cart_items: normalizedCart,
        checkout_data: {
          ...checkoutData,
          country: checkoutData.country || "Nigeria",
          shipping_method: selectedCourierName,
        },
        shipping_cost: shippingCost,
        total,
        special_instructions: specialInstructions || "",
        payment_status: "pending",
        order_status: "pending",
        viewed: false,
      },
    ]);

    if (error) throw new Error(error.message);
  };

  const sendEmail = useCallback(async (type, orderData) => {
    try {
      await api.post("/send-email", { type, order: orderData });
    } catch (err) {
      console.error(`send-email (${type}) error:`, err);
    }
  }, []);

  const payWithPaystack = (newOrderId) => {
    return new Promise((resolve, reject) => {
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        reject(new Error("Paystack Public Key missing in environment settings."));
        return;
      }

      if (!window.PaystackPop) {
        reject(new Error("Paystack gateway unavailable. Refresh and try again."));
        return;
      }

      try {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: checkoutData.email,
          amount: Math.round(total * 100), // Kobo integer
          ref: newOrderId,
          currency: "NGN",

          callback: function () {
            supabase
              .from("orders")
              .update({
                payment_status: "paid",
                order_status: "confirmed",
                viewed: false,
              })
              .eq("order_id", newOrderId)
              .select()
              .single()
              .then((result) => {
                const order = result.data || {
                  order_id: newOrderId,
                  cart_items: normalizedCart,
                  checkout_data: checkoutData,
                  shipping_cost: shippingCost,
                  total,
                  special_instructions: specialInstructions,
                };

                sendEmail("confirmation", order);
                sendEmail("admin-notification", order);
              });

            resolve("success");
          },

          onClose: function () {
            resolve("closed");
          },
        });

        handler.openIframe();
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleCompleteOrder = async () => {
    if (isProcessing) return;

    if (!paystackReady) {
      toast.error("PAYMENT GATEWAY INITIALIZING — PLEASE WAIT");
      return;
    }

    if (!normalizedCart.length) {
      toast.error("YOUR CART IS EMPTY");
      return;
    }

    if (!checkoutData?.email) {
      toast.error("MISSING CUSTOMER EMAIL — PLEASE RETURN TO CHECKOUT");
      return;
    }

    setIsProcessing(true);

    try {
      const newOrderId = generateOrderId();
      await createOrder(newOrderId);
      const result = await payWithPaystack(newOrderId);

      if (result === "success") {
        sessionStorage.removeItem("manwe_shipping");
        clearCart();
        setIsPaymentSuccessful(true);
        toast.success("ORDER CONFIRMED — WELCOME TO THE TRIBE");
      } else {
        toast.error("PAYMENT CANCELLED — YOUR SELECTION IS STILL SAVED");
      }
    } catch (error) {
      toast.error(`ORDER ERROR: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SUCCESS SCREEN (CONFETTI & LIVE DRAWING EMBLEM)
  // ═══════════════════════════════════════════════════════════════════════════

  if (isPaymentSuccessful) {
    return (
      <>
        <Helmet>
          <title>Order Confirmed — MANWE</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>

        <div
          className="min-h-screen pt-24 pb-16 flex items-center justify-center px-6 relative overflow-hidden"
          style={{ backgroundColor: "#F4EFE6", color: "#1A1A18" }}
        >
          {/* CSS Animation Injector */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes drawPath {
              0% { stroke-dasharray: 200; stroke-dashoffset: 200; }
              100% { stroke-dasharray: 200; stroke-dashoffset: 0; }
            }
            @keyframes particleBurst {
              0% { transform: translate(-50%, -50%) scale(0.2) rotate(0deg); opacity: 0; }
              15% { opacity: 1; }
              100% { transform: translate(var(--x), var(--y)) scale(1.1) rotate(var(--r)); opacity: 0; }
            }
            @keyframes scaleUpCard {
              0% { transform: translateY(40px) scale(0.95); opacity: 0; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            @keyframes fadeInUp {
              0% { transform: translateY(15px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            .animate-path {
              stroke-dasharray: 200;
              stroke-dashoffset: 200;
              animation: drawPath 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            }
            .animate-particle {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              animation: particleBurst 1.8s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;
            }
            .animate-success-card {
              animation: scaleUpCard 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-stagger-1 {
              opacity: 0;
              animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            }
            .animate-stagger-2 {
              opacity: 0;
              animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
            }
            .animate-stagger-3 {
              opacity: 0;
              animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
            }
          ` }} />

          {/* Background watermark */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ManweBeastEmblem size={600} opacity={0.04} />
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 z-10">
            <FlagStrip />
          </div>

          <div
            className="relative border border-[#D9D2C4] p-8 md:p-12 max-w-2xl w-full text-center animate-success-card z-20"
            style={{ backgroundColor: "#FDFAF3" }}
          >
            {/* Adinkra Confetti Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16 + Math.random() * 8;
                const rad = (angle * Math.PI) / 180;
                const distance = 110 + Math.random() * 110;
                const x = `${Math.cos(rad) * distance}px`;
                const y = `${Math.sin(rad) * distance}px`;
                const delay = `${Math.random() * 0.2}s`;
                const randomRotation = `${120 + Math.random() * 180}deg`;
                const colors = ["#2D5A2E", "#D4651F", "#1A1A18", "#1A5C2A"];

                return (
                  <div
                    key={i}
                    className="animate-particle"
                    style={{
                      "--x": x,
                      "--y": y,
                      "--r": randomRotation,
                      animationDelay: delay,
                    }}
                  >
                    <AdinkraDiamond size={i % 3 === 0 ? 10 : 7} fill={colors[i % colors.length]} opacity={0.9} />
                  </div>
                );
              })}
            </div>

            <span className="absolute -top-1 -left-1"><AdinkraDiamond size={8} fill="#2D5A2E" opacity={1} /></span>
            <span className="absolute -top-1 -right-1"><AdinkraDiamond size={8} fill="#D4651F" opacity={1} /></span>
            <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={8} fill="#D4651F" opacity={1} /></span>
            <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={8} fill="#2D5A2E" opacity={1} /></span>

            <div className="flex justify-center mb-6 scale-110 relative z-20">
              <ManweBeastEmblem size={72} opacity={1} animate={true} />
            </div>

            <div className="flex items-center justify-center gap-3 mb-4 animate-stagger-1">
              <div className="w-8 h-px bg-[#2D5A2E]" />
              <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
              <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}>
                ORDER RECEIVED
              </span>
              <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
              <div className="w-8 h-px bg-[#D4651F]" />
            </div>

            <h1 className="mb-6 leading-none animate-stagger-1">
              <ManweGradientText fontSize="clamp(38px, 7vw, 64px)" letterSpacing="0.05em">
                WELCOME TO THE TRIBE
              </ManweGradientText>
            </h1>

            <p className="text-[#6B6558] mb-8 leading-relaxed max-w-md mx-auto animate-stagger-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.15em" }}>
              YOUR PIECES ARE PREPARED FOR SHIPPING.
              <br />
              CONFIRMATION SENT TO {checkoutData.email?.toUpperCase() || "YOUR EMAIL"}.
            </p>

            <div className="border-y border-[#D9D2C4] py-6 mb-8 animate-stagger-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ManweBeastMini size={14} opacity={0.7} />
                <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "12px", letterSpacing: "0.4em" }}>
                  SUPPORT & INQUIRIES
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <a
                  href={`mailto:${import.meta.env.VITE_GMAIL_ACCOUNT || "info@manweofficial.com.ng"}`}
                  className="group relative flex items-center gap-3 border border-[#1A1A18]/30 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-6 py-3 transition-all duration-300"
                >
                  <IoMailOutline className="text-lg text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors" />
                  <span className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.3em" }}>
                    EMAIL US
                  </span>
                </a>
                <a
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "2349162407757"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 border border-[#2D5A2E] bg-[#2D5A2E] hover:bg-[#1A5C2A] px-6 py-3 transition-all duration-300"
                >
                  <IoCallOutline className="text-lg text-[#F4EFE6]" />
                  <span className="text-[#F4EFE6]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.3em" }}>
                    WHATSAPP SUPPORT
                  </span>
                </a>
              </div>
            </div>

            <Link
              to="/shop"
              className="group relative inline-flex items-center gap-4 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-8 py-4 transition-all duration-300 animate-stagger-3"
            >
              <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>
              <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
              <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
              <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>

              <span className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px", letterSpacing: "0.35em" }}>
                RETURN TO SHOP
              </span>
              <span className="text-[#D4651F] group-hover:text-[#F4EFE6] transition-colors font-mono">→</span>
            </Link>

            <div className="mt-8 flex items-center justify-center gap-3 animate-stagger-3">
              <FlagStrip className="w-20 h-0.5" />
              <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
              <FlagStrip className="w-20 h-0.5" />
            </div>
          </div>
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAYMENT SUMMARY PAGE
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <>
      <Helmet>
        <title>Payment — MANWE</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div
        className="min-h-screen pt-24 pb-16 relative overflow-hidden"
        style={{ backgroundColor: "#F4EFE6", color: "#1A1A18" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
              <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}>
                STEP 04 OF 04
              </span>
              <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
              <div className="w-10 h-px bg-[#D4651F]" />
            </div>

            <h1 className="text-center leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 8vw, 72px)", letterSpacing: "0.05em" }}>
              <ManweGradientText fontSize="clamp(40px, 8vw, 72px)" letterSpacing="0.05em">
                PAYMENT
              </ManweGradientText>
            </h1>

            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em] mt-4">
              SECURE THE PIECES — COMPLETE YOUR ORDER
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative border border-[#D9D2C4] p-6 lg:p-8" style={{ backgroundColor: "#FDFAF3" }}>
              <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>
              <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
              <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
              <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>

              <SectionLabel>FINAL ORDER SUMMARY</SectionLabel>

              {/* Customer info */}
              <div className="border-b border-[#D9D2C4] pb-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <ManweBeastMini size={12} opacity={0.6} />
                  <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "10px", letterSpacing: "0.4em" }}>
                    CLIENT & DESTINATION
                  </span>
                </div>

                <p className="text-[#1A1A18] mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.1em" }}>
                  {checkoutData.firstName?.toUpperCase()} {checkoutData.lastName?.toUpperCase()}
                </p>
                <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.2em] mb-1">
                  {checkoutData.email}
                </p>
                <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.2em] mb-3">
                  {checkoutData.phone}
                </p>

                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-[#D4651F] rotate-45 mt-2 shrink-0" />
                  <p className="text-[#6B6558] text-sm leading-relaxed flex-1">
                    {checkoutData.address}, {checkoutData.city}, {checkoutData.state}, {checkoutData.country || "Nigeria"}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-5">
                {normalizedCart.map((item) => (
                  <div key={item.id + item.size} className="flex items-start gap-4 pb-5 border-b border-[#D9D2C4] last:border-b-0 last:pb-0">
                    <div className="relative w-20 h-20 border border-[#D9D2C4] shrink-0 overflow-hidden" style={{ backgroundColor: "#F4EFE6" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="relative z-10 w-full h-full object-contain p-1.5"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#1A1A18] mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.08em", lineHeight: 1.2 }}>
                        {item.name.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#8B8577] tracking-[0.3em]">
                        <span>SIZE {item.size}</span>
                        <span className="text-[#D9D2C4]">·</span>
                        <span>QTY {item.quantity}</span>
                      </div>
                    </div>

                    <p className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.03em" }}>
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              {specialInstructions && (
                <div className="mt-6 pt-6 border-t border-[#D9D2C4]">
                  <div className="flex items-center gap-2 mb-2">
                    <AdinkraDiamond size={5} fill="#2D5A2E" opacity={1} />
                    <span className="text-[#6B6558]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}>
                      SPECIAL INSTRUCTIONS
                    </span>
                  </div>
                  <p className="text-[#6B6558] text-sm leading-relaxed italic pl-3 border-l border-[#D9D2C4] break-words">
                    {specialInstructions}
                  </p>
                </div>
              )}

              {/* Totals */}
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
                    DELIVERY ({selectedCourierName})
                  </span>
                  <span className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px" }}>
                    ₦{shippingCost.toLocaleString()}
                  </span>
                </div>

                <div className="pt-4 mt-2 border-t border-[#D9D2C4] flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="font-mono text-[#8B8577] text-[9px] tracking-[0.4em] mb-1">TOTAL DUE</span>
                    <span className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "14px", letterSpacing: "0.25em" }}>
                      FINAL
                    </span>
                  </div>
                  <ManweGradientText fontSize="clamp(26px, 4.5vw, 38px)" letterSpacing="0.02em">
                    ₦{total.toLocaleString()}
                  </ManweGradientText>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={isProcessing || !paystackReady}
                className={`
                  group relative flex items-center justify-center gap-4 border px-8 py-4 transition-all duration-300 w-full mt-6
                  manwe-shake-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]
                  ${
                    isProcessing || !paystackReady
                      ? "border-[#D9D2C4] cursor-not-allowed opacity-50"
                      : "border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18]"
                  }
                `}
              >
                {!isProcessing && paystackReady && (
                  <>
                    <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>
                    <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
                    <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
                    <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>
                  </>
                )}

                <span
                  className={`transition-colors ${
                    isProcessing || !paystackReady
                      ? "text-[#8B8577]"
                      : "text-[#1A1A18] group-hover:text-[#F4EFE6]"
                  }`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.35em" }}
                >
                  {isProcessing
                    ? "PROCESSING..."
                    : !paystackReady
                    ? "INITIALIZING GATEWAY..."
                    : `PAY ₦${total.toLocaleString()}`}
                </span>

                {!isProcessing && paystackReady && (
                  <span className="text-[#D4651F] group-hover:text-[#F4EFE6] transition-colors font-mono">
                    →
                  </span>
                )}
              </button>

              <Link
                to="/checkout/shipping"
                className="group flex items-center justify-center gap-2 text-[#6B6558] hover:text-[#1A1A18] transition-colors mt-4 font-mono text-xs tracking-[0.2em]"
              >
                ← BACK TO DELIVERY OPTIONS
              </Link>

              <div className="mt-8 flex items-center justify-center gap-3">
                <FlagStrip className="w-20 h-0.5" />
                <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
                <FlagStrip className="w-20 h-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}