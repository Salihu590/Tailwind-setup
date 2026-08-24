// Shop.jsx — MANWE Digital Flagship (Production)
// West African Futurism — Nigeria × Côte d'Ivoire

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

const LOGO_URL =
  "https://res.cloudinary.com/dsci2gspy/image/upload/f_auto,q_auto,w_80/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

const cldOptimize = (url, w = 1920) =>
  url.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`);

const BANNER_DESKTOP = [
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1786899609/1786899526745-01a00b81-d161-7ca1-a8a9-d3fc6b100f58_zzmvxk.png",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757856672/WhatsApp_Image_2025-09-14_at_14.29.35_9ec80224_mvhxwm.jpg",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757857336/WhatsApp_Image_2025-09-14_at_14.29.35_9ab37444_v3bgjv.jpg",
].map((u) => cldOptimize(u, 1920));

const BANNER_MOBILE = [
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1786899609/1786899526745-01a00b81-d161-7ca1-a8a9-d3fc6b100f58_zzmvxk.png",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757857336/WhatsApp_Image_2025-09-14_at_14.29.35_9ab37444_v3bgjv.jpg",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757856672/WhatsApp_Image_2025-09-14_at_14.29.35_9ec80224_mvhxwm.jpg",
].map((u) => cldOptimize(u, 900));

const CATEGORIES = Object.freeze([
  { label: "ALL", value: "New" },
  { label: "TOPS", value: "Tops / Jerseys" },
  { label: "BOTTOMS", value: "Bottoms" },
  { label: "SHORTS", value: "Shorts" },
  { label: "WOMENS", value: "Womens" },
]);

const SOCIALS = Object.freeze([
  { label: "TikTok", href: "https://www.tiktok.com/@mw.civ", Icon: FaTiktok },
  { label: "WhatsApp", href: "https://wa.me/2349162407757", Icon: FaWhatsapp },
  { label: "Instagram", href: "https://www.instagram.com/mw.civ", Icon: FaInstagram },
  { label: "X (Twitter)", href: "https://x.com/manwe_jr", Icon: FaXTwitter },
]);

const SITE_URL = "https://manweofficial.com.ng";

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

const AdinkraSymbol = memo(function AdinkraSymbol({ size = 24, color = "#E8E3D8", opacity = 0.15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="8" stroke={color} strokeWidth="1.5" />
      <circle cx="20" cy="20" r="3" fill={color} />
      <line x1="20" y1="2" x2="20" y2="12" stroke={color} strokeWidth="1" />
      <line x1="20" y1="28" x2="20" y2="38" stroke={color} strokeWidth="1" />
      <line x1="2" y1="20" x2="12" y2="20" stroke={color} strokeWidth="1" />
      <line x1="28" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1" />
    </svg>
  );
});

const GyeNyameSymbol = memo(function GyeNyameSymbol({ size = 28, color = "#E8E3D8", opacity = 0.12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }} aria-hidden="true" focusable="false">
      <rect x="10" y="10" width="20" height="20" rx="2" stroke={color} strokeWidth="1.5" />
      <rect x="5" y="5" width="30" height="30" rx="4" stroke={color} strokeWidth="1" />
      <circle cx="20" cy="20" r="4" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="5" x2="20" y2="10" stroke={color} strokeWidth="1" />
      <line x1="20" y1="30" x2="20" y2="35" stroke={color} strokeWidth="1" />
      <line x1="5" y1="20" x2="10" y2="20" stroke={color} strokeWidth="1" />
      <line x1="30" y1="20" x2="35" y2="20" stroke={color} strokeWidth="1" />
    </svg>
  );
});

const NsibidiSymbol = memo(function NsibidiSymbol({ size = 20, color = "#E8E3D8", opacity = 0.1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }} aria-hidden="true" focusable="false">
      <path d="M15 5 L25 15 L15 25 L5 15 Z" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="15" cy="15" r="3" fill={color} />
      <line x1="15" y1="5" x2="15" y2="12" stroke={color} strokeWidth="0.8" />
      <line x1="15" y1="18" x2="15" y2="25" stroke={color} strokeWidth="0.8" />
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

// ─── African Pattern Background ───────────────────────────────────────────────

const AfricanPatternBg = memo(function AfricanPatternBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div className="absolute top-10 left-6"><AdinkraSymbol size={32} opacity={0.06} /></div>
      <div className="absolute top-20 left-20"><NsibidiSymbol size={18} opacity={0.05} /></div>
      <div className="absolute top-8 right-10"><GyeNyameSymbol size={36} opacity={0.05} /></div>
      <div className="absolute top-1/3 left-1/4"><ManweBeastMini size={28} opacity={0.04} /></div>
      <div className="absolute top-1/2 right-1/3"><ManweBeastMini size={24} opacity={0.03} /></div>
      <div className="absolute bottom-20 left-16"><GyeNyameSymbol size={28} opacity={0.05} /></div>
      <div className="absolute bottom-10 right-20"><NsibidiSymbol size={24} color="#1A5C2A" opacity={0.05} /></div>
      <div className="absolute bottom-32 right-8"><AdinkraSymbol size={20} color="#C4541A" opacity={0.04} /></div>
    </div>
  );
});

// ─── MANWE Gradient Text ──────────────────────────────────────────────────────

const ManweGradientText = memo(function ManweGradientText({
  fontSize = "clamp(80px, 18vw, 200px)",
  className = "",
  as: Tag = "span",
}) {
  return (
    <Tag
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
    </Tag>
  );
});

// ─── West African Flag Strip ──────────────────────────────────────────────────

const FlagStrip = memo(function FlagStrip() {
  return (
    <div className="w-full flex h-1" aria-hidden="true">
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
});

// ─── Pattern Divider ──────────────────────────────────────────────────────────

const PatternDivider = memo(function PatternDivider() {
  return (
    <div className="flex items-center gap-3 my-10" aria-hidden="true">
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
});

// ─── MANWE Freight & Customs Ticker ───────────────────────────────────────────

const LogisticsTicker = memo(function LogisticsTicker() {
  return (
    <div
      className="manwe-freight group w-full py-4 border-y border-white/10 bg-[#080808] relative overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232, 227, 216, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 227, 216, 0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Scanner Laser */}
      <div className="manwe-laser absolute top-0 bottom-0 w-[2px] bg-[#C4541A] z-20 opacity-0 group-hover:opacity-100" />

      {/* Scrolling Content */}
      <div className="flex manwe-marquee-fast group-hover:[animation-play-state:paused] relative z-10 whitespace-nowrap">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-10 shrink-0">
            <span className="font-mono text-[10px] text-gray-500 tracking-[0.2em] group-hover:text-[#E8E3D8] transition-colors duration-500">
              WAYBILL: MW-8472-X
            </span>

            <AdinkraDiamond size={6} fill="#1A5C2A" opacity={0.5} />

            <span className="font-mono text-[10px] text-[#E8E3D8]/70 tracking-[0.2em] group-hover:text-[#C4541A] transition-colors duration-500">
              ROUTE: LOS (6.52°N) ✈ ABJ (5.35°N)
            </span>

            <AdinkraDiamond size={6} fill="#C4541A" opacity={0.5} />

            <span
              className="manwe-barcode-bars text-gray-600 font-bold"
              style={{ fontFamily: "monospace", fontSize: "16px", letterSpacing: "-1.5px" }}
            >
              ||| || | |||| || | || |||| | ||
            </span>

            <AdinkraDiamond size={6} fill="#1A5C2A" opacity={0.5} />

            {/* Slot machine text flip */}
            <span className="font-mono text-[10px] tracking-[0.2em] relative overflow-hidden inline-flex h-[14px] w-[160px]">
              <span className="absolute inset-0 flex items-center text-gray-500 transition-transform duration-300 group-hover:-translate-y-full">
                STATUS: IN-TRANSIT
              </span>
              <span className="absolute inset-0 flex items-center text-[#7dcea0] font-bold transition-transform duration-300 translate-y-full group-hover:translate-y-0 manwe-text-glow-green">
                BORDER CLEARED //
              </span>
            </span>

            <AdinkraDiamond size={6} fill="#C4541A" opacity={0.5} />

            <span className="font-mono text-[10px] text-gray-500 tracking-[0.2em] group-hover:text-[#E8E3D8] transition-colors duration-500">
              CARGO: MANWE // FW26 DROP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HeroSection = memo(function HeroSection({ currentSlide, onShopClick }) {
  return (
    <section
      className="relative w-full h-screen min-h-[600px] max-h-[1000px] overflow-hidden"
      aria-label="MANWE hero"
    >
      <div className="hidden lg:block absolute inset-0" aria-hidden="true">
        {BANNER_DESKTOP.map((url, index) => (
          <div
            key={url}
            className="absolute inset-0 bg-cover bg-center motion-safe:transition-opacity motion-safe:duration-[1800ms] motion-safe:ease-in-out"
            style={{ backgroundImage: `url(${url})`, opacity: index === currentSlide ? 1 : 0 }}
            role="img"
            aria-label={`MANWE campaign image ${index + 1}`}
          />
        ))}
      </div>

      <div className="lg:hidden absolute inset-0">
        {BANNER_MOBILE.map((url, index) => (
          <img
            key={url}
            src={url}
            alt={index === 0 ? "MANWE — West African Futurism streetwear" : ""}
            className="absolute inset-0 w-full h-full object-cover object-center motion-safe:transition-opacity motion-safe:duration-[1800ms] motion-safe:ease-in-out"
            style={{ opacity: index === currentSlide ? 1 : 0 }}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            width="900"
            height="1600"
          />
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#080808] to-transparent z-10" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent z-10" aria-hidden="true" />
      <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-gradient-to-r from-[#080808]/80 to-transparent z-10" aria-hidden="true" />

      <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
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

      <div
        className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-3 z-20"
        role="tablist"
        aria-label="Hero image progress"
      >
        {BANNER_DESKTOP.map((_, index) => (
          <div
            key={index}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Slide ${index + 1} of ${BANNER_DESKTOP.length}`}
            className="h-0.5 motion-safe:transition-all motion-safe:duration-700"
            style={{
              width: index === currentSlide ? "40px" : "16px",
              backgroundColor: index === currentSlide ? "#E8E3D8" : "rgba(232,227,216,0.2)",
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 lg:p-16 pb-16">
        <div className="mb-4 animate-bounce"><ManweBeastEmblem size={32} opacity={0.8} /></div>

        <h1 className="leading-none mb-2 manwe-drop">
          <ManweGradientText className="manwe-glitch" data-text="MANWE" />
          <span className="sr-only">MANWE — West African Futurism</span>
        </h1>

        <p
          className="text-[#E8E3D8]/60 mb-2 manwe-tape"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(18px, 4vw, 36px)", letterSpacing: "0.2em" }}
        >
          WEST AFRICAN FUTURISM
        </p>

        <div className="flex items-center gap-2 mb-8" aria-hidden="true">
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
          type="button"
          onClick={onShopClick}
          className="group relative flex items-center gap-5 border border-[#E8E3D8]/30 hover:border-[#E8E3D8] focus-visible:border-[#E8E3D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A] px-8 py-4 hover:bg-[#E8E3D8] transition-all duration-300 manwe-shake-hover"
          aria-label="Scroll to product catalog"
        >
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={0.6} /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={0.6} /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#C4541A" opacity={0.6} /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#1A5C2A" opacity={0.6} /></span>

          <span
            className="text-[#E8E3D8] group-hover:text-[#080808] transition-colors"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "0.3em" }}
          >
            SHOP NOW
          </span>
          <span className="flex items-center gap-2" aria-hidden="true">
            <AdinkraDiamond size={6} fill="#C4541A" opacity={1} />
            <span className="text-[#C4541A] group-hover:text-[#080808] transition-colors font-mono">→</span>
          </span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30"><FlagStrip /></div>
    </section>
  );
});

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

const DesktopSidebar = memo(function DesktopSidebar({ selectedCategory, onCategoryChange }) {
  return (
    <aside
      className="hidden lg:flex flex-col justify-between w-60 p-8 h-screen sticky top-0 border-r border-gray-800/60 bg-[#0a0a0a] relative overflow-hidden"
      aria-label="Shop navigation"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ManweBeastEmblem size={160} opacity={0.025} />
        </div>
        <div className="absolute top-20 right-4"><NsibidiSymbol size={16} opacity={0.04} /></div>
        <div className="absolute bottom-40 left-4"><AdinkraSymbol size={20} opacity={0.03} /></div>
      </div>

      <div className="flex flex-col gap-10 relative z-10">
        <Link to="/" aria-label="MANWE home" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={LOGO_URL}
              alt="MANWE logo"
              className="w-10 h-10 object-contain"
              width="40"
              height="40"
              loading="eager"
              decoding="async"
            />
            <ManweBeastMini size={20} opacity={0.7} />
          </div>
          <ManweGradientText fontSize="28px" />
        </Link>

        <nav className="flex flex-col gap-1" aria-label="Categories">
          <p className="font-mono text-gray-700 text-[9px] tracking-[0.4em] mb-4 uppercase">Shop</p>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onCategoryChange(cat.value)}
                aria-pressed={isActive}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-between py-3 border-b border-gray-800/40 text-left transition-all duration-200 focus-visible:outline-none focus-visible:bg-white/5"
              >
                <span
                  className="manwe-link transition-colors duration-200"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "22px",
                    letterSpacing: "0.15em",
                    color: isActive ? "#E8E3D8" : "#4B5563",
                  }}
                >
                  {cat.label}
                </span>
                {isActive && <AdinkraDiamond size={8} fill="#C4541A" opacity={1} />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-800 pt-6">
          <Link
            to="/contact"
            className="manwe-link font-mono text-gray-600 text-xs tracking-[0.3em] hover:text-[#E8E3D8] transition-colors focus-visible:outline-none focus-visible:text-[#E8E3D8]"
          >
            CONTACT
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-5 relative z-10">
        <address className="not-italic font-mono text-gray-700 text-[9px] tracking-[0.3em] leading-relaxed">
          ABJ — LAGOS<br />ABIDJAN — 00225
        </address>

        <div className="flex gap-4">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} (opens in new tab)`}
              className="text-gray-600 hover:text-[#E8E3D8] transition-colors text-base focus-visible:outline-none focus-visible:text-[#E8E3D8]"
            >
              <Icon aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className="font-mono text-gray-800 text-[9px] tracking-[0.3em]">© {new Date().getFullYear()} MANWE</p>
      </div>
    </aside>
  );
});

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

function MobileMenu({ isOpen, onClose, selectedCategory, onCategoryChange }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    menuRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      className="lg:hidden fixed inset-0 w-full h-full bg-[#080808] z-30 flex flex-col pt-[75px] overflow-y-auto focus:outline-none"
    >
      <AfricanPatternBg />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" aria-hidden="true">
        <ManweBeastEmblem size={280} opacity={0.03} />
      </div>

      <div className="flex flex-col justify-between min-h-full p-8 relative z-10">
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={LOGO_URL}
                alt="MANWE logo"
                className="w-10 h-10 object-contain animate-pulse"
                width="40"
                height="40"
                loading="eager"
                decoding="async"
              />
              <ManweBeastMini size={22} opacity={0.8} />
            </div>
            <ManweGradientText fontSize="42px" className="manwe-glitch" data-text="MANWE" />
            <p className="font-mono text-[#1A5C2A] text-[9px] tracking-[0.5em] mt-2">
              WEST AFRICAN FUTURISM
            </p>
          </div>

          <nav className="flex flex-col" aria-label="Mobile categories">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    onCategoryChange(cat.value);
                    onClose();
                  }}
                  aria-pressed={isActive}
                  className="flex items-center justify-between py-4 border-b border-gray-800/60 text-left focus-visible:outline-none focus-visible:bg-white/5"
                >
                  <span
                    className="manwe-link"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "36px",
                      letterSpacing: "0.1em",
                      color: isActive ? "#E8E3D8" : "#374151",
                    }}
                  >
                    {cat.label}
                  </span>
                  {isActive && <AdinkraDiamond size={10} fill="#C4541A" opacity={1} />}
                </button>
              );
            })}

            <div className="pt-4">
              <Link
                to="/contact"
                onClick={onClose}
                className="manwe-link font-mono text-gray-600 text-sm tracking-[0.3em] hover:text-white transition-colors"
              >
                CONTACT
              </Link>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-5 mt-10">
          <FlagStrip />
          <div className="flex gap-6 mt-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in new tab)`}
                className="text-gray-600 hover:text-[#E8E3D8] transition-colors text-xl"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MANWE Footer ─────────────────────────────────────────────────────────────

const ManweFooter = memo(function ManweFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#080808] border-t border-gray-800/60 px-6 lg:px-16 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 right-20 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={200} opacity={0.03} />
        </div>
        <div className="absolute top-12 right-16 hidden lg:block"><GyeNyameSymbol size={40} opacity={0.04} /></div>
        <div className="absolute bottom-16 left-20 hidden lg:block"><AdinkraSymbol size={30} color="#1A5C2A" opacity={0.03} /></div>
      </div>

      <FlagStrip />

      <div className="max-w-6xl mx-auto pt-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-2">
              <img src={LOGO_URL} alt="MANWE logo" className="w-10 h-10 object-contain opacity-90" width="40" height="40" loading="lazy" decoding="async" />
              <ManweBeastEmblem size={32} opacity={0.8} />
            </div>
            <ManweGradientText fontSize="48px" />
            <p className="font-mono text-gray-600 text-[10px] tracking-[0.4em]">WEST AFRICAN FUTURISM</p>
            <p className="font-mono text-gray-700 text-[10px] tracking-[0.3em]">LAGOS / ABUJA / ABIDJAN</p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-col gap-3">
            <p className="font-mono text-gray-700 text-[9px] tracking-[0.4em] mb-2">NAVIGATE</p>
            {[
              { label: "SHOP", to: "/shop" },
              { label: "CONTACT", to: "/contact" },
              { label: "TERMS", to: "/terms" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="manwe-link font-mono text-gray-500 text-xs tracking-[0.3em] hover:text-[#E8E3D8] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Social media" className="flex flex-col gap-3">
            <p className="font-mono text-gray-700 text-[9px] tracking-[0.4em] mb-2">FOLLOW</p>
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in new tab)`}
                className="flex items-center gap-3 font-mono text-gray-500 text-xs tracking-[0.2em] hover:text-[#E8E3D8] transition-colors"
              >
                <Icon aria-hidden="true" />
                {label.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>

        <PatternDivider />

        <div className="flex flex-col lg:flex-row justify-between gap-2">
          <p className="font-mono text-gray-700 text-[9px] tracking-[0.3em]">
            © {year} MANWE — ALL RIGHTS RESERVED
          </p>
          <p className="font-mono text-gray-700 text-[9px] tracking-[0.3em]">NGR × CIV</p>
        </div>
      </div>
    </footer>
  );
});

// ─── Debounce hook ────────────────────────────────────────────────────────────

function useDebounced(value, delay = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
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

  const debouncedSearch = useDebounced(searchQuery, 200);

  useEffect(() => {
    if (BANNER_DESKTOP.length <= 1) return;

    let interval;
    const start = () => {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % BANNER_DESKTOP.length);
      }, 6000);
    };
    const stop = () => clearInterval(interval);

    start();

    const onVisibility = () => {
      if (document.hidden) stop();
      else { stop(); start(); }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [selectedCategory, debouncedSearch]);

  const handleCategoryChange = useCallback((value) => {
    setSearchQuery("");
    setSelectedCategory(value);
  }, []);

  const scrollToGrid = useCallback(() => {
    productGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const filteredProducts = useMemo(() => {
    const cat = selectedCategory.trim().toLowerCase();
    const q = debouncedSearch.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = cat === "new" || p.category.trim().toLowerCase() === cat;
      const matchesSearch = !q || p.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, debouncedSearch]);

  const activeCategoryLabel =
    CATEGORIES.find((c) => c.value === selectedCategory)?.label || "ALL";

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Store",
      name: "MANWE",
      url: SITE_URL,
      logo: LOGO_URL,
      image: BANNER_DESKTOP[0],
      description:
        "MANWE — West African Futurism. Streetwear crafted between Lagos, Abuja and Abidjan.",
      areaServed: ["NG", "CI"],
      sameAs: SOCIALS.map((s) => s.href),
    }),
    []
  );

  return (
    <>
      <Helmet>
        <title>MANWE — West African Futurism | Streetwear from Lagos × Abidjan</title>
        <meta
          name="description"
          content="MANWE — Bold West African streetwear. Shop tops, bottoms, shorts and womenswear. Crafted between Nigeria and Côte d'Ivoire."
        />
        <link rel="canonical" href={`${SITE_URL}/shop`} />
        <meta name="theme-color" content="#080808" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MANWE" />
        <meta property="og:title" content="MANWE — West African Futurism" />
        <meta property="og:description" content="Bold West African streetwear crafted between Lagos, Abuja and Abidjan." />
        <meta property="og:image" content={BANNER_DESKTOP[0]} />
        <meta property="og:url" content={`${SITE_URL}/shop`} />
        <meta property="og:locale" content="en_NG" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MANWE — West African Futurism" />
        <meta name="twitter:description" content="Bold West African streetwear crafted between Lagos, Abuja and Abidjan." />
        <meta name="twitter:image" content={BANNER_DESKTOP[0]} />

        <link rel="preload" as="image" href={BANNER_DESKTOP[0]} media="(min-width: 1024px)" />
        <link rel="preload" as="image" href={BANNER_MOBILE[0]} media="(max-width: 1023px)" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />

        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <a
        href="#product-grid"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#E8E3D8] focus:text-[#080808] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.3em]"
      >
        SKIP TO PRODUCTS
      </a>

      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#080808", color: "#E8E3D8" }}>
        <Header
          toggleMenu={() => { setMenuOpen((v) => !v); setSearchOpen(false); }}
          toggleSearch={() => { setSearchOpen((v) => !v); setMenuOpen(false); }}
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
            id="product-grid"
            className="flex-1 w-full px-6 py-12 lg:px-10 lg:py-12 relative"
            aria-label="Product catalog"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="absolute top-20 right-10"><NsibidiSymbol size={20} opacity={0.03} /></div>
              <div className="absolute bottom-32 left-8"><AdinkraSymbol size={24} color="#1A5C2A" opacity={0.02} /></div>
              <div className="absolute top-1/2 right-1/4"><ManweBeastEmblem size={80} opacity={0.02} /></div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 relative z-10">
              <div className="flex items-end gap-3">
                <ManweBeastMini size={18} opacity={0.5} />
                <h2
                  className="text-[#E8E3D8] manwe-tape"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(36px, 6vw, 64px)",
                    letterSpacing: "0.1em",
                    lineHeight: 1,
                  }}
                >
                  {activeCategoryLabel}
                </h2>
              </div>

              {!isLoading && (
                <p className="font-mono text-gray-600 text-[10px] tracking-[0.3em]" aria-live="polite">
                  {filteredProducts.length} PIECE{filteredProducts.length !== 1 ? "S" : ""}
                </p>
              )}
            </div>

            <PatternDivider />

            {/* ProductGrid owns loading state via Skeleton */}
            <div className="relative z-10">
              <ProductGrid
                products={filteredProducts}
                isLoading={isLoading}
                onClearSearch={debouncedSearch ? () => setSearchQuery("") : undefined}
              />
            </div>
          </main>
        </div>

        {/* Freight & Customs Ticker sits between shop grid and newsletter */}
        <LogisticsTicker />

        <section className="manwe-noise">
          <NewsletterForm />
        </section>
        <ManweFooter />
      </div>
    </>
  );
}