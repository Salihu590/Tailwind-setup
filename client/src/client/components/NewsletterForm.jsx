// NewsletterForm.jsx — MANWE (Production, Hardened)
import { useState, useRef, useEffect, memo } from "react";
import DOMPurify from "dompurify";
import { supabase } from "../../lib/supabase";

// ─── Security Helpers ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LEN = 120;
const RATE_LIMIT_MS = 30_000; // 30 seconds
const HUMAN_MIN_MS = 2_000; // 2 seconds

const clean = (raw) =>
  DOMPurify.sanitize(String(raw ?? "").slice(0, MAX_EMAIL_LEN), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim().toLowerCase();

// ─── SVGs ────────────────────────────────────────────────────────────────────

const ManweSerpentM = memo(function ManweSerpentM({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M25 20 Q20 15 25 12 Q32 10 35 18 L35 40 L30 45 L20 50 L28 60 L25 75 Q22 85 30 88" stroke="#2D5A2E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M25 12 Q28 10 30 12 Q28 16 25 15" fill="#2D5A2E" />
      <path d="M75 20 Q80 15 75 12 Q68 10 65 18 L65 40 L70 45 L80 50 L72 60 L75 75 Q78 85 70 88" stroke="#D4651F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M75 12 Q72 10 70 12 Q72 16 75 15" fill="#D4651F" />
      <path d="M28 45 L28 75 L35 75 L35 55" stroke="#E8E3D8" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <path d="M72 45 L72 75 L65 75 L65 55" stroke="#E8E3D8" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <path d="M35 55 L50 70 L65 55" stroke="#E8E3D8" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <circle cx="50" cy="55" r="2" fill="#E8E3D8" opacity="0.9" />
      <circle cx="35" cy="45" r="1.5" fill="#2D5A2E" />
      <circle cx="65" cy="45" r="1.5" fill="#D4651F" />
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

const ManweSerpentMini = memo(function ManweSerpentMini({ size = 16, opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }} aria-hidden="true">
      <path d="M6 4 L6 18 L8 18 L8 10 L12 16 L16 10 L16 18 L18 18 L18 4" stroke="#E8E3D8" strokeWidth="1.5" strokeLinejoin="miter" fill="none" />
      <path d="M5 4 Q3 2 5 1" stroke="#2D5A2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M19 4 Q21 2 19 1" stroke="#D4651F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.8" fill="#E8E3D8" />
    </svg>
  );
});

const FlagStrip = memo(function FlagStrip({ className = "w-24 h-0.5" }) {
  return (
    <div className={`${className} flex`} aria-hidden="true">
      <div className="flex flex-1">
        <div className="flex-1 bg-[#2D5A2E]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
      <div className="w-px bg-transparent" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#D4651F]" />
        <div className="flex-1 bg-[#E8E3D8]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
    </div>
  );
});

const ManweGradientText = memo(function ManweGradientText({ children, fontSize = "32px", letterSpacing = "0.1em" }) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
        lineHeight: 1,
        background: "linear-gradient(135deg, #2D5A2E 0%, #E8E3D8 50%, #D4651F 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
});

// ─── Newsletter Form Component ────────────────────────────────────────────────

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [focused, setFocused] = useState(false);

  const mountedAt = useRef(Date.now());

  // Auto-clear toasts
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(t);
  }, [message]);

  const triggerToast = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // 1. HONEYPOT: If filled out, fake success (traps bots)
    if (honeypot.trim() !== "") {
      triggerToast("WELCOME TO THE MANWE TRIBE", "success");
      setEmail("");
      setHoneypot("");
      return;
    }

    // 2. TIME-TRAP: Form submitted too quickly
    if (Date.now() - mountedAt.current < HUMAN_MIN_MS) {
      triggerToast("PLEASE TAKE A MOMENT — TRY AGAIN", "error");
      return;
    }

    // 3. RATE LIMIT: Prevent spamming Supabase
    const lastSub = Number(sessionStorage.getItem("manwe_nl_last") || 0);
    if (lastSub && Date.now() - lastSub < RATE_LIMIT_MS) {
      triggerToast("WAIT A MOMENT BEFORE TRYING AGAIN", "error");
      return;
    }

    // 4. SANITIZE & VALIDATE
    const cleanEmail = clean(email);
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      triggerToast("PLEASE ENTER A VALID EMAIL", "error");
      return;
    }

    setLoading(true);

    try {
      // Check if exists
      const { data: existing, error: checkError } = await supabase
        .from("newsletter_subscribers")
        .select("email")
        .eq("email", cleanEmail)
        .maybeSingle(); // Prevents throwing an error if 0 rows found

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existing) {
        triggerToast("THIS EMAIL IS ALREADY IN THE TRIBE", "error");
        setLoading(false);
        return;
      }

      // Insert new subscriber
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: cleanEmail }]);

      if (insertError) throw insertError;

      // Update rate limit state
      sessionStorage.setItem("manwe_nl_last", String(Date.now()));
      
      triggerToast("WELCOME TO THE MANWE TRIBE", "success");
      setEmail("");
    } catch (err) {
      console.error("Newsletter Sub Error:", err);
      triggerToast("SUBSCRIPTION FAILED — TRY AGAIN", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative w-full border-y border-[#2D5A2E]/20 py-16 lg:py-24 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0F1A12 0%, #0C1610 50%, #0F1A12 100%)",
      }}
      aria-label="Newsletter Subscription"
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,101,31,0.04) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Background watermarks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ManweSerpentM size={400} opacity={0.04} />
        </div>
        <div className="absolute top-8 left-8 hidden lg:block"><ManweSerpentMini size={20} opacity={0.2} /></div>
        <div className="absolute top-8 right-8 hidden lg:block"><ManweSerpentMini size={20} opacity={0.2} /></div>
        <div className="absolute bottom-8 left-8 hidden lg:block"><ManweSerpentMini size={20} opacity={0.2} /></div>
        <div className="absolute bottom-8 right-8 hidden lg:block"><ManweSerpentMini size={20} opacity={0.2} /></div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-10">
        <FlagStrip className="w-full h-0.5" />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto flex flex-col items-center relative z-10">
        <div className="mb-6"><ManweSerpentM size={54} opacity={0.95} /></div>

        <div className="flex items-center gap-3 mb-4" aria-hidden="true">
          <div className="w-10 h-px bg-[#2D5A2E]" />
          <AdinkraDiamond size={7} fill="#D4651F" opacity={0.9} />
          <span
            className="text-[#4A8C4D]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.4em" }}
          >
            JOIN THE MOVEMENT
          </span>
          <AdinkraDiamond size={7} fill="#D4651F" opacity={0.9} />
          <div className="w-10 h-px bg-[#D4651F]" />
        </div>

        <h2
          className="text-center leading-none mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 6vw, 52px)", letterSpacing: "0.05em" }}
        >
          <span className="text-[#E8E3D8]">JOIN THE </span>
          <ManweGradientText fontSize="clamp(32px, 6vw, 52px)" letterSpacing="0.05em">
            MANWE
          </ManweGradientText>
          <span className="text-[#E8E3D8]"> TRIBE</span>
        </h2>

        <p
          className="text-[#E8E3D8]/50 text-center mb-8 max-w-md"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "14px", letterSpacing: "0.3em" }}
        >
          FIRST ACCESS — NEW DROPS — EXCLUSIVE PIECES
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col md:flex-row gap-3 relative"
          noValidate
        >
          {/* Honeypot Field */}
          <div
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
          >
            <label htmlFor="nl-website">Website</label>
            <input
              id="nl-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Email input */}
          <div
            className={`
              relative flex-1 flex items-center gap-3 border px-4 py-3 transition-all duration-300
              focus-within:border-[#E8E3D8] focus-within:ring-1 focus-within:ring-[#E8E3D8]/50
              ${focused ? "border-[#E8E3D8]" : "border-[#2D5A2E]/40"}
            `}
            style={{ backgroundColor: "rgba(8, 10, 8, 0.5)", backdropFilter: "blur(4px)" }}
          >
            <ManweSerpentMini size={14} opacity={focused ? 0.8 : 0.4} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="ENTER YOUR EMAIL"
              required
              maxLength={MAX_EMAIL_LEN}
              aria-label="Email Address for Newsletter"
              className="flex-1 bg-transparent outline-none text-[#E8E3D8] placeholder:text-[#E8E3D8]/30 w-full"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px", letterSpacing: "0.2em" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              group relative flex items-center justify-center gap-3 border px-8 py-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4541A]
              ${loading ? "border-[#2D5A2E]/20 cursor-not-allowed opacity-50" : "border-[#E8E3D8]/40 hover:border-[#E8E3D8] hover:bg-[#E8E3D8] manwe-shake-hover"}
            `}
          >
            {!loading && (
              <>
                <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} /></span>
                <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} /></span>
                <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} /></span>
                <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} /></span>
              </>
            )}

            <span
              className={`transition-colors ${loading ? "text-[#E8E3D8]/40" : "text-[#E8E3D8] group-hover:text-[#0F1A12]"}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px", letterSpacing: "0.3em" }}
            >
              {loading ? "JOINING..." : "SUBSCRIBE"}
            </span>

            {!loading && (
              <span className="text-[#D4651F] group-hover:text-[#0F1A12] transition-colors font-mono text-sm">→</span>
            )}
          </button>
        </form>

        <div className="mt-10 flex items-center gap-4">
          <FlagStrip className="w-20 h-0.5" />
          <span className="font-mono text-[#E8E3D8]/30 text-[9px] tracking-[0.4em]">NGR × CIV</span>
          <FlagStrip className="w-20 h-0.5" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONFIRMATION TOAST                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[min(92vw,400px)] ${
          message ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        role="status"
        aria-live="polite"
      >
        <div
          className={`relative flex items-center gap-3 border px-6 py-4 shadow-2xl ${
            messageType === "success" ? "border-[#2D5A2E]" : "border-[#D4651F]"
          }`}
          style={{ backgroundColor: "#0F1A12" }}
        >
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill={messageType === "success" ? "#2D5A2E" : "#D4651F"} opacity={0.9} /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill={messageType === "success" ? "#2D5A2E" : "#D4651F"} opacity={0.9} /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill={messageType === "success" ? "#2D5A2E" : "#D4651F"} opacity={0.9} /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill={messageType === "success" ? "#2D5A2E" : "#D4651F"} opacity={0.9} /></span>

          <ManweSerpentMini size={16} opacity={0.8} />

          <span
            className={messageType === "success" ? "text-[#E8E3D8]" : "text-[#D4651F]"}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "14px", letterSpacing: "0.25em" }}
          >
            {message}
          </span>
        </div>
      </div>
    </section>
  );
}