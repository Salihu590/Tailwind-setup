// admin/components/ui/Modal.jsx
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

function AdinkraDiamond({ size = 8, fill = '#D4651F' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  )
}

/**
 * A11y-first modal with:
 * - Escape closes
 * - Focus lock on backdrop
 * - Body scroll lock
 * - Portal rendering
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) {
  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 pb-8 overflow-y-auto animate-fade-in"
      style={{
        backgroundColor: 'rgba(26, 26, 24, 0.7)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidth} border border-[#1A1A18] animate-slide-up`}
        style={{ backgroundColor: '#FDFAF3' }}
      >
        <span className="absolute -top-1 -left-1"><AdinkraDiamond size={8} fill="#2D5A2E" /></span>
        <span className="absolute -top-1 -right-1"><AdinkraDiamond size={8} fill="#D4651F" /></span>
        <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={8} fill="#D4651F" /></span>
        <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={8} fill="#2D5A2E" /></span>

        {(title || subtitle) && (
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#D9D2C4]" style={{ backgroundColor: '#FDFAF3' }}>
            <div>
              {subtitle && (
                <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                  {subtitle}
                </p>
              )}
              {title && (
                <p
                  id="modal-title"
                  className="text-[#1A1A18]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '18px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {title}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#6B6558] hover:text-[#1A1A18] transition-colors p-1 hover:bg-[#F4EFE6]"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
        )}

        {children}
      </div>

      <style>{`
        @keyframes manwe-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes manwe-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: manwe-fade-in 0.2s ease-out; }
        .animate-slide-up { animation: manwe-slide-up 0.3s ease-out; }
      `}</style>
    </div>,
    document.body
  )
}