// TopProducts.jsx — MANWE Admin Dashboard
import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, RefreshCw } from 'lucide-react'

import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonBox } from '../components/ui/Skeleton'

// ─── Design Primitives ───────────────────────────────────────────────────────

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
        fontFamily: "'Bebas Neue', sans-serif", fontSize, letterSpacing, lineHeight: 1,
        background: 'linear-gradient(135deg, #2D5A2E 0%, #4A8C4D 25%, #1A1A18 50%, #D4651F 75%, #C4541A 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-px bg-[#2D5A2E]" /><AdinkraDiamond size={6} fill="#D4651F" />
      <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.4em' }}>
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D9D2C4]" />
    </div>
  )
}

// ─── Rank Colors ─────────────────────────────────────────────────────────────

const rankMeta = [
  { label: 'THE CROWN',   color: '#2D5A2E', bg: '#E4ECD9' }, // #1
  { label: 'SECOND',      color: '#D4651F', bg: '#F5E1D3' }, // #2
  { label: 'THIRD',       color: '#8B6F3F', bg: '#EAE1D3' }, // #3
  { label: 'FOURTH',      color: '#6B6558', bg: '#E6E4E0' }, // #4
  { label: 'FIFTH',       color: '#8B8577', bg: '#EAE9E6' }, // #5
]

export default function TopProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTopProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('cart_items')
        .eq('payment_status', 'paid')

      if (fetchError) throw fetchError

      const productMap = {}
      ;(data || []).forEach((order) => {
        const items = Array.isArray(order.cart_items) ? order.cart_items : []
        items.forEach((item) => {
          if (!item?.id) return
          if (!productMap[item.id]) {
            productMap[item.id] = {
              id: item.id,
              name: item.name || 'Unknown',
              image: item.image,
              totalQuantity: 0,
              totalRevenue: 0,
            }
          }
          const qty = Number(item.quantity) || 0
          const price = Number(item.price) || 0
          productMap[item.id].totalQuantity += qty
          productMap[item.id].totalRevenue += price * qty
        })
      })

      const sorted = Object.values(productMap)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5)

      setProducts(sorted)
    } catch (err) {
      console.error(err)
      const msg = (err?.message || '').toLowerCase()
      setError(
        msg.includes('permission') || msg.includes('row-level security')
          ? 'ACCESS DENIED — CHECK ADMIN ROLE OR ORDERS RLS'
          : 'FAILED TO LOAD TOP PIECES'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTopProducts()
  }, [fetchTopProducts])

  // Get max quantity for the visual progress bars
  const maxQty = products.length > 0 ? Math.max(...products.map(p => p.totalQuantity)) : 1

  return (
    <div className="relative border border-[#D9D2C4] p-6" style={{ backgroundColor: '#FDFAF3' }}>
      <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
      <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
      <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
      <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <SectionLabel>THE CHARTS</SectionLabel>
          <h3 className="leading-none">
            <ManweGradientText fontSize="clamp(22px, 3vw, 30px)">
              TOP 5 PIECES
            </ManweGradientText>
          </h3>
          <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mt-2">
            WHAT THE TRIBE IS WEARING
          </p>
        </div>

        <Button variant="ghost" size="sm" icon={RefreshCw} onClick={fetchTopProducts} loading={loading}>
          REFRESH
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center border border-[#D9D2C4] p-4">
              <SkeletonBox className="w-12 h-12 shrink-0" />
              <div className="flex-1 space-y-2"><SkeletonBox className="h-4 w-32" /><SkeletonBox className="h-3 w-16" /></div>
            </div>
          ))
        ) : error ? (
          <EmptyState title="SOMETHING WENT WRONG" message={error} actionLabel="TRY AGAIN" onAction={fetchTopProducts} />
        ) : products.length === 0 ? (
          <EmptyState title="NO SALES DATA YET" message="When pieces are sold, the charts will update." />
        ) : (
          products.map((product, index) => {
            const meta = rankMeta[index] || rankMeta[4]
            const barWidth = `${(product.totalQuantity / maxQty) * 100}%`

            return (
              <div
                key={product.id}
                className="group relative flex items-center gap-4 border border-[#D9D2C4] hover:border-[#1A1A18] p-4 transition-all overflow-hidden"
                style={{ backgroundColor: '#F4EFE6' }}
              >
                {/* Visual Volume Bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 opacity-40 transition-all duration-1000 ease-out"
                  style={{ width: barWidth, backgroundColor: meta.bg, zIndex: 0 }}
                />

                {/* Rank number */}
                <div
                  className="relative z-10 w-12 h-12 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: meta.color, color: '#F4EFE6' }}
                >
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '0.02em' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {index === 0 && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                      <AdinkraDiamond size={8} fill="#D4651F" opacity={1} />
                    </span>
                  )}
                </div>

                {/* Product image */}
                <div
                  className="relative z-10 w-16 h-16 border border-[#D9D2C4] shrink-0 overflow-hidden bg-[#FDFAF3]"
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                </div>

                {/* Product info */}
                <div className="relative z-10 flex-1 min-w-0">
                  <p
                    className="text-[#1A1A18] mb-1 truncate"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.08em' }}
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
                  </div>
                </div>

                {/* Revenue */}
                <div className="relative z-10 text-right shrink-0">
                  <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">REVENUE</p>
                  <ManweGradientText fontSize="16px" letterSpacing="0.02em">
                    ₦{product.totalRevenue.toLocaleString()}
                  </ManweGradientText>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}