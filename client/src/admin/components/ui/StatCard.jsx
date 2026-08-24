// admin/components/ui/StatCard.jsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function AdinkraDiamond({ size = 6, fill = '#D4651F', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  )
}

function ManweGradientText({ children, fontSize = '32px' }) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing: '0.02em',
        lineHeight: 1,
        background: 'linear-gradient(135deg, #2D5A2E 0%, #4A8C4D 25%, #1A1A18 50%, #D4651F 75%, #C4541A 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}

/**
 * @param {number|null} trend — percentage change (positive/negative/null)
 */
export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = '#2D5A2E',
  highlight = false,
  trend = null,
  trendLabel = 'vs last week',
  onClick,
}) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendColor = trend > 0 ? '#2D5A2E' : trend < 0 ? '#D4651F' : '#8B8577'

  return (
    <div
      className={`relative border border-[#D9D2C4] p-5 transition-all ${
        onClick ? 'cursor-pointer hover:border-[#1A1A18] hover:shadow-sm' : ''
      }`}
      style={{ backgroundColor: '#FDFAF3' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {highlight && (
        <>
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" /></span>
        </>
      )}

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 border flex items-center justify-center"
          style={{ borderColor: accent, color: accent }}
        >
          {Icon && <Icon size={20} />}
        </div>
        <AdinkraDiamond size={5} fill={accent} opacity={0.6} />
      </div>

      <p
        className="text-[#8B8577] mb-2"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '10px',
          letterSpacing: '0.4em',
        }}
      >
        {label}
      </p>

      {highlight ? (
        <ManweGradientText fontSize="clamp(24px, 3vw, 32px)">
          {value}
        </ManweGradientText>
      ) : (
        <h3
          className="text-[#1A1A18]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(24px, 3vw, 32px)',
            letterSpacing: '0.02em',
          }}
        >
          {value}
        </h3>
      )}

      {trend !== null && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#D9D2C4]">
          <TrendIcon size={12} style={{ color: trendColor }} />
          <span
            className="font-mono text-[10px] tracking-wider"
            style={{ color: trendColor }}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-wider">
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  )
}