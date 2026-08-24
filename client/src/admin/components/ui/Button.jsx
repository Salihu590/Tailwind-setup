// admin/components/ui/Button.jsx
import { Loader2 } from 'lucide-react'

function AdinkraDiamond({ size = 6, fill = '#D4651F', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  )
}

/**
 * Variants: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
 * Sizes: 'sm' | 'md' | 'lg'
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  withDiamonds = false,
  children,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const sizeStyles = {
    sm: { padding: '6px 14px', fontSize: '10px', letterSpacing: '0.25em', iconSize: 11 },
    md: { padding: '10px 24px', fontSize: '12px', letterSpacing: '0.3em', iconSize: 13 },
    lg: { padding: '14px 32px', fontSize: '14px', letterSpacing: '0.35em', iconSize: 15 },
  }

  const variantClasses = {
    primary:
      'border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] text-[#1A1A18] hover:text-[#F4EFE6]',
    secondary:
      'border border-[#D9D2C4] hover:border-[#1A1A18] text-[#6B6558] hover:text-[#1A1A18]',
    ghost: 'text-[#6B6558] hover:text-[#1A1A18]',
    danger:
      'border border-[#D4651F]/40 hover:border-[#D4651F] hover:bg-[#D4651F] text-[#D4651F] hover:text-[#F4EFE6]',
    success:
      'border border-[#2D5A2E]/40 hover:border-[#2D5A2E] hover:bg-[#2D5A2E] text-[#2D5A2E] hover:text-[#F4EFE6]',
  }

  const isDisabled = loading || disabled

  const sz = sizeStyles[size]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        group relative inline-flex items-center justify-center gap-2 transition-all duration-300
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        padding: sz.padding,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: sz.fontSize,
        letterSpacing: sz.letterSpacing,
      }}
      {...rest}
    >
      {withDiamonds && !isDisabled && (
        <>
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} /></span>
        </>
      )}

      {loading ? (
        <Loader2 className="animate-spin" size={sz.iconSize} />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={sz.iconSize} />
      )}

      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' && <Icon size={sz.iconSize} />}
    </button>
  )
}