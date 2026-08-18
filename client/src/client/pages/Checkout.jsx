import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const statesByCountry = {
  Nigeria: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti",
    "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
    "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
    "Taraba", "Yobe", "Zamfara",
  ],
};

const countryCodes = {
  Nigeria: "+234",
};

// ─── MANWE Unity Beast Emblem (light bg version) ──────────────────────────────

function ManweBeastEmblem({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
      <path
        d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40"
        stroke="#1A5C2A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40"
        stroke="#C4541A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M30 40 L35 55 L40 35 L45 55 L50 40"
        stroke="#1A1A18"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#1A1A18" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#1A5C2A" />
      <circle cx="44" cy="28" r="1.5" fill="#C4541A" />
      <path
        d="M37 18 L40 8 L43 18"
        stroke="#1A1A18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="40" y1="55" x2="40" y2="70" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="#1A1A18" opacity="0.7" />
      <line x1="12" y1="30" x2="22" y2="25" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.5" />
      <line x1="14" y1="35" x2="24" y2="30" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.4" />
      <line x1="68" y1="30" x2="58" y2="25" stroke="#C4541A" strokeWidth="0.8" opacity="0.5" />
      <line x1="66" y1="35" x2="56" y2="30" stroke="#C4541A" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

function ManweBeastMini({ size = 18, opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }}>
      <path d="M10 2 L14 8 L10 14 L6 8 Z" stroke="#1A1A18" strokeWidth="1" fill="none" />
      <path d="M3 10 L6 4 L8 8" stroke="#1A5C2A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M17 10 L14 4 L12 8" stroke="#C4541A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M7 12 L8.5 17 L10 13 L11.5 17 L13 12" stroke="#1A1A18" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="9" cy="7" r="0.7" fill="#1A5C2A" />
      <circle cx="11" cy="7" r="0.7" fill="#C4541A" />
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

// ─── Flag Strip ───────────────────────────────────────────────────────────────

function FlagStrip({ className = "w-full h-0.5" }) {
  return (
    <div className={`${className} flex`}>
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
}

// ─── Gradient text ────────────────────────────────────────────────────────────

function ManweGradientText({ children, fontSize = "32px", letterSpacing = "0.05em" }) {
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
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
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
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function ManweInput({ label, name, value, onChange, type = "text", placeholder, required = false, disabled = false }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[#6B6558] flex items-center gap-2"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.3em",
        }}
      >
        {label}
        {required && <AdinkraDiamond size={4} fill="#D4651F" opacity={1} />}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3
          text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
        style={{
          backgroundColor: "#FDFAF3",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "15px",
          letterSpacing: "0.1em",
        }}
      />
    </div>
  );
}

// ─── Select Field ─────────────────────────────────────────────────────────────

function ManweSelect({ label, name, value, onChange, options, required = false, disabled = false, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[#6B6558] flex items-center gap-2"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.3em",
        }}
      >
        {label}
        {required && <AdinkraDiamond size={4} fill="#D4651F" opacity={1} />}
      </label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3
          text-[#1A1A18] transition-colors appearance-none cursor-pointer
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
        style={{
          backgroundColor: "#FDFAF3",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "15px",
          letterSpacing: "0.1em",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%231A1A18' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          paddingRight: "2.5rem",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────

export default function Checkout() {
  const { cartItems, updateCheckoutData, specialInstructions, checkoutData } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    checkoutData || {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      country: "Nigeria",
      state: "",
      phone: "",
      email: "",
    }
  );

  const country = formData.country || "Nigeria";
  const states = statesByCountry[country] || [];
  const phoneCode = countryCodes[country] || "";

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !country ||
      !formData.state ||
      !formData.phone ||
      !formData.email
    ) {
      alert("PLEASE FILL IN ALL REQUIRED FIELDS");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("PLEASE ENTER A VALID EMAIL ADDRESS");
      return;
    }

    navigate("/checkout/shipping");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateCheckoutData(newFormData);
  };

  return (
    <div
      className="min-h-screen pt-24 pb-16 relative overflow-hidden"
      style={{ backgroundColor: "#F4EFE6", color: "#1A1A18" }}
    >
      {/* ── Background watermarks ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={500} opacity={0.04} />
        </div>
        <div className="absolute top-32 right-10 hidden lg:block">
          <ManweBeastMini size={36} opacity={0.15} />
        </div>
        <div className="absolute bottom-32 left-10 hidden lg:block">
          <ManweBeastMini size={36} opacity={0.15} />
        </div>
      </div>

      {/* Top flag strip */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <FlagStrip />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Page Header ── */}
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
              STEP 02 OF 04
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
              CHECKOUT
            </ManweGradientText>
          </h1>

          <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em] mt-4">
            WHERE ARE WE SENDING YOUR PIECES
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LEFT — DELIVERY FORM                                           */}
          {/* ═══════════════════════════════════════════════════════════════ */}

          <div className="flex-1 flex flex-col gap-6">
            <SectionLabel>DELIVERY ADDRESS</SectionLabel>

            <form onSubmit={handleFormSubmit} className="space-y-5">

              {/* Email */}
              <ManweInput
                label="EMAIL ADDRESS"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
              />

              {/* First + Last name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ManweInput
                  label="FIRST NAME"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  required
                />
                <ManweInput
                  label="LAST NAME"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  required
                />
              </div>

              {/* Address */}
              <ManweInput
                label="ADDRESS"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
              />

              <ManweInput
                label="APARTMENT / SUITE"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Optional"
              />

              {/* Country + State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ManweSelect
                  label="COUNTRY"
                  name="country"
                  value={country}
                  onChange={handleInputChange}
                  options={["Nigeria"]}
                  required
                  disabled
                />

                <ManweSelect
                  label="STATE"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  options={states}
                  placeholder="Select state"
                  required
                />
              </div>

              {/* City + Postal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ManweInput
                  label="CITY"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
                <ManweInput
                  label="POSTAL CODE"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>

              {/* Phone with country code */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[#6B6558] flex items-center gap-2"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                  }}
                >
                  PHONE NUMBER
                  <AdinkraDiamond size={4} fill="#D4651F" opacity={1} />
                </label>
                <div className="relative flex items-center border border-[#D9D2C4] focus-within:border-[#1A1A18] transition-colors" style={{ backgroundColor: "#FDFAF3" }}>
                  {phoneCode && (
                    <span
                      className="pl-4 pr-3 border-r border-[#D9D2C4] text-[#6B6558] py-3"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "15px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {phoneCode}
                    </span>
                  )}
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    required
                    className="flex-1 bg-transparent outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "15px",
                      letterSpacing: "0.1em",
                    }}
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="group relative flex items-center justify-center gap-4 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-8 py-4 transition-all duration-300 w-full mt-6"
              >
                <span className="absolute -top-1 -left-1">
                  <AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} />
                </span>
                <span className="absolute -top-1 -right-1">
                  <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
                </span>
                <span className="absolute -bottom-1 -left-1">
                  <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
                </span>
                <span className="absolute -bottom-1 -right-1">
                  <AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} />
                </span>

                <span
                  className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "16px",
                    letterSpacing: "0.35em",
                  }}
                >
                  CONTINUE TO DELIVERY
                </span>
                <span className="text-[#D4651F] group-hover:text-[#F4EFE6] transition-colors font-mono">
                  →
                </span>
              </button>
            </form>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* RIGHT — ORDER SUMMARY                                          */}
          {/* ═══════════════════════════════════════════════════════════════ */}

          <div
            className="flex-1 relative border border-[#D9D2C4] p-6 lg:p-8 h-fit lg:sticky lg:top-28"
            style={{ backgroundColor: "#FDFAF3" }}
          >
            {/* Corner diamonds */}
            <span className="absolute -top-1 -left-1">
              <AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} />
            </span>
            <span className="absolute -top-1 -right-1">
              <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
            </span>
            <span className="absolute -bottom-1 -left-1">
              <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
            </span>
            <span className="absolute -bottom-1 -right-1">
              <AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} />
            </span>

            <SectionLabel>ORDER SUMMARY</SectionLabel>

            {/* Cart items */}
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
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <ManweBeastMini size={30} opacity={0.4} />
                    </div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="relative z-10 w-full h-full object-contain p-1.5"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-[#1A1A18] mb-1"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "16px",
                        letterSpacing: "0.08em",
                        lineHeight: 1.2,
                      }}
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
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "16px",
                      letterSpacing: "0.03em",
                    }}
                  >
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Special instructions */}
            {specialInstructions && (
              <div className="mt-6 pt-6 border-t border-[#D9D2C4]">
                <div className="flex items-center gap-2 mb-2">
                  <AdinkraDiamond size={5} fill="#2D5A2E" opacity={1} />
                  <span
                    className="text-[#6B6558]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.4em",
                    }}
                  >
                    SPECIAL INSTRUCTIONS
                  </span>
                </div>
                <p className="text-[#6B6558] text-sm leading-relaxed italic pl-3 border-l border-[#D9D2C4]">
                  {specialInstructions}
                </p>
              </div>
            )}

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-[#D9D2C4] space-y-3">
              <div className="flex justify-between items-center">
                <span
                  className="text-[#6B6558]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "13px",
                    letterSpacing: "0.3em",
                  }}
                >
                  SUBTOTAL
                </span>
                <span
                  className="text-[#1A1A18]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "15px",
                    letterSpacing: "0.02em",
                  }}
                >
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className="text-[#8B8577]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "13px",
                    letterSpacing: "0.3em",
                  }}
                >
                  DELIVERY
                </span>
                <span className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em]">
                  CALCULATED NEXT
                </span>
              </div>

              <div className="pt-4 mt-2 border-t border-[#D9D2C4] flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="font-mono text-[#8B8577] text-[9px] tracking-[0.4em] mb-1">
                    TOTAL
                  </span>
                  <span
                    className="text-[#1A1A18]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.25em",
                    }}
                  >
                    SO FAR
                  </span>
                </div>
                <ManweGradientText fontSize="clamp(24px, 4vw, 34px)" letterSpacing="0.02em">
                  ₦{subtotal.toLocaleString()}
                </ManweGradientText>
              </div>
            </div>

            {/* Bottom flag strip */}
            <div className="mt-8 flex items-center gap-3">
              <FlagStrip className="w-20 h-0.5" />
              <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">
                NGR × CIV
              </span>
              <FlagStrip className="w-20 h-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}