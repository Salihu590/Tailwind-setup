// admin/components/ui/EmptyState.jsx
import { PropTypes } from 'prop-types'

function ManweBeastEmblem({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
      <path d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="#2D5A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="#D4651F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="#1A1A18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#1A1A18" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#2D5A2E" />
      <circle cx="44" cy="28" r="1.5" fill="#D4651F" />
    </svg>
  )
}

function AdinkraDiamond({ size = 6, fill = '#D4651F' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  )
}

export default function EmptyState({
  icon,
  title = 'NOTHING HERE YET',
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div
      className="relative border border-[#D9D2C4] p-12 flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: '#FDFAF3' }}
    >
      <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" /></span>
      <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" /></span>
      <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" /></span>
      <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" /></span>

      <div className="opacity-40">
        {icon || <ManweBeastEmblem size={64} opacity={0.5} />}
      </div>

      <p
        className="text-[#1A1A18]"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '18px',
          letterSpacing: '0.3em',
        }}
      >
        {title}
      </p>

      {message && (
        <p className="text-[#8B8577] text-center max-w-md text-sm leading-relaxed">
          {message}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 border border-[#1A1A18] px-6 py-3 hover:bg-[#1A1A18] hover:text-[#F4EFE6] transition-all"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.3em',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}