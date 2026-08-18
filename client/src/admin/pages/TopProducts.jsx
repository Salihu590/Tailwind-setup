import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, RefreshCw } from 'lucide-react'

// ─── MANWE Design Primitives ─────────────────────────────────────────────────

function ManweBeastEmblem({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
      <path d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="#2D5A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="#D4651F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="#1A1A18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#1A1A18" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#2D5A2E" />
      <circle cx="44" cy="28" r="1.5" fill="#D4651F" />
      <path d="M37 18 L40 8 L43 18" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="40" y1="55" x2="40" y2="70" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="#1A1A18" opacity="0.7" />
    </svg>
  )
}

function AdinkraDiamond({ size = 6, fill = '#D4651F', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  )
}

function ManweGradientText({ children, fontSize = '32px', letterSpacing = '0.05em' }) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
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

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-px bg-[#2D5A2E]" />
      <AdinkraDiamond size={6} fill="#D4651F" />
      <span
        className="text-[#2D5A2E]"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.4em',
        }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D9D2C4]" />
    </div>
  )
}

// ─── Rank Colors (per position) ──────────────────────────────────────────────

const rankMeta = [
  { label: 'THE CROWN',   color: '#2D5A2E', accent: '#4A8C4D' }, // #1
  { label: 'SECOND',      color: '#D4651F', accent: '#E8842F' }, // #2
  { label: 'THIRD',       color: '#8B6F3F', accent: '#A88657' }, // #3
  { label: 'FOURTH',      color: '#6B6558', accent: '#8B8577' }, // #4
  { label: 'FIFTH',       color: '#6B6558', accent: '#8B8577' }, // #5
]

// ─── TopProducts Component ───────────────────────────────────────────────────

export default function TopProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTopProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('cart_items')
        .eq('payment_status', 'paid')

      if (fetchError) throw fetchError

      const productMap = {}
      data.forEach((order) => {
        order.cart_items.forEach((item) => {
          if (!productMap[item.id]) {
            productMap[item.id] = {
              id: item.id,
              name: item.name,
              image: item.image,
              totalQuantity: 0,
              totalRevenue: 0,
            }
          }
          productMap[item.id].totalQuantity += item.quantity
          productMap[item.id].totalRevenue += item.price * item.quantity
        })
      })

      const sorted = Object.values(productMap)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5)

      setProducts(sorted)
    } catch (err) {
      console.error(err)
      setError('Failed to load top pieces.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopProducts()
  }, [])

  // ─── Loading state ──
  if (loading) {
    return (
      <div
        className="relative border border-[#D9D2C4] p-12 flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: '#FDFAF3' }}
      >
        <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
        <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
        <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
        <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>

        <div style={{ animation: 'manwe-spin 3s linear infinite' }}>
          <ManweBeastEmblem size={48} opacity={0.7} />
        </div>
        <p
          className="text-[#6B6558]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.4em',
          }}
        >
          READING THE CHARTS
        </p>
        <style>{`
          @keyframes manwe-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // ─── Error state ──
  if (error) {
    return (
      <div
        className="relative border border-[#D4651F] p-6 text-center"
        style={{ backgroundColor: '#FDFAF3' }}
      >
        <p
          className="text-[#D4651F]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '13px',
            letterSpacing: '0.3em',
          }}
        >
          {error}
        </p>
        <button
          onClick={fetchTopProducts}
          className="mt-4 border border-[#1A1A18] px-4 py-2 hover:bg-[#1A1A18] hover:text-[#F4EFE6] transition-all"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.3em',
          }}
        >
          TRY AGAIN
        </button>
      </div>
    )
  }

  // ─── Main render ──
  return (
    <div
      className="relative border border-[#D9D2C4] p-6"
      style={{ backgroundColor: '#FDFAF3' }}
    >
      {/* Corner diamonds */}
      <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
      <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
      <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
      <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <SectionLabel>THE CHARTS</SectionLabel>
          <h3
            className="leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(22px, 3vw, 30px)',
              letterSpacing: '0.05em',
            }}
          >
            <ManweGradientText fontSize="clamp(22px, 3vw, 30px)" letterSpacing="0.05em">
              TOP 5 PIECES
            </ManweGradientText>
          </h3>
          <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mt-2">
            WHAT THE TRIBE IS WEARING
          </p>
        </div>

        <button
          onClick={fetchTopProducts}
          className="group flex items-center gap-2 border border-[#1A1A18]/30 hover:border-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F4EFE6] px-3 py-1.5 transition-all"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.3em',
          }}
          title="Refresh"
        >
          <RefreshCw size={11} className="group-hover:rotate-180 transition-transform duration-500" />
          REFRESH
        </button>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {products.length > 0 ? (
          products.map((product, index) => {
            const meta = rankMeta[index] || rankMeta[4]
            return (
              <div
                key={product.id}
                className="relative flex items-center gap-4 border border-[#D9D2C4] hover:border-[#1A1A18] p-4 transition-all"
                style={{ backgroundColor: '#F4EFE6' }}
              >
                {/* Rank number */}
                <div
                  className="relative w-12 h-12 flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: meta.color,
                    color: '#F4EFE6',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '22px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {/* Crown for #1 */}
                  {index === 0 && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                      <AdinkraDiamond size={8} fill="#D4651F" opacity={1} />
                    </span>
                  )}
                </div>

                {/* Product image */}
                <div
                  className="relative w-16 h-16 border border-[#D9D2C4] shrink-0 overflow-hidden"
                  style={{ backgroundColor: '#FDFAF3' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[#1A1A18] mb-1 truncate"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '15px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {product.name.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Package size={10} className="text-[#8B8577]" />
                      <span className="font-mono text-[#6B6558] text-[10px] tracking-[0.25em]">
                        {product.totalQuantity} SOLD
                      </span>
                    </div>
                    <span className="text-[#D9D2C4]">·</span>
                    <span className="font-mono text-[#6B6558] text-[10px] tracking-[0.25em]">
                      #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Revenue */}
                <div className="text-right shrink-0">
                  <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                    REVENUE
                  </p>
                  <ManweGradientText fontSize="16px" letterSpacing="0.02em">
                    ₦{product.totalRevenue.toLocaleString()}
                  </ManweGradientText>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <ManweBeastEmblem size={48} opacity={0.3} />
            <p
              className="text-[#8B8577]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '13px',
                letterSpacing: '0.35em',
              }}
            >
              NO SALES DATA YET
            </p>
          </div>
        )}
      </div>
    </div>
  )
}