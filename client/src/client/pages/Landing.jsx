// Landing.jsx — MANWE Video Intro Page
// Smooth cinematic transition to Shop

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const videoUrl =
  "https://res.cloudinary.com/dsci2gspy/video/upload/v1786900448/b1e80867dcc61e90427a41f8c4479245_2_gd7lgs.mp4";

// ─── MANWE Unity Beast Emblem ─────────────────────────────────────────────────

function ManweBeastEmblem({ size = 40, opacity = 1 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      style={{ opacity }}
    >
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
        stroke="#E8E3D8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M40 18 L48 30 L40 42 L32 30 Z"
        stroke="#E8E3D8"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="36" cy="28" r="1.5" fill="#1A5C2A" />
      <circle cx="44" cy="28" r="1.5" fill="#C4541A" />
      <path
        d="M37 18 L40 8 L43 18"
        stroke="#E8E3D8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="40" y1="55" x2="40" y2="70" stroke="#E8E3D8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="#E8E3D8" opacity="0.6" />
      <line x1="12" y1="30" x2="22" y2="25" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.5" />
      <line x1="14" y1="35" x2="24" y2="30" stroke="#1A5C2A" strokeWidth="0.8" opacity="0.4" />
      <line x1="68" y1="30" x2="58" y2="25" stroke="#C4541A" strokeWidth="0.8" opacity="0.5" />
      <line x1="66" y1="35" x2="56" y2="30" stroke="#C4541A" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// ─── MANWE Gradient Text ──────────────────────────────────────────────────────

function ManweGradientText({ fontSize = "clamp(48px, 12vw, 100px)" }) {
  return (
    <span
      className="leading-none text-center block"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing: "0.1em",
        background:
          "linear-gradient(135deg, #1A5C2A 0%, #2D7A3E 20%, #E8E3D8 50%, #D4651F 80%, #C4541A 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 40px rgba(232,227,216,0.15))",
      }}
    >
      MANWE
    </span>
  );
}

// ─── Adinkra Symbol ───────────────────────────────────────────────────────────

function AdinkraDiamond({ size = 10, fill = "#C4541A", opacity = 0.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  );
}

// ─── Flag Strip ───────────────────────────────────────────────────────────────

function FlagStrip({ width = "w-36 lg:w-48" }) {
  return (
    <div className={`${width} flex h-0.5`}>
      <div className="flex flex-1">
        <div className="flex-1 bg-[#1A5C2A]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#1A5C2A]" />
      </div>
      <div className="w-px bg-transparent" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#C4541A]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#1A5C2A]" />
      </div>
    </div>
  );
}

// ─── Background Beast Watermarks ─────────────────────────────────────────────

function BeastWatermarks() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Top corners */}
      <div className="absolute top-8 left-8">
        <ManweBeastEmblem size={50} opacity={0.04} />
      </div>
      <div className="absolute top-8 right-8">
        <ManweBeastEmblem size={50} opacity={0.04} />
      </div>
      {/* Center large watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ManweBeastEmblem size={300} opacity={0.025} />
      </div>
      {/* Bottom corners */}
      <div className="absolute bottom-8 left-8">
        <ManweBeastEmblem size={40} opacity={0.03} />
      </div>
      <div className="absolute bottom-8 right-8">
        <ManweBeastEmblem size={40} opacity={0.03} />
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadePhase, setFadePhase] = useState("none");

  const goToShop = useCallback(() => {
    if (fadePhase !== "none") return;
    setFadePhase("white-in");
    setTimeout(() => setFadePhase("white-hold"), 800);
    setTimeout(() => {
      setFadePhase("done");
      navigate("/shop");
    }, 1400);
  }, [fadePhase, navigate]);

  const handleVideoEnd = () => goToShop();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToShop();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToShop]);

  useEffect(() => {
    if (videoRef.current && isLoaded) {
      videoRef.current.play().catch(() => {});
    }
  }, [isLoaded]);

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      {/* ── Background beast watermarks ── */}
      <BeastWatermarks />

      {/* ── Video Layer ── */}
      <div
        className="absolute inset-0"
        style={{
          opacity: fadePhase === "none" ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          onCanPlay={() => setIsLoaded(true)}
          onEnded={handleVideoEnd}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      {/* ── Content Layer ── */}
      <div
        className="absolute inset-0 z-20 flex flex-col"
        style={{
          opacity: fadePhase === "none" ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      >
        {/* Top — Beast emblem */}
        <div
          className="flex flex-col items-center pt-10 lg:pt-12 gap-3"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s",
          }}
        >
          <ManweBeastEmblem size={52} opacity={0.9} />
        </div>

        <div className="flex-1" />

        {/* Bottom — Text + accents + button */}
        <div
          className="flex flex-col items-center gap-4 pb-14 lg:pb-20 px-6"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1s ease-out 1s, transform 1s ease-out 1s",
          }}
        >
          {/* Small Adinkra symbol above MANWE */}
          <div className="flex items-center gap-2">
            <AdinkraDiamond size={7} fill="#1A5C2A" opacity={0.7} />
            <div className="w-12 h-px bg-[#1A5C2A]/30" />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" opacity="0.4">
              <path d="M7 1 L13 7 L7 13 L1 7 Z" stroke="#E8E3D8" strokeWidth="1" fill="none" />
              <circle cx="7" cy="7" r="2" fill="#E8E3D8" />
            </svg>
            <div className="w-12 h-px bg-[#C4541A]/30" />
            <AdinkraDiamond size={7} fill="#C4541A" opacity={0.7} />
          </div>

          {/* MANWE — gradient */}
          <ManweGradientText />

          {/* Tagline */}
          <p
            className="text-[#E8E3D8]/40 text-center"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(13px, 3vw, 20px)",
              letterSpacing: "0.35em",
            }}
          >
            WEST AFRICAN FUTURISM
          </p>

          {/* Flag strip */}
          <FlagStrip />

          {/* Enter button with corner diamonds */}
          <button
            onClick={goToShop}
            className="group relative flex items-center gap-4 border border-[#E8E3D8]/20 hover:border-[#E8E3D8] hover:bg-[#E8E3D8] px-10 py-3.5 transition-all duration-300 mt-4"
          >
            {/* Corner Adinkra diamonds */}
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
                fontSize: "18px",
                letterSpacing: "0.4em",
              }}
            >
              ENTER
            </span>
            <span className="text-[#C4541A] group-hover:text-[#080808] transition-colors font-mono text-sm">
              →
            </span>
          </button>

          {/* Desktop hint */}
          <p className="hidden lg:block font-mono text-gray-700 text-[8px] tracking-[0.5em] mt-1">
            PRESS ENTER TO SKIP
          </p>
        </div>
      </div>

      {/* ── White Flash Transition Layer ── */}
      <div
        className="absolute inset-0 z-50 pointer-events-none"
        style={{
          backgroundColor: "#E8E3D8",
          opacity:
            fadePhase === "white-in" ||
            fadePhase === "white-hold" ||
            fadePhase === "done"
              ? 1
              : 0,
          transition:
            fadePhase === "white-in"
              ? "opacity 0.8s ease-in"
              : "opacity 0.1s ease-out",
        }}
      >
        {/* MANWE Beast + text during flash */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          style={{
            opacity:
              fadePhase === "white-hold" || fadePhase === "done" ? 1 : 0,
            transition: "opacity 0.4s ease-in 0.2s",
          }}
        >
          <ManweBeastEmblem size={60} opacity={0.6} />
          <p
            className="text-[#080808]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 8vw, 60px)",
              letterSpacing: "0.2em",
            }}
          >
            MANWE
          </p>
          <div className="flex items-center gap-2">
            <AdinkraDiamond size={8} fill="#1A5C2A" opacity={0.5} />
            <div className="w-16 h-px bg-[#1A5C2A]/40" />
            <AdinkraDiamond size={8} fill="#C4541A" opacity={0.5} />
          </div>
        </div>
      </div>

      {/* ── Loading State ── */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-[#080808]">
          {/* Beast spinning loader */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-8">
            <svg
              className="absolute w-20 h-20"
              viewBox="0 0 60 60"
              fill="none"
              style={{ animation: "manwe-landing-spin 5s linear infinite" }}
            >
              <rect x="5" y="5" width="50" height="50" rx="3" stroke="#1A5C2A" strokeWidth="1" opacity="0.4" />
              <circle cx="5" cy="5" r="2" fill="#1A5C2A" opacity="0.5" />
              <circle cx="55" cy="5" r="2" fill="#C4541A" opacity="0.5" />
              <circle cx="5" cy="55" r="2" fill="#C4541A" opacity="0.5" />
              <circle cx="55" cy="55" r="2" fill="#1A5C2A" opacity="0.5" />
            </svg>
            <div
              className="absolute w-10 h-10 border border-[#E8E3D8]/20 rotate-45"
              style={{ animation: "manwe-landing-spin 3s linear infinite reverse" }}
            />
            <ManweBeastEmblem size={24} opacity={0.6} />
          </div>

          <ManweGradientText fontSize="40px" />
        </div>
      )}

      <style>{`
        @keyframes manwe-landing-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}