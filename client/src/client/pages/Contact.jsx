import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  MapPin,
  Clock,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { api } from "../../lib/api";

// ─── MANWE Unity Beast Emblem ────────────────────────────────────────────────

function ManweBeastEmblem({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
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

// ─── MANWE Gradient Text ──────────────────────────────────────────────────────

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

// ─── Manwe Input ──────────────────────────────────────────────────────────────

function ManweInput({ label, name, value, onChange, type = "text", placeholder, required = false, textarea = false }) {
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
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={5}
          className="w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors resize-none"
          style={{
            backgroundColor: "#FDFAF3",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "15px",
            letterSpacing: "0.1em",
          }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors"
          style={{
            backgroundColor: "#FDFAF3",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "15px",
            letterSpacing: "0.1em",
          }}
        />
      )}
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await api.post("/send-email", {
        type: "contact",
        contact: formData,
      });

      toast.success("MESSAGE SENT — WE'LL BE IN TOUCH SOON", {
        position: "top-center",
        style: {
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "13px",
          letterSpacing: "0.25em",
          backgroundColor: "#FDFAF3",
          color: "#2D5A2E",
          border: "1px solid #2D5A2E",
          borderRadius: "0",
        },
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "FAILED TO SEND MESSAGE — PLEASE TRY AGAIN",
        {
          position: "top-center",
          style: {
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "13px",
            letterSpacing: "0.25em",
            backgroundColor: "#FDFAF3",
            color: "#D4651F",
            border: "1px solid #D4651F",
            borderRadius: "0",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const contactChannels = [
    {
      icon: <Mail size={20} />,
      label: "EMAIL",
      value: import.meta.env.VITE_GMAIL_ACCOUNT,
      href: `mailto:${import.meta.env.VITE_GMAIL_ACCOUNT}`,
      color: "#2D5A2E",
    },
    {
      icon: <Phone size={20} />,
      label: "PHONE",
      value: `+${import.meta.env.VITE_WHATSAPP_NUMBER}`,
      href: `tel:+${import.meta.env.VITE_WHATSAPP_NUMBER}`,
      color: "#D4651F",
    },
    {
      icon: <MessageCircle size={20} />,
      label: "WHATSAPP",
      value: "CHAT WITH US",
      href: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`,
      color: "#2D5A2E",
    },
    {
      icon: <Instagram size={20} />,
      label: "INSTAGRAM",
      value: `@${import.meta.env.VITE_INSTAGRAM_USERNAME}`,
      href: `https://instagram.com/${import.meta.env.VITE_INSTAGRAM_USERNAME}`,
      color: "#D4651F",
    },
  ];

  const faqs = [
    {
      q: "HOW LONG DOES DELIVERY TAKE",
      a: "3–7 business days depending on your location within Nigeria.",
    },
    {
      q: "WHAT'S YOUR RETURN POLICY",
      a: (
        <>
          See our{" "}
          <Link to="/terms" className="text-[#1A1A18] underline hover:text-[#D4651F] transition-colors">
            Terms & Conditions
          </Link>{" "}
          for full details.
        </>
      ),
    },
    {
      q: "DO YOU SHIP INTERNATIONALLY",
      a: "Currently we ship within Nigeria only. International shipping coming soon — the tribe is going global.",
    },
    {
      q: "HOW CAN I TRACK MY ORDER",
      a: "You'll receive email updates when your order is shipped and delivered.",
    },
  ];

  return (
    <div
      className="min-h-screen pt-24 pb-16 relative overflow-hidden"
      style={{ backgroundColor: "#F4EFE6", color: "#1A1A18" }}
    >
      {/* ── Background watermarks ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={600} opacity={0.03} />
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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HERO                                                               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        <div className="flex flex-col items-center text-center mb-16">
          <ManweBeastEmblem size={60} opacity={1} />

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
              REACH THE TRIBE
            </span>
            <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
            <div className="w-10 h-px bg-[#D4651F]" />
          </div>

          <h1
            className="leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(48px, 10vw, 96px)",
              letterSpacing: "0.02em",
            }}
          >
            <span className="text-[#1A1A18]">SPEAK </span>
            <ManweGradientText fontSize="clamp(48px, 10vw, 96px)" letterSpacing="0.02em">
              WITH US
            </ManweGradientText>
          </h1>

          <p
            className="text-[#6B6558] max-w-xl mx-auto leading-relaxed"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "15px",
              letterSpacing: "0.2em",
            }}
          >
            EVERY MESSAGE MOVES THE TRIBE FORWARD.
            <br />
            QUESTIONS, COLLABORATIONS, OR JUST TO SAY HELLO — WE'RE LISTENING.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CHANNELS STRIP                                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        <div className="mb-16">
          <SectionLabel>CHANNELS</SectionLabel>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {contactChannels.map((channel, i) => (
              <a
                key={i}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative border border-[#D9D2C4] hover:border-[#1A1A18] p-5 transition-colors"
                style={{ backgroundColor: "#FDFAF3" }}
              >
                <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AdinkraDiamond size={7} fill={channel.color} opacity={1} />
                </span>

                {/* CENTERED icon + label */}
                <div className="flex flex-col items-center gap-3 text-center">
                  <div
                    className="w-12 h-12 border flex items-center justify-center transition-colors"
                    style={{ borderColor: channel.color, color: channel.color }}
                  >
                    {channel.icon}
                  </div>

                  <div>
                    <p
                      className="text-[#8B8577] mb-1"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.4em",
                      }}
                    >
                      {channel.label}
                    </p>
                    <p
                      className="text-[#1A1A18] break-all"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "14px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {channel.value}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MESSAGE FORM + SIDE INFO                                           */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        <div className="grid lg:grid-cols-5 gap-8 mb-16">

          {/* ── Left: Message Form (3 cols) ── */}
          <div className="lg:col-span-3">
            <SectionLabel>SEND A MESSAGE</SectionLabel>

            <div
              className="relative border border-[#D9D2C4] p-6 lg:p-8"
              style={{ backgroundColor: "#FDFAF3" }}
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

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ManweInput
                    label="YOUR NAME"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                  <ManweInput
                    label="EMAIL"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <ManweInput
                  label="SUBJECT"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                />

                <ManweInput
                  label="YOUR MESSAGE"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  textarea
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    group relative flex items-center justify-center gap-4 border px-8 py-4 transition-all duration-300 mt-2
                    ${
                      loading
                        ? "border-[#D9D2C4] cursor-not-allowed opacity-50"
                        : "border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18]"
                    }
                  `}
                >
                  {!loading && (
                    <>
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
                    </>
                  )}

                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-[#6B6558]" size={18} />
                      <span
                        className="text-[#6B6558]"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "16px",
                          letterSpacing: "0.35em",
                        }}
                      >
                        SENDING...
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "16px",
                          letterSpacing: "0.35em",
                        }}
                      >
                        SEND MESSAGE
                      </span>
                      <span className="text-[#D4651F] group-hover:text-[#F4EFE6] transition-colors font-mono">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right: Location + Hours (2 cols) ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <SectionLabel>WHERE WE ARE</SectionLabel>

            {/* Location card */}
            <div
              className="relative border border-[#D9D2C4] p-6"
              style={{ backgroundColor: "#FDFAF3" }}
            >
              <span className="absolute -top-1 -left-1">
                <AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} />
              </span>
              <span className="absolute -top-1 -right-1">
                <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
              </span>
              <span className="absolute -bottom-1 -left-1">
                <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
              </span>
              <span className="absolute -bottom-1 -right-1">
                <AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} />
              </span>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-[#2D5A2E] text-[#2D5A2E] flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p
                    className="text-[#2D5A2E] mb-1"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "10px",
                      letterSpacing: "0.4em",
                    }}
                  >
                    LOCATION
                  </p>
                  <p
                    className="text-[#1A1A18] mb-1"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "22px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ABUJA — NIGERIA
                  </p>
                  <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em]">
                    NGR × CIV / SERVING NATIONWIDE
                  </p>
                </div>
              </div>
            </div>

            {/* Hours card */}
            <div
              className="relative border border-[#D9D2C4] p-6"
              style={{ backgroundColor: "#FDFAF3" }}
            >
              <span className="absolute -top-1 -left-1">
                <AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} />
              </span>
              <span className="absolute -top-1 -right-1">
                <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
              </span>
              <span className="absolute -bottom-1 -left-1">
                <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
              </span>
              <span className="absolute -bottom-1 -right-1">
                <AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} />
              </span>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-[#D4651F] text-[#D4651F] flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p
                    className="text-[#D4651F] mb-1"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "10px",
                      letterSpacing: "0.4em",
                    }}
                  >
                    RESPONSE
                  </p>
                  <p
                    className="text-[#1A1A18] mb-1"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "22px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    WITHIN 24 HOURS
                  </p>
                  <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em]">
                    MON — SAT / 9AM — 6PM WAT
                  </p>
                </div>
              </div>
            </div>

            {/* Follow strip */}
            <a
              href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between gap-4 border border-[#1A1A18] hover:bg-[#1A1A18] p-5 transition-all duration-300"
              style={{ backgroundColor: "#FDFAF3" }}
            >
              <span className="absolute -top-1 -left-1">
                <AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} />
              </span>
              <span className="absolute -top-1 -right-1">
                <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
              </span>
              <span className="absolute -bottom-1 -left-1">
                <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
              </span>
              <span className="absolute -bottom-1 -right-1">
                <AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} />
              </span>

              <div className="flex items-center gap-3">
                <Instagram size={20} className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors" />
                <div>
                  <p
                    className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "15px",
                      letterSpacing: "0.2em",
                    }}
                  >
                    FOLLOW THE JOURNEY
                  </p>
                  <p className="font-mono text-[#8B8577] group-hover:text-[#F4EFE6]/60 text-[9px] tracking-[0.3em] transition-colors">
                    NEW DROPS — BEHIND THE SCENES
                  </p>
                </div>
              </div>
              <span className="text-[#D4651F] group-hover:text-[#F4EFE6] font-mono transition-colors">
                →
              </span>
            </a>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* FAQ                                                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        <div className="mb-16">
          <SectionLabel>ANSWERS</SectionLabel>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="relative border border-[#D9D2C4] overflow-hidden"
                style={{ backgroundColor: "#FDFAF3" }}
              >
                {openFaq === i && (
                  <>
                    <span className="absolute -top-1 -left-1">
                      <AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} />
                    </span>
                    <span className="absolute -top-1 -right-1">
                      <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
                    </span>
                    <span className="absolute -bottom-1 -left-1">
                      <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
                    </span>
                    <span className="absolute -bottom-1 -right-1">
                      <AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} />
                    </span>
                  </>
                )}

                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-[#F4EFE6]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[#D4651F] font-mono"
                      style={{ fontSize: "11px", letterSpacing: "0.2em" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-[#1A1A18]"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "15px",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-[#6B6558] transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 pt-0 pl-14 text-[#6B6558] text-sm leading-relaxed border-l-2 border-[#D4651F] ml-5 mb-3">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom flag strip */}
        <div className="flex items-center justify-center gap-3">
          <FlagStrip className="w-24 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">
            NGR × CIV
          </span>
          <FlagStrip className="w-24 h-0.5" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TOAST CONTAINER — MANWE BRANDED                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}