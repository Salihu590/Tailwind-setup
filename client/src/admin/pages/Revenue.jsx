// Revenue.jsx — MANWE Admin Dashboard
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, Truck, TrendingUp, RefreshCcw, Wallet } from 'lucide-react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { format, parseISO, isValid, subDays } from 'date-fns'

import Button from '../components/ui/Button'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard, SkeletonBox } from '../components/ui/Skeleton'

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
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.4em' }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D9D2C4]" />
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function throwIfError(error, fallback = 'REQUEST FAILED') {
  if (error) throw new Error(error.message || fallback)
}

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function calculateTrend(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

function buildRevenueSeries(paidOrders = []) {
  const dateMap = {}
  paidOrders.forEach((o) => {
    if (!o?.created_at) return
    const day = String(o.created_at).split('T')[0]
    dateMap[day] = (dateMap[day] || 0) + toNumber(o.total)
  })
  return Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => {
      let label = date
      try {
        const parsed = parseISO(date)
        if (isValid(parsed)) label = format(parsed, 'MMM d')
      } catch { /* ignore */ }
      return { date: label, revenue, rawDate: date }
    })
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function Revenue() {
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const now = new Date()
      const sevenDaysAgo = subDays(now, 7).toISOString()
      const fourteenDaysAgo = subDays(now, 14).toISOString()

      const [paidOrdersRes, toShipRes, inTransitRes] = await Promise.all([
        supabase.from('orders').select('total, created_at').eq('payment_status', 'paid'),
        supabase.from('orders').select('id', { count: 'exact' }).eq('payment_status', 'paid').eq('order_status', 'confirmed'),
        supabase.from('orders').select('id', { count: 'exact' }).eq('payment_status', 'paid').eq('order_status', 'shipped'),
      ])

      throwIfError(paidOrdersRes.error, 'FAILED TO LOAD PAID ORDERS')

      const paidOrders = paidOrdersRes.data || []
      
      // Totals
      const totalRevenue = paidOrders.reduce((sum, o) => sum + toNumber(o.total), 0)
      
      // Trends Calculation (Last 7 Days vs Previous 7 Days)
      const currentWeekOrders = paidOrders.filter(o => o.created_at >= sevenDaysAgo)
      const prevWeekOrders = paidOrders.filter(o => o.created_at >= fourteenDaysAgo && o.created_at < sevenDaysAgo)

      const currentRevenue = currentWeekOrders.reduce((sum, o) => sum + toNumber(o.total), 0)
      const prevRevenue = prevWeekOrders.reduce((sum, o) => sum + toNumber(o.total), 0)

      setStats({
        paidOrders: paidOrders.length,
        totalRevenue,
        ordersToShip: toShipRes.count ?? 0,
        inTransit: inTransitRes.count ?? 0,
      })

      setTrends({
        revenue: calculateTrend(currentRevenue, prevRevenue),
        orders: calculateTrend(currentWeekOrders.length, prevWeekOrders.length)
      })

      setRevenueData(buildRevenueSeries(paidOrders))
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Revenue dashboard error:', err)
      setError(err?.message?.includes('permission') 
        ? 'ACCESS DENIED — CHECK ADMIN ROLE' 
        : 'FAILED TO LOAD DASHBOARD DATA')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div
      className="min-h-screen pt-8 pb-16 relative overflow-hidden"
      style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={500} opacity={0.03} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-px bg-[#2D5A2E]" />
              <AdinkraDiamond size={6} fill="#D4651F" />
              <span
                className="text-[#2D5A2E]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.4em' }}
              >
                THE TRIBE HQ
              </span>
              <AdinkraDiamond size={6} fill="#D4651F" />
              <div className="w-4 h-px bg-[#D4651F]" />
            </div>
            <h1 className="leading-none mb-2">
              <ManweGradientText fontSize="clamp(32px, 5vw, 48px)">
                DASHBOARD
              </ManweGradientText>
            </h1>
            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em] mt-2">
              PAID ORDERS ONLY · LAST UPDATED —{' '}
              {lastUpdated ? format(lastUpdated, 'MMM d, yyyy · h:mm a').toUpperCase() : 'N/A'}
            </p>
          </div>

          <Button
            variant="secondary"
            icon={RefreshCcw}
            onClick={() => fetchData(true)}
            loading={refreshing || loading}
            withDiamonds
          >
            REFRESH
          </Button>
        </div>

        {/* Content */}
        {error ? (
          <EmptyState
            title="DASHBOARD UNAVAILABLE"
            message={error}
            actionLabel="TRY AGAIN"
            onAction={fetchData}
          />
        ) : (
          <>
            {/* Stat cards */}
            <div className="mb-10">
              <SectionLabel>OVERVIEW</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  <>
                    <StatCard
                      label="PAID ORDERS"
                      value={stats?.paidOrders?.toLocaleString()}
                      icon={Package}
                      trend={trends?.orders}
                      trendLabel="last 7 days"
                    />
                    <StatCard
                      label="TOTAL REVENUE"
                      value={`₦${(stats?.totalRevenue ?? 0).toLocaleString()}`}
                      icon={TrendingUp}
                      accent="#D4651F"
                      highlight
                      trend={trends?.revenue}
                      trendLabel="last 7 days"
                    />
                    <StatCard
                      label="TO SHIP"
                      value={stats?.ordersToShip?.toLocaleString()}
                      icon={Wallet}
                      accent="#4A8C4D"
                    />
                    <StatCard
                      label="IN TRANSIT"
                      value={stats?.inTransit?.toLocaleString()}
                      icon={Truck}
                      accent="#D4651F"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Chart */}
            <div>
              <SectionLabel>REVENUE TREND</SectionLabel>
              <div
                className="relative border border-[#D9D2C4] p-6 lg:p-8"
                style={{ backgroundColor: '#FDFAF3' }}
              >
                <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
                <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
                <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
                <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>

                {loading ? (
                  <SkeletonBox className="w-full h-[320px]" />
                ) : revenueData.length === 0 ? (
                  <EmptyState title="NO REVENUE DATA YET" message="Once orders are placed, trends will appear here." />
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
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.15em' }}
                      />
                      <YAxis
                        stroke="#8B8577"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.15em' }}
                        tickFormatter={(v) => v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FDFAF3', border: '1px solid #1A1A18', borderRadius: 0,
                          fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em',
                        }}
                        formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#D4651F" strokeWidth={2} fill="url(#revenueGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}

        <div className="mt-10 flex items-center justify-center gap-3">
          <FlagStrip className="w-24 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
          <FlagStrip className="w-24 h-0.5" />
        </div>
      </div>
    </div>
  )
}