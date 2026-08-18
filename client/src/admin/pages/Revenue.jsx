import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, Wallet, TrendingUp, RefreshCcw, Loader2 } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { format } from 'date-fns'

// ─── MANWE Beast Emblem ──────────────────────────────────────────────────────

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

function FlagStrip({ className = 'w-full h-0.5' }) {
  return (
    <div className={`${className} flex`}>
      <div className="flex flex-1">
        <div className="flex-1 bg-[#2D5A2E]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
      <div className="w-px" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#D4651F]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
    </div>
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
      <AdinkraDiamond size={6} fill="#D4651F" opacity={1} />
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

// ─── Loading state ───────────────────────────────────────────────────────────

function ManweLoader() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      <div
        style={{ animation: 'manwe-spin 3s linear infinite' }}
      >
        <ManweBeastEmblem size={64} opacity={0.9} />
      </div>
      <p
        className="text-[#6B6558]"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '14px',
          letterSpacing: '0.4em',
        }}
      >
        LOADING THE NUMBERS
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

// ─── Revenue Dashboard ────────────────────────────────────────────────────────

export default function Revenue() {
  const [stats, setStats] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      const { data: paidOrders } = await supabase
        .from('orders')
        .select('total')
        .eq('payment_status', 'paid')

      const totalRevenue = paidOrders?.reduce((sum, o) => sum + o.total, 0) || 0

      const { count: pendingPayments } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'pending')

      const { count: ordersToShip } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'confirmed')

      setStats({ totalOrders, totalRevenue, pendingPayments, ordersToShip })

      const { data: allPaidOrders } = await supabase
        .from('orders')
        .select('total, created_at')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: true })

      const dateMap = {}
      allPaidOrders?.forEach((o) => {
        const date = o.created_at.split('T')[0]
        dateMap[date] = (dateMap[date] || 0) + o.total
      })

      setRevenueData(
        Object.entries(dateMap).map(([date, revenue]) => ({
          date: format(new Date(date), 'MMM d'),
          revenue,
        }))
      )

      setLastUpdated(new Date())
    } catch (err) {
      console.error(err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <ManweLoader />

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 p-6"
        style={{ backgroundColor: '#F4EFE6' }}
      >
        <ManweBeastEmblem size={64} opacity={0.5} />
        <p
          className="text-[#D4651F] text-center"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '16px',
            letterSpacing: '0.3em',
          }}
        >
          {error}
        </p>
        <button
          onClick={() => fetchData()}
          className="group relative flex items-center gap-3 border border-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F4EFE6] px-6 py-3 transition-all"
        >
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={1} /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={1} /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} /></span>
          <RefreshCcw size={14} />
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '13px',
              letterSpacing: '0.35em',
            }}
          >
            TRY AGAIN
          </span>
        </button>
      </div>
    )
  }

  const statCards = [
    {
      label: 'TOTAL ORDERS',
      value: (stats?.totalOrders ?? 0).toLocaleString(),
      icon: <Package size={20} />,
      accent: '#2D5A2E',
    },
    {
      label: 'TOTAL REVENUE',
      value: `₦${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: <TrendingUp size={20} />,
      accent: '#D4651F',
      highlight: true,
    },
    {
      label: 'PENDING PAYMENTS',
      value: (stats?.pendingPayments ?? 0).toLocaleString(),
      icon: <Wallet size={20} />,
      accent: '#D4651F',
    },
    {
      label: 'ORDERS TO SHIP',
      value: (stats?.ordersToShip ?? 0).toLocaleString(),
      icon: <Package size={20} />,
      accent: '#2D5A2E',
    },
  ]

  return (
    <div
      className="min-h-screen pt-24 pb-16 relative overflow-hidden"
      style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}
    >
      {/* Background watermark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={500} opacity={0.03} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
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
                THE TRIBE HQ
              </span>
              <AdinkraDiamond size={6} fill="#D4651F" />
              <div className="w-4 h-px bg-[#D4651F]" />
            </div>

            <h1
              className="leading-none mb-2"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(32px, 5vw, 48px)',
                letterSpacing: '0.02em',
              }}
            >
              <ManweGradientText fontSize="clamp(32px, 5vw, 48px)" letterSpacing="0.02em">
                DASHBOARD
              </ManweGradientText>
            </h1>

            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em] mt-2">
              LAST UPDATED — {lastUpdated ? format(lastUpdated, 'MMM d, yyyy · h:mm a').toUpperCase() : 'N/A'}
            </p>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="group relative flex items-center gap-3 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-6 py-3 transition-all disabled:opacity-50"
          >
            {!refreshing && (
              <>
                <span className="absolute -top-1 -left-1"><AdinkraDiamond size={5} fill="#2D5A2E" opacity={1} /></span>
                <span className="absolute -top-1 -right-1"><AdinkraDiamond size={5} fill="#D4651F" opacity={1} /></span>
                <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={5} fill="#D4651F" opacity={1} /></span>
                <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={5} fill="#2D5A2E" opacity={1} /></span>
              </>
            )}
            {refreshing ? (
              <Loader2 className="animate-spin text-[#6B6558]" size={14} />
            ) : (
              <RefreshCcw
                size={14}
                className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
              />
            )}
            <span
              className={refreshing ? 'text-[#6B6558]' : 'text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors'}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.35em',
              }}
            >
              {refreshing ? 'REFRESHING' : 'REFRESH'}
            </span>
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="mb-10">
          <SectionLabel>OVERVIEW</SectionLabel>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon, accent, highlight }) => (
              <div
                key={label}
                className="relative border border-[#D9D2C4] p-5"
                style={{ backgroundColor: '#FDFAF3' }}
              >
                {/* Corner diamonds — only for highlighted */}
                {highlight && (
                  <>
                    <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} /></span>
                    <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={1} /></span>
                    <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={1} /></span>
                    <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} /></span>
                  </>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 border flex items-center justify-center"
                    style={{ borderColor: accent, color: accent }}
                  >
                    {icon}
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
                  <ManweGradientText fontSize="clamp(24px, 3vw, 32px)" letterSpacing="0.02em">
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
              </div>
            ))}
          </div>
        </div>

        {/* ── Revenue Chart ── */}
        <div>
          <SectionLabel>REVENUE TREND</SectionLabel>

          <div
            className="relative border border-[#D9D2C4] p-6 lg:p-8"
            style={{ backgroundColor: '#FDFAF3' }}
          >
            <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>
            <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
            <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
            <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>

            {revenueData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <ManweBeastEmblem size={48} opacity={0.3} />
                <p
                  className="text-[#8B8577]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '13px',
                    letterSpacing: '0.35em',
                  }}
                >
                  NO REVENUE DATA YET
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4651F" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2D5A2E" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C4" />
                  <XAxis
                    dataKey="date"
                    stroke="#8B8577"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                    }}
                  />
                  <YAxis
                    stroke="#8B8577"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                    }}
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FDFAF3',
                      border: '1px solid #1A1A18',
                      borderRadius: 0,
                      fontFamily: "'Bebas Neue', sans-serif",
                      letterSpacing: '0.15em',
                    }}
                    labelStyle={{ color: '#2D5A2E', fontSize: '11px', letterSpacing: '0.3em' }}
                    itemStyle={{ color: '#1A1A18' }}
                    formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D4651F"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom flag strip */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <FlagStrip className="w-24 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">
            NGR × CIV
          </span>
          <FlagStrip className="w-24 h-0.5" />
        </div>
      </div>
    </div>
  )
}