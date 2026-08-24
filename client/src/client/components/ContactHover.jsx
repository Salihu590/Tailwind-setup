// src/client/components/ContactHover.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, MessageCircle, ArrowRight } from "lucide-react";

export default function ContactHover() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside (mobile friendly)
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative z-50"
      ref={menuRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#E8E3D8]/60 hover:text-[#E8E3D8] transition-colors focus-visible:outline-none focus-visible:text-[#E8E3D8]"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "0.18em" }}
        aria-expanded={isOpen}
      >
        CONTACT
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 transition-all duration-300 origin-top ${
          isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Arrow pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0c0c0c] border-l border-t border-white/10 rotate-45" />

        {/* Dropdown Card */}
        <div className="relative bg-[#0c0c0c] border border-white/10 p-4 shadow-2xl overflow-hidden">
          {/* Subtle noise/pattern overlay could go here */}
          
          <p className="text-[#D4651F] font-mono text-[9px] tracking-[0.4em] mb-3 px-2 border-b border-white/5 pb-2">
            DIRECT INQUIRY
          </p>

          <div className="space-y-1">
            <a
              href={`mailto:${import.meta.env.VITE_GMAIL_ACCOUNT || "info@manwe.com"}`}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group"
            >
              <Mail size={15} className="text-gray-500 group-hover:text-[#E8E3D8]" />
              <span className="text-xs tracking-wider text-gray-400 group-hover:text-[#E8E3D8] uppercase">Email</span>
              <ArrowRight size={14} className="ml-auto text-gray-600 group-hover:text-[#D4651F] group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "2349162407757"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group"
            >
              <MessageCircle size={15} className="text-gray-500 group-hover:text-[#E8E3D8]" />
              <span className="text-xs tracking-wider text-gray-400 group-hover:text-[#E8E3D8] uppercase">WhatsApp</span>
              <ArrowRight size={14} className="ml-auto text-gray-600 group-hover:text-[#D4651F] group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href={`tel:+${import.meta.env.VITE_WHATSAPP_NUMBER || "2349162407757"}`}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group"
            >
              <Phone size={15} className="text-gray-500 group-hover:text-[#E8E3D8]" />
              <span className="text-xs tracking-wider text-gray-400 group-hover:text-[#E8E3D8] uppercase">Call</span>
              <ArrowRight size={14} className="ml-auto text-gray-600 group-hover:text-[#1A5C2A] group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM_USERNAME || "mw.civ"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group"
            >
              <Instagram size={15} className="text-gray-500 group-hover:text-[#E8E3D8]" />
              <span className="text-xs tracking-wider text-gray-400 group-hover:text-[#E8E3D8] uppercase">Instagram</span>
              <ArrowRight size={14} className="ml-auto text-gray-600 group-hover:text-[#D4651F] group-hover:translate-x-1 transition-all" />
            </a>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5">
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-center font-mono text-[9px] tracking-[0.3em] text-[#1A5C2A] hover:text-[#E8E3D8] transition-colors py-1"
            >
              VIEW FULL CONTACT →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}