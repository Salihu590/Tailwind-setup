// Shop.jsx — MANWE Digital Flagship
// West African Futurism — Nigeria × Côte d'Ivoire

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/product/ProductGrid";
import products from "../data/products";
import {
  FaTiktok,
  FaWhatsapp,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import Header from "../components/navigation/Header";
import NewsletterForm from "../components/NewsletterForm";

// ─── Assets ───────────────────────────────────────────────────────────────────

const logoUrl =
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

const bannerDesktopUrls = [
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1786899609/1786899526745-01a00b81-d161-7ca1-a8a9-d3fc6b100f58_zzmvxk.png",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757856672/WhatsApp_Image_2025-09-14_at_14.29.35_9ec80224_mvhxwm.jpg",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757857336/WhatsApp_Image_2025-09-14_at_14.29.35_9ab37444_v3bgjv.jpg",
];

const bannerMobileUrls = [
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1786899609/1786899526745-01a00b81-d161-7ca1-a8a9-d3fc6b100f58_zzmvxk.png",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757857336/WhatsApp_Image_2025-09-14_at_14.29.35_9ab37444_v3bgjv.jpg",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757856672/WhatsApp_Image_2025-09-14_at_14.29.35_9ec80224_mvhxwm.jpg",
];

const categories = [
  { label: "ALL", value: "New" },
  { label: "TOPS", value: "Tops / Jerseys" },
  { label: "BOTTOMS", value: "Bottoms" },
  { label: "SHORTS", value: "Shorts" },
  { label: "WOMENS", value: "Womens" },
];

const socials = [
  { label: "TIKTOK", href: "https://www.tiktok.com/@mw.civ", icon: <FaTiktok /> },
  { label: "WHATSAPP", href: "https://wa.me/2349162407757", icon: <FaWhatsapp /> },
  { label: "INSTAGRAM", href: "https://www.instagram.com/mw.civ?igsh=MXZlM3JhZXllZXZpcQ==", icon: <FaInstagram /> },
  { label: "X", href: "https://x.com/manwe_jr?t=F7pDcNfp5cdJDEXJd7Y9Lw&s=09", icon: <FaXTwitter /> },
];

// ─── MANWE Unity Beast ────────────────────────────────────────────────────────

function ManweBeastEmblem({ size = 40, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
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
}

function ManweBeastMini({ size = 18, opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }}>
      <path d="M10 2 L14 8 L10 14 L6 8 Z" stroke="#E8E3D8" strokeWidth="1" fill="none" />
      <path d="M3 10 L6 4 L8 8" stroke="#1A5C2A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M17 10 L14 4 L12 8" stroke="#C4541A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M7 12 L8.5 17 L10 13 L11.5 17 L13 12" stroke="#E8E3D8" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="9" cy="7" r="0.7" fill="#1A5C2A" />
      <circle cx="11" cy="7" r="0.7" fill="#C4541A" />
    </svg>
  );
}

// ─── Adinkra / African Symbols ────────────────────────────────────────────────

function AdinkraSymbol({ size = 24, color = "#E8E3D8", opacity = 0.15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
      <circle cx="20" cy="20" r="8" stroke={color} strokeWidth="1.5" />
      <circle cx="20" cy="20" r="3" fill={color} />
      <line x1="20" y1="2" x2="20" y2="12" stroke={color} strokeWidth="1" />
      <line x1="20" y1="28" x2="20" y2="38" stroke={color} strokeWidth="1" />
      <line x1="2" y1="20" x2="12" y2="20" stroke={color} strokeWidth="1" />
      <line x1="28" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function GyeNyameSymbol({ size = 28, color = "#E8E3D8", opacity = 0.12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
      <rect x="10" y="10" width="20" height="20" rx="2" stroke={color} strokeWidth="1.5" />
      <rect x="5" y="5" width="30" height="30" rx="4" stroke={color} strokeWidth="1" />
      <circle cx="20" cy="20" r="4" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="5" x2="20" y2="10" stroke={color} strokeWidth="1" />
      <line x1="20" y1="30" x2="20" y2="35" stroke={color} strokeWidth="1" />
      <line x1="5" y1="20" x2="10" y2="20" stroke={color} strokeWidth="1" />
      <line x1="30" y1="20" x2="35" y2="20" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function NsibidiSymbol({ size = 20, color = "#E8E3D8", opacity = 0.1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }}>
      <path d="M15 5 L25 15 L15 25 L5 15 Z" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="15" cy="15" r="3" fill={color} />
      <line x1="15" y1="5" x2="15" y2="12" stroke={color} strokeWidth="0.8" />
      <line x1="15" y1="18" x2="15" y2="25" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

function AdinkraDiamond({ size = 10, fill = "#C4541A", opacity = 0.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  );
}

// ─── African Pattern Background ───────────────────────────────────────────────

function AfricanPatternBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-10 left-6">
        <AdinkraSymbol size={32} opacity={0.06} />
      </div>
      <div className="absolute top-20 left-20">
        <NsibidiSymbol size={18} opacity={0.05} />
      </div>
      <div className="absolute top-8 right-10">
        <GyeNyameSymbol size={36} opacity={0.05} />
      </div>
      <div className="absolute top-1/3 left-1/4">
        <ManweBeastMini size={28} opacity={0.04} />
      </div>
      <div className="absolute top-1/2 right-1/3">
        <ManweBeastMini size={24} opacity={0.03} />
      </div>
      <div className="absolute bottom-20 left-16">
        <GyeNyameSymbol size={28} opacity={0.05} />
      </div>
      <div className="absolute bottom-10 right-20">
        <NsibidiSymbol size={24} color="#1A5C2A" opacity={0.05} />
      </div>
      <div className="absolute bottom-32 right-8">
        <AdinkraSymbol size={20} color="#C4541A" opacity={0.04} />
      </div>
    </div>
  );
}

// ─── MANWE Gradient Text ──────────────────────────────────────────────────────

function ManweGradientText({
  fontSize = "clamp(80px, 18vw, 200px)",
  className = "",
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing: "-0.01em",
        lineHeight: 1,
        background:
          "linear-gradient(135deg, #1A5C2A 0%, #2D7A3E 20%, #E8E3D8 45%, #E8E3D8 55%, #D4651F 80%, #C4541A 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 60px rgba(232,227,216,0.15))",
      }}
    >
      MANWE
    </span>
  );
}

// ─── MANWE Loader ─────────────────────────────────────────────────────────────

function ManweLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-8 relative">
      <AfricanPatternBg />

      <div className="relative w-24 h-24 flex items-center justify-center z-10">
        <svg
          className="absolute w-24 h-24"
          viewBox="0 0 60 60"
          fill="none"
          style={{ animation: "manwe-spin 5s linear infinite" }}
        >
          <rect x="5" y="5" width="50" height="50" rx="3" stroke="#1A5C2A" strokeWidth="1" opacity="0.4" />
          <circle cx="5" cy="5" r="2" fill="#1A5C2A" opacity="0.5" />
          <circle cx="55" cy="5" r="2" fill="#C4541A" opacity="0.5" />
          <circle cx="5" cy="55" r="2" fill="#C4541A" opacity="0.5" />
          <circle cx="55" cy="55" r="2" fill="#1A5C2A" opacity="0.5" />
        </svg>
        <div
          className="absolute w-12 h-12 border border-[#E8E3D8]/20 rotate-45"
          style={{ animation: "manwe-spin 3s linear infinite reverse" }}
        />
        <ManweBeastEmblem size={28} opacity={0.8} />
      </div>

      <div className="text-center z-10">
        <ManweGradientText fontSize="56px" />
      </div>

      <style>{`
        @keyframes manwe-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── West African Flag Strip ──────────────────────────────────────────────────

function FlagStrip() {
  return (
    <div className="w-full flex h-1">
      <div className="flex flex-1">
        <div className="flex-1 bg-[#1A5C2A]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#1A5C2A]" />
      </div>
      <div className="w-px bg-[#080808]" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#C4541A]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#1A5C2A]" />
      </div>
    </div>
  );
}

// ─── Pattern Divider ──────────────────────────────────────────────────────────

function PatternDivider() {
  return (
    <div className="flex items-center gap-3 my-10">
      <div className="flex-1 h-px bg-gray-800" />
      <div className="flex items-center gap-2">
        <AdinkraDiamond size={6} fill="#1A5C2A" opacity={0.6} />
        <svg width="8" height="8" viewBox="0 0 8 8" className="opacity-40">
          <circle cx="4" cy="4" r="3" stroke="#E8E3D8" strokeWidth="1" fill="none" />
          <circle cx="4" cy="4" r="1" fill="#E8E3D8" />
        </svg>
        <ManweBeastMini size={14} opacity={0.3} />
        <svg width="8" height="8" viewBox="0 0 8 8" className="opacity-40">
          <circle cx="4" cy="4" r="3" stroke="#E8E3D8" strokeWidth="1" fill="none" />
          <circle cx="4" cy="4" r="1" fill="#E8E3D8" />
        </svg>
        <AdinkraDiamond size={6} fill="#C4541A" opacity={0.6} />
      </div>
      <div className="flex-1 h-px bg-gray-800" />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ currentSlide, onShopClick }) {
  return (
    <div className="relative w-full h-screen min-h-[600px] max-h-[1000px] overflow-hidden">
      {/* Desktop images */}
      <div className="hidden lg:block absolute inset-0">
        {bannerDesktopUrls.map((url, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${url})`,
              opacity: index === currentSlide ? 1 : 0,
              transition: "opacity 1.8s ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Mobile images */}
      <div className="lg:hidden absolute inset-0">
        {bannerMobileUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="MANWE"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              transition: "opacity 1.8s ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#080808] to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent z-10" />
      <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-gradient-to-r from-[#080808]/80 to-transparent z-10" />

      {/* Beast + symbols overlay on hero */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={180} opacity={0.05} />
        </div>
        <div className="absolute top-32 right-12 hidden lg:block">
          <AdinkraSymbol size={50} color="#E8E3D8" opacity={0.05} />
        </div>
        <div className="absolute bottom-40 right-20 hidden lg:block">
          <GyeNyameSymbol size={40} color="#C4541A" opacity={0.04} />
        </div>
      </div>

      {/* Slide progress bars */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {bannerDesktopUrls.map((_, index) => (
          <div key={index}>
            <div
              className="h-0.5 transition-all duration-700"
              style={{
                width: index === currentSlide ? "40px" : "16px",
                backgroundColor:
                  index === currentSlide ? "#E8E3D8" : "rgba(232,227,216,0.2)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Hero content — bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 lg:p-16 pb-16">

        <div className="mb-4">
          <ManweBeastEmblem size={32} opacity={0.8} />
        </div>

        <h1 className="leading-none mb-2">
          <ManweGradientText />
        </h1>

        <p
          className="text-[#E8E3D8]/60 mb-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(18px, 4vw, 36px)",
            letterSpacing: "0.2em",
          }}
        >
          WEST AFRICAN FUTURISM
        </p>

        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-px bg-[#1A5C2A]" />
          <AdinkraDiamond size={8} fill="#C4541A" opacity={0.7} />
          <div className="w-8 h-px bg-[#C4541A]" />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" opacity="0.35">
            <circle cx="5" cy="5" r="3" stroke="#E8E3D8" strokeWidth="1" fill="none" />
            <circle cx="5" cy="5" r="1" fill="#E8E3D8" />
          </svg>
          <div className="w-8 h-px bg-[#1A5C2A]" />
        </div>

        <button
          onClick={onShopClick}
          className="group relative flex items-center gap-5 border border-[#E8E3D8]/30 hover:border-[#E8E3D8] px-8 py-4 hover:bg-[#E8E3D8] transition-all duration-300"
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

          <span
            className="text-[#E8E3D8] group-hover:text-[#080808] transition-colors"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              letterSpacing: "0.3em",
            }}
          >
            SHOP NOW
          </span>
          <span className="flex items-center gap-2">
            <AdinkraDiamond size={6} fill="#C4541A" opacity={1} />
            <span className="text-[#C4541A] group-hover:text-[#080808] transition-colors font-mono">
              →
            </span>
          </span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30">
        <FlagStrip />
      </div>
    </div>
  );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

function DesktopSidebar({ selectedCategory, onCategoryChange }) {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-60 p-8 h-screen sticky top-0 border-r border-gray-800/60 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ManweBeastEmblem size={160} opacity={0.025} />
        </div>
        <div className="absolute top-20 right-4">
          <NsibidiSymbol size={16} opacity={0.04} />
        </div>
        <div className="absolute bottom-40 left-4">
          <AdinkraSymbol size={20} opacity={0.03} />
        </div>
      </div>

      <div className="flex flex-col gap-10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img src={logoUrl} alt="MANWE" className="w-10 h-10 object-contain" />
            <ManweBeastMini size={20} opacity={0.7} />
          </div>
          <ManweGradientText fontSize="28px" />
        </div>

        <nav className="flex flex-col gap-1">
          <p className="font-mono text-gray-700 text-[9px] tracking-[0.4em] mb-4 uppercase">
            Shop
          </p>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className="group flex items-center justify-between py-3 border-b border-gray-800/40 text-left transition-all duration-200"
            >
              <span
                className="transition-colors duration-200"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "22px",
                  letterSpacing: "0.15em",
                  color: selectedCategory === cat.value ? "#E8E3D8" : "#4B5563",
                }}
              >
                {cat.label}
              </span>
              {selectedCategory === cat.value && (
                <AdinkraDiamond size={8} fill="#C4541A" opacity={1} />
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-800 pt-6">
          <Link
            to="/contact"
            className="font-mono text-gray-600 text-xs tracking-[0.3em] hover:text-[#E8E3D8] transition-colors"
          >
            CONTACT
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-5 relative z-10">
        <p className="font-mono text-gray-700 text-[9px] tracking-[0.3em] leading-relaxed">
          ABJ — LAGOS
          <br />
          ABIDJAN — 00225
        </p>

        <div className="flex gap-4">
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-gray-600 hover:text-[#E8E3D8] transition-colors text-base"
            >
              {icon}
            </a>
          ))}
        </div>

        <div className="flex gap-1.5 items-center">
          <AdinkraDiamond size={10} fill="#1A5C2A" opacity={1} />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1 L9 5 L5 9 L1 5 Z" stroke="#E8E3D8" strokeWidth="1" fill="none" />
            <circle cx="5" cy="5" r="1.5" fill="#E8E3D8" />
          </svg>
          <AdinkraDiamond size={10} fill="#C4541A" opacity={1} />
        </div>

        <p className="font-mono text-gray-800 text-[9px] tracking-[0.3em]">
          © 2026 MANWE
        </p>
      </div>
    </aside>
  );
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
// NOTE: No X button here — the header's hamburger toggles to X and closes it.

function MobileMenu({ isOpen, onClose, selectedCategory, onCategoryChange }) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 w-full h-full bg-[#080808] z-30 flex flex-col pt-[75px] overflow-y-auto">
      <AfricanPatternBg />

      {/* Large beast watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <ManweBeastEmblem size={280} opacity={0.03} />
      </div>

      <div className="flex flex-col justify-between min-h-full p-8 relative z-10">
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src={logoUrl} alt="MANWE" className="w-10 h-10 object-contain" />
              <ManweBeastMini size={22} opacity={0.8} />
            </div>
            <ManweGradientText fontSize="42px" />
            <p className="font-mono text-[#1A5C2A] text-[9px] tracking-[0.5em] mt-2">
              WEST AFRICAN FUTURISM
            </p>
          </div>

          <nav className="flex flex-col">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  onCategoryChange(cat.value);
                  onClose();
                }}
                className="flex items-center justify-between py-4 border-b border-gray-800/60 text-left"
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "36px",
                    letterSpacing: "0.1em",
                    color: selectedCategory === cat.value ? "#E8E3D8" : "#374151",
                  }}
                >
                  {cat.label}
                </span>
                {selectedCategory === cat.value && (
                  <AdinkraDiamond size={10} fill="#C4541A" opacity={1} />
                )}
              </button>
            ))}

            <div className="pt-4">
              <Link
                to="/contact"
                onClick={onClose}
                className="font-mono text-gray-600 text-sm tracking-[0.3em] hover:text-white transition-colors"
              >
                CONTACT
              </Link>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-5 mt-10">
          <FlagStrip />
          <div className="flex gap-6 mt-2">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-gray-600 hover:text-[#E8E3D8] transition-colors text-xl"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MANWE Footer ─────────────────────────────────────────────────────────────

function ManweFooter() {
  return (
    <footer className="w-full bg-[#080808] border-t border-gray-800/60 px-6 lg:px-16 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-20 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={200} opacity={0.03} />
        </div>
        <div className="absolute top-12 right-16 hidden lg:block">
          <GyeNyameSymbol size={40} opacity={0.04} />
        </div>
        <div className="absolute bottom-16 left-20 hidden lg:block">
          <AdinkraSymbol size={30} color="#1A5C2A" opacity={0.03} />
        </div>
      </div>

      <FlagStrip />

      <div className="max-w-6xl mx-auto pt-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-2">
              <img src={logoUrl} alt="MANWE" className="w-10 h-10 object-contain opacity-90" />
              <ManweBeastEmblem size={32} opacity={0.8} />
            </div>
            <ManweGradientText fontSize="48px" />
            <p className="font-mono text-gray-600 text-[10px] tracking-[0.4em]">
              WEST AFRICAN FUTURISM
            </p>
            <p className="font-mono text-gray-700 text-[10px] tracking-[0.3em]">
              LAGOS / ABUJA / ABIDJAN
            </p>
            <div className="flex gap-2 items-center mt-2">
              <AdinkraDiamond size={12} fill="#1A5C2A" opacity={1} />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1 L11 6 L6 11 L1 6 Z" stroke="#E8E3D8" strokeWidth="1" fill="none" />
                <circle cx="6" cy="6" r="1.5" fill="#E8E3D8" />
              </svg>
              <AdinkraDiamond size={12} fill="#C4541A" opacity={1} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-gray-700 text-[9px] tracking-[0.4em] mb-2">
              NAVIGATE
            </p>
            {["SHOP", "CONTACT"].map((item) => (
              <Link
                key={item}
                to={item === "SHOP" ? "/shop" : "/contact"}
                className="font-mono text-gray-500 text-xs tracking-[0.3em] hover:text-[#E8E3D8] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-gray-700 text-[9px] tracking-[0.4em] mb-2">
              FOLLOW
            </p>
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 font-mono text-gray-500 text-xs tracking-[0.2em] hover:text-[#E8E3D8] transition-colors"
              >
                <span>{icon}</span>
                {label}
              </a>
            ))}
          </div>
        </div>

        <PatternDivider />

        <div className="flex flex-col lg:flex-row justify-between gap-2">
          <p className="font-mono text-gray-700 text-[9px] tracking-[0.3em]">
            © 2026 MANWE — ALL RIGHTS RESERVED
          </p>
          <p className="font-mono text-gray-700 text-[9px] tracking-[0.3em]">
            NGR × CIV
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Shop Page ───────────────────────────────────────────────────────────

export default function Shop() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const productGridRef = useRef(null);

  useEffect(() => {
    if (bannerDesktopUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === bannerDesktopUrls.length - 1 ? 0 : prev + 1
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (value) => {
    setSearchQuery("");
    setSelectedCategory(value);
  };

  const scrollToGrid = () => {
    productGridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory.toLowerCase() === "new" ||
      p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#080808", color: "#E8E3D8" }}
    >
      <Header
        toggleMenu={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
        toggleSearch={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
        menuOpen={menuOpen}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <HeroSection currentSlide={currentSlide} onShopClick={scrollToGrid} />

      <div className="flex flex-1">
        <DesktopSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <MobileMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <main
          ref={productGridRef}
          className="flex-1 w-full px-6 py-12 lg:px-10 lg:py-12 relative"
          id="product-grid"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10">
              <NsibidiSymbol size={20} opacity={0.03} />
            </div>
            <div className="absolute bottom-32 left-8">
              <AdinkraSymbol size={24} color="#1A5C2A" opacity={0.02} />
            </div>
            <div className="absolute top-1/2 right-1/4">
              <ManweBeastEmblem size={80} opacity={0.02} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-end gap-3">
              <ManweBeastMini size={18} opacity={0.5} />
              <h2
                className="text-[#E8E3D8]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(36px, 6vw, 64px)",
                  letterSpacing: "0.1em",
                  lineHeight: 1,
                }}
              >
                {categories.find((c) => c.value === selectedCategory)?.label || "ALL"}
              </h2>
            </div>

            {!isLoading && (
              <p className="font-mono text-gray-600 text-[10px] tracking-[0.3em]">
                {filteredProducts.length} PIECE{filteredProducts.length !== 1 ? "S" : ""}
              </p>
            )}
          </div>

          <PatternDivider />

          <div className="relative z-10">
            {isLoading ? (
              <ManweLoader />
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-6">
                <ManweBeastEmblem size={48} opacity={0.3} />
                <p
                  className="text-gray-600"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "24px",
                    letterSpacing: "0.3em",
                  }}
                >
                  NO PIECES FOUND
                </p>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </main>
      </div>

      <NewsletterForm />
      <ManweFooter />
    </div>
  );
}