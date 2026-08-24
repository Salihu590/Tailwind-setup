// Checkout.jsx — MANWE Delivery Address (Production)
import { useState, useEffect, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";

const SITE_URL = "https://manweofficial.com.ng";
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dsci2gspy/image/upload/f_auto,q_auto,w_200/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

const NIGERIA_STATES = Object.freeze([
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti",
  "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

const SectionLabel = memo(function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4" aria-hidden="true">
      <div className="w-4 h-px bg-[#1A5C2A]" />
      <AdinkraDiamond size={6} fill="#C4541A" opacity={1} />
      <span className="text-[#1A5C2A]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}>
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D9D2C4]" />
    </div>
  );
});

const fieldStyle = {
  backgroundColor: "#FDFAF3",
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "15px",
  letterSpacing: "0.08em",
};

function FieldLabel({ children, required }) {
  return (
    <label
      className="text-[#6B6558] flex items-center gap-2"
      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "10px", letterSpacing: "0.3em" }}
    >
      {children}
      {required && <AdinkraDiamond size={4} fill="#C4541A" opacity={1} />}
    </label>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="font-mono text-[9px] tracking-[0.2em] text-[#C4541A] mt-1" role="alert">
      {msg}
    </p>
  );
}

const NGN = (n) =>
  Number(n || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

function emptyForm(prev = {}) {
  return {
    firstName: prev.firstName || "",
    lastName: prev.lastName || "",
    address: prev.address || "",
    apartment: prev.apartment || "",
    city: prev.city || "",
    country: "Nigeria", // ALWAYS set — fixes UNDEFINED on shipping page
    state: prev.state || "",
    postalCode: prev.postalCode || "",
    phone: prev.phone || "",
    email: prev.email || "",
  };
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, updateCheckoutData, specialInstructions, checkoutData } = useCart();

  const [formData, setFormData] = useState(() => emptyForm(checkoutData));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Guard: empty bag
  useEffect(() => {
    if (!cartItems?.length) {
      navigate("/cart", { replace: true, state: { reason: "empty_bag" } });
    }
  }, [cartItems, navigate]);

  // Ensure country always Nigeria in context too
  useEffect(() => {
    if (checkoutData?.country !== "Nigeria") {
      const patched = emptyForm({ ...checkoutData, country: "Nigeria" });
      setFormData(patched);
      updateCheckoutData?.(patched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const setField = (name, value) => {
    const next = { ...formData, [name]: value, country: "Nigeria" };
    setFormData(next);
    updateCheckoutData?.(next);
    if (errors[name]) {
      setErrors((e) => {
        const copy = { ...e };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "FIRST NAME REQUIRED";
    if (!formData.lastName.trim()) e.lastName = "LAST NAME REQUIRED";
    if (!formData.address.trim()) e.address = "ADDRESS REQUIRED";
    if (!formData.city.trim()) e.city = "CITY REQUIRED";
    if (!formData.state) e.state = "SELECT A STATE";
    if (!formData.email.trim()) e.email = "EMAIL REQUIRED";
    else if (!EMAIL_RE.test(formData.email.trim())) e.email = "ENTER A VALID EMAIL";
    if (!formData.phone.trim()) e.phone = "PHONE REQUIRED";
    else {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 11) e.phone = "ENTER A VALID NG NUMBER";
    }
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);

    // Normalize phone to +234… for shipping display
    let phone = formData.phone.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = phone.slice(1);
    if (!phone.startsWith("234")) phone = `234${phone}`;
    const normalized = {
      ...formData,
      country: "Nigeria",
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: `+${phone}`,
    };

    updateCheckoutData?.(normalized);
    navigate("/checkout/shipping");
  };

  if (!cartItems?.length) return null;

  return (
    <>
      <Helmet>
        <title>Checkout — MANWE</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href={`${SITE_URL}/checkout`} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 relative overflow-hidden" style={{ backgroundColor: "#F4EFE6", color: "#1A1A18" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <ManweBeastEmblem size={500} opacity={0.04} />
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 z-10">
          <FlagStrip />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <header className="flex flex-col items-center mb-12">
            <ManweBeastEmblem size={54} opacity={1} />
            <div className="flex items-center gap-3 mt-6 mb-4">
              <div className="w-10 h-px bg-[#1A5C2A]" />
              <AdinkraDiamond size={7} fill="#C4541A" opacity={1} />
              <span className="text-[#1A5C2A]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}>
                STEP 02 OF 04
              </span>
              <AdinkraDiamond size={7} fill="#C4541A" opacity={1} />
              <div className="w-10 h-px bg-[#C4541A]" />
            </div>
            <h1 className="text-center leading-none">
              <ManweGradientText fontSize="clamp(40px, 8vw, 72px)" letterSpacing="0.05em">
                CHECKOUT
              </ManweGradientText>
            </h1>
            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em] mt-4">
              WHERE ARE WE SENDING YOUR PIECES
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* FORM */}
            <div className="flex-1 flex flex-col gap-6">
              <SectionLabel>DELIVERY ADDRESS</SectionLabel>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="flex flex-col gap-2">
                  <FieldLabel required>EMAIL ADDRESS</FieldLabel>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full border outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors ${
                      errors.email ? "border-[#C4541A]" : "border-[#D9D2C4] focus:border-[#1A1A18]"
                    }`}
                    style={fieldStyle}
                  />
                  <FieldError msg={errors.email} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <FieldLabel required>FIRST NAME</FieldLabel>
                    <input
                      name="firstName"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      placeholder="First name"
                      className={`w-full border outline-none px-4 py-3 ${errors.firstName ? "border-[#C4541A]" : "border-[#D9D2C4] focus:border-[#1A1A18]"}`}
                      style={fieldStyle}
                    />
                    <FieldError msg={errors.firstName} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FieldLabel required>LAST NAME</FieldLabel>
                    <input
                      name="lastName"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      placeholder="Last name"
                      className={`w-full border outline-none px-4 py-3 ${errors.lastName ? "border-[#C4541A]" : "border-[#D9D2C4] focus:border-[#1A1A18]"}`}
                      style={fieldStyle}
                    />
                    <FieldError msg={errors.lastName} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel required>ADDRESS</FieldLabel>
                  <input
                    name="address"
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="Street address"
                    className={`w-full border outline-none px-4 py-3 ${errors.address ? "border-[#C4541A]" : "border-[#D9D2C4] focus:border-[#1A1A18]"}`}
                    style={fieldStyle}
                  />
                  <FieldError msg={errors.address} />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>APARTMENT / SUITE</FieldLabel>
                  <input
                    name="apartment"
                    value={formData.apartment}
                    onChange={(e) => setField("apartment", e.target.value)}
                    placeholder="Optional"
                    className="w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3"
                    style={fieldStyle}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <FieldLabel required>COUNTRY</FieldLabel>
                    <input
                      value="Nigeria"
                      disabled
                      readOnly
                      className="w-full border border-[#D9D2C4] outline-none px-4 py-3 opacity-70 cursor-not-allowed"
                      style={fieldStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FieldLabel required>STATE</FieldLabel>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={(e) => setField("state", e.target.value)}
                      className={`w-full border outline-none px-4 py-3 appearance-none cursor-pointer ${
                        errors.state ? "border-[#C4541A]" : "border-[#D9D2C4] focus:border-[#1A1A18]"
                      }`}
                      style={{
                        ...fieldStyle,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%231A1A18' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="">Select state</option>
                      {NIGERIA_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <FieldError msg={errors.state} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <FieldLabel required>CITY</FieldLabel>
                    <input
                      name="city"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="City"
                      className={`w-full border outline-none px-4 py-3 ${errors.city ? "border-[#C4541A]" : "border-[#D9D2C4] focus:border-[#1A1A18]"}`}
                      style={fieldStyle}
                    />
                    <FieldError msg={errors.city} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FieldLabel>POSTAL CODE</FieldLabel>
                    <input
                      name="postalCode"
                      autoComplete="postal-code"
                      value={formData.postalCode}
                      onChange={(e) => setField("postalCode", e.target.value)}
                      placeholder="Optional"
                      className="w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3"
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel required>PHONE NUMBER</FieldLabel>
                  <div
                    className={`relative flex items-center border focus-within:border-[#1A1A18] transition-colors ${
                      errors.phone ? "border-[#C4541A]" : "border-[#D9D2C4]"
                    }`}
                    style={{ backgroundColor: "#FDFAF3" }}
                  >
                    <span
                      className="pl-4 pr-3 border-r border-[#D9D2C4] text-[#6B6558] py-3 shrink-0"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px", letterSpacing: "0.1em" }}
                    >
                      +234
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={(e) => setField("phone", e.target.value.replace(/[^\d\s-]/g, ""))}
                      placeholder="801 234 5678"
                      className="flex-1 bg-transparent outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E] min-w-0"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px", letterSpacing: "0.1em" }}
                    />
                  </div>
                  <FieldError msg={errors.phone} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative flex items-center justify-center gap-4 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-8 py-4 transition-all duration-300 w-full mt-6 manwe-shake-hover disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]"
                >
                  <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
                  <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                  <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                  <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
                  <span className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.3em" }}>
                    CONTINUE TO DELIVERY
                  </span>
                  <span className="text-[#C4541A] group-hover:text-[#F4EFE6] transition-colors font-mono">→</span>
                </button>

                <Link
                  to="/cart"
                  className="block text-center font-mono text-[10px] tracking-[0.3em] text-[#8B8577] hover:text-[#1A1A18] transition-colors pt-2"
                >
                  ← BACK TO BAG
                </Link>
              </form>
            </div>

            {/* SUMMARY */}
            <aside
              className="flex-1 relative border border-[#D9D2C4] p-6 lg:p-8 h-fit lg:sticky lg:top-28"
              style={{ backgroundColor: "#FDFAF3" }}
              aria-label="Order summary"
            >
              <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
              <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
              <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
              <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>

              <SectionLabel>ORDER SUMMARY</SectionLabel>

              <div className="flex flex-col gap-5">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-start gap-4 pb-5 border-b border-[#D9D2C4] last:border-0 last:pb-0">
                    <div className="relative w-20 h-20 border border-[#D9D2C4] shrink-0 overflow-hidden" style={{ backgroundColor: "#F4EFE6" }}>
                      <img
                        src={item.image || DEFAULT_IMAGE}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                        className="relative z-10 w-full h-full object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#1A1A18] mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.08em", lineHeight: 1.2 }}>
                        {item.name.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#8B8577] tracking-[0.25em]">
                        <span>SIZE {item.size}</span>
                        <span className="text-[#D9D2C4]">·</span>
                        <span>QTY {item.quantity}</span>
                      </div>
                    </div>
                    <p className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px" }}>
                      {NGN(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {specialInstructions && (
                <div className="mt-6 pt-6 border-t border-[#D9D2C4]">
                  <div className="flex items-center gap-2 mb-2">
                    <AdinkraDiamond size={5} fill="#1A5C2A" opacity={1} />
                    <span className="text-[#6B6558]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}>
                      SPECIAL INSTRUCTIONS
                    </span>
                  </div>
                  <p className="text-[#6B6558] text-sm leading-relaxed italic pl-3 border-l border-[#D9D2C4] break-words">
                    {specialInstructions}
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[#D9D2C4] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B6558]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.3em" }}>
                    SUBTOTAL
                  </span>
                  <span className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px" }}>
                    {NGN(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B8577]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.3em" }}>
                    DELIVERY
                  </span>
                  <span className="font-mono text-[#8B8577] text-[10px] tracking-[0.25em]">
                    CALCULATED NEXT
                  </span>
                </div>
                <div className="pt-4 mt-2 border-t border-[#D9D2C4] flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="font-mono text-[#8B8577] text-[9px] tracking-[0.4em] mb-1">TOTAL</span>
                    <span className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "14px", letterSpacing: "0.25em" }}>
                      SO FAR
                    </span>
                  </div>
                  <ManweGradientText fontSize="clamp(24px, 4vw, 34px)" letterSpacing="0.02em">
                    {NGN(subtotal)}
                  </ManweGradientText>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <FlagStrip className="w-20 h-0.5" />
                <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
                <FlagStrip className="w-20 h-0.5" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}