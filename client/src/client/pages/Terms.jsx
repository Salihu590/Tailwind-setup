import { Link } from "react-router-dom";

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

// ─── Terms sections data ─────────────────────────────────────────────────────

const termsSections = [
  {
    number: "01",
    title: "ORDERS",
    items: [
      "All orders are subject to availability.",
      "We reserve the right to refuse or cancel an order at any time.",
      "Prices and availability are subject to change without notice.",
    ],
  },
  {
    number: "02",
    title: "PAYMENTS",
    items: [
      "Payments must be made through our secure gateways.",
      "You agree to provide current, complete, and accurate billing information.",
      "Failure to provide accurate information may result in cancellation.",
    ],
  },
  {
    number: "03",
    title: "RETURNS",
    items: [
      "Products can be returned within 7 days of delivery.",
      "Items must be unused, in original packaging, and in resale condition.",
      "Shipping costs for returns may apply unless the product is defective.",
    ],
  },
  {
    number: "04",
    title: "LIABILITY",
    items: [
      "We are not responsible for damages caused by misuse of our products.",
      "Our liability is limited to the value of the product purchased.",
      "We do not guarantee uninterrupted access to our website.",
    ],
  },
];

// ─── Terms Page ──────────────────────────────────────────────────────────────

export default function Terms() {
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

      <div className="max-w-4xl mx-auto px-6 relative z-10">

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
              THE FINE PRINT
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
              TERMS & CONDITIONS
            </ManweGradientText>
          </h1>

          <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em] mt-4">
            READ BEFORE YOU RIDE WITH THE TRIBE
          </p>
        </div>

        {/* ── Main content card ── */}
        <div
          className="relative border border-[#D9D2C4] p-6 lg:p-10"
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

          {/* Welcome intro */}
          <div className="mb-10">
            <SectionLabel>WELCOME</SectionLabel>
            <p className="text-[#6B6558] leading-relaxed">
              Welcome to our store. Please read these Terms and Conditions
              carefully before using our website or making any purchases. By
              browsing, ordering, or interacting with MANWE in any way, you
              agree to what's outlined below.
            </p>
          </div>

          {/* ── Terms sections ── */}
          <div className="space-y-10">
            {termsSections.map((section) => (
              <section key={section.number}>
                {/* Section header with number */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-[#D4651F]"
                    style={{
                      fontSize: "13px",
                      letterSpacing: "0.3em",
                    }}
                  >
                    {section.number}
                  </span>
                  <div className="w-6 h-px bg-[#2D5A2E]" />
                  <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
                  <h2
                    className="text-[#1A1A18]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "22px",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {section.title}
                  </h2>
                  <div className="flex-1 h-px bg-[#D9D2C4]" />
                </div>

                {/* Section items */}
                <ul className="space-y-3 pl-2">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[#6B6558] leading-relaxed"
                    >
                      <div className="w-1.5 h-1.5 bg-[#D4651F] rotate-45 mt-2 shrink-0" />
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* ── Agreement notice ── */}
          <div className="mt-12 pt-8 border-t border-[#D9D2C4]">
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <ManweBeastMini size={16} opacity={0.7} />
              </div>
              <p
                className="text-[#2D5A2E] flex-1"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "0.15em",
                  lineHeight: 1.6,
                }}
              >
                BY PROCEEDING WITH YOUR PURCHASE, YOU AGREE TO THESE TERMS AND
                CONDITIONS.
              </p>
            </div>
          </div>

          {/* ── Back to Cart button ── */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cart"
              className="group relative flex items-center justify-center gap-4 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-8 py-4 transition-all duration-300"
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

              <span className="text-[#D4651F] group-hover:text-[#F4EFE6] transition-colors font-mono">
                ←
              </span>
              <span
                className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "16px",
                  letterSpacing: "0.35em",
                }}
              >
                BACK TO CART
              </span>
            </Link>
          </div>

          {/* ── Bottom flag strip ── */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <FlagStrip className="w-20 h-0.5" />
            <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">
              NGR × CIV
            </span>
            <FlagStrip className="w-20 h-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}