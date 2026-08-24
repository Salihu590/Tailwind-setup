// Terms.jsx — MANWE Terms & Conditions (Production)
import { memo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://manweofficial.com.ng";

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
      <span
        className="text-[#1A5C2A]"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D9D2C4]" />
    </div>
  );
});

// ─── Terms data ───────────────────────────────────────────────────────────────

const termsSections = Object.freeze([
  {
    number: "01",
    id: "orders",
    title: "ORDERS",
    items: [
      "All orders are subject to availability and confirmation of the order price.",
      "MANWE reserves the right to refuse or cancel any order at any time for reasons including product availability, errors in pricing or product information, or suspected fraud.",
      "Prices, promotions, and availability are subject to change without prior notice.",
      "An order confirmation email does not constitute acceptance until payment is successfully verified.",
    ],
  },
  {
    number: "02",
    id: "payments",
    title: "PAYMENTS",
    items: [
      "Payments must be completed through our approved secure payment gateways only.",
      "You agree to provide current, complete, and accurate billing and contact information.",
      "Failure to provide accurate information may result in order delay or cancellation.",
      "MANWE does not store full card details on our servers. Payment data is handled by certified third-party processors.",
      "All prices are listed in Nigerian Naira (NGN) unless otherwise stated.",
    ],
  },
  {
    number: "03",
    id: "shipping",
    title: "SHIPPING & DELIVERY",
    items: [
      "Standard delivery timelines are estimates and may vary by location (Lagos, Abuja, Abidjan, and other regions).",
      "Risk of loss passes to you upon delivery to the address provided at checkout.",
      "You are responsible for providing a complete and accessible delivery address and reachable phone number.",
      "Delays caused by incorrect address details, unavailability of the recipient, or force majeure events are not the responsibility of MANWE.",
    ],
  },
  {
    number: "04",
    id: "returns",
    title: "RETURNS & EXCHANGES",
    items: [
      "Eligible products may be returned within 7 days of delivery.",
      "Items must be unused, unworn, unwashed, in original packaging, and in resale condition with all tags attached.",
      "Defective or incorrect items will be replaced or refunded at MANWE's discretion after verification.",
      "Return shipping costs may apply unless the product is defective or an error was made by MANWE.",
      "Sale, final-sale, or limited drop items may be excluded from returns unless required by applicable law.",
    ],
  },
  {
    number: "05",
    id: "liability",
    title: "LIABILITY",
    items: [
      "MANWE is not responsible for damages caused by misuse, improper care, or unauthorized modification of products.",
      "To the fullest extent permitted by law, our total liability related to any purchase is limited to the amount paid for that product.",
      "We do not guarantee uninterrupted, error-free, or continuous access to the website or digital services.",
      "Nothing in these terms excludes liability that cannot be excluded under applicable Nigerian or Ivorian consumer protection law.",
    ],
  },
  {
    number: "06",
    id: "ip",
    title: "INTELLECTUAL PROPERTY",
    items: [
      "All MANWE branding, logos, product designs, imagery, copy, and site content are the property of MANWE or its licensors.",
      "You may not copy, reproduce, distribute, or commercially exploit any MANWE content without prior written consent.",
      "Unauthorized use of MANWE intellectual property may result in legal action.",
    ],
  },
  {
    number: "07",
    id: "privacy",
    title: "PRIVACY",
    items: [
      "We collect and process personal data necessary to fulfill orders, provide support, and improve our services.",
      "By using this site, you consent to the processing of your information for order fulfillment and related communications.",
      "We do not sell your personal data to third parties.",
      "For privacy-related requests, contact us via the channels listed on our Contact page.",
    ],
  },
  {
    number: "08",
    id: "changes",
    title: "CHANGES TO TERMS",
    items: [
      "MANWE may update these Terms & Conditions at any time.",
      "Updated terms become effective when published on this page.",
      "Continued use of the website or placement of orders after updates constitutes acceptance of the revised terms.",
    ],
  },
]);

// ─── Terms Page ───────────────────────────────────────────────────────────────

export default function Terms() {
  const lastUpdated = "August 2026";

  return (
    <>
      <Helmet>
        <title>Terms & Conditions — MANWE</title>
        <meta
          name="description"
          content="MANWE Terms & Conditions — orders, payments, shipping, returns, and liability for West African Futurism streetwear."
        />
        <link rel="canonical" href={`${SITE_URL}/terms`} />
        <meta name="robots" content="index,follow" />
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
            <ManweBeastMini size={36} opacity={0.15} />
          </div>
          <div className="absolute bottom-32 left-10 hidden lg:block">
            <ManweBeastMini size={36} opacity={0.15} />
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
                THE FINE PRINT
              </span>
              <AdinkraDiamond size={7} fill="#C4541A" opacity={1} />
              <div className="w-10 h-px bg-[#C4541A]" />
            </div>

            <h1 className="text-center leading-none">
              <ManweGradientText fontSize="clamp(36px, 8vw, 68px)" letterSpacing="0.05em">
                TERMS & CONDITIONS
              </ManweGradientText>
            </h1>

            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.4em] mt-4 text-center">
              READ BEFORE YOU RIDE WITH THE TRIBE
            </p>
            <p className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.3em] mt-2">
              LAST UPDATED · {lastUpdated.toUpperCase()}
            </p>
          </header>

          {/* Jump nav */}
          <nav
            aria-label="Terms sections"
            className="mb-8 flex flex-wrap justify-center gap-2"
          >
            {termsSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="font-mono text-[9px] tracking-[0.25em] text-[#8B8577] hover:text-[#1A5C2A] border border-[#D9D2C4] hover:border-[#1A5C2A]/40 px-3 py-1.5 transition-colors"
              >
                {s.number} {s.title}
              </a>
            ))}
          </nav>

          {/* Main card */}
          <article
            className="relative border border-[#D9D2C4] p-6 lg:p-10"
            style={{ backgroundColor: "#FDFAF3" }}
          >
            <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
            <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
            <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
            <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>

            <div className="mb-10">
              <SectionLabel>WELCOME</SectionLabel>
              <p className="text-[#6B6558] leading-relaxed text-[15px]">
                Welcome to MANWE. Please read these Terms and Conditions carefully before using our website
                or making any purchases. By browsing, ordering, or interacting with MANWE in any way, you
                agree to what is outlined below. If you do not agree, do not use this site or place an order.
              </p>
            </div>

            <div className="space-y-10">
              {termsSections.map((section) => (
                <section key={section.number} id={section.id} className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[#C4541A] text-[13px] tracking-[0.3em]">
                      {section.number}
                    </span>
                    <div className="w-6 h-px bg-[#1A5C2A]" aria-hidden="true" />
                    <AdinkraDiamond size={6} fill="#C4541A" opacity={1} />
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
                    <div className="flex-1 h-px bg-[#D9D2C4]" aria-hidden="true" />
                  </div>

                  <ul className="space-y-3 pl-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#6B6558] leading-relaxed text-[15px]">
                        <span className="w-1.5 h-1.5 bg-[#C4541A] rotate-45 mt-2.5 shrink-0" aria-hidden="true" />
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {/* Agreement */}
            <div className="mt-12 pt-8 border-t border-[#D9D2C4]">
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <ManweBeastMini size={16} opacity={0.7} />
                </div>
                <p
                  className="text-[#1A5C2A] flex-1"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.12em",
                    lineHeight: 1.6,
                  }}
                >
                  BY PROCEEDING WITH YOUR PURCHASE OR CONTINUING TO USE THIS SITE, YOU AGREE TO THESE TERMS AND CONDITIONS.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="group relative flex items-center justify-center gap-4 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-8 py-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]"
              >
                <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>
                <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={1} /></span>
                <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={1} /></span>

                <span className="text-[#C4541A] group-hover:text-[#F4EFE6] transition-colors font-mono">←</span>
                <span
                  className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "0.3em" }}
                >
                  BACK TO SHOP
                </span>
              </Link>

              <Link
                to="/contact"
                className="flex items-center justify-center font-mono text-[10px] tracking-[0.3em] text-[#8B8577] hover:text-[#1A1A18] transition-colors px-4 py-3"
              >
                QUESTIONS? CONTACT →
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3">
              <FlagStrip className="w-20 h-0.5" />
              <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
              <FlagStrip className="w-20 h-0.5" />
            </div>
          </article>
        </div>
      </div>
    </>
  );
}