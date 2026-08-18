import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { format } from 'date-fns'
import {
  Eye, X, Plus, Package, CheckCircle, Truck, Archive, Trash,
  Search, Calendar, Loader2,
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL

// ─── MANWE Design System ─────────────────────────────────────────────────────

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

// ─── Status utilities ────────────────────────────────────────────────────────

const STATUS_META = {
  confirmed: { label: 'CONFIRMED', color: '#4A8C4D', icon: CheckCircle },
  shipped:   { label: 'SHIPPED',   color: '#D4651F', icon: Truck },
  delivered: { label: 'DELIVERED', color: '#2D5A2E', icon: Archive },
  pending:   { label: 'PENDING',   color: '#8B8577', icon: Package },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending
  const Icon = meta.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2.5 py-1"
      style={{
        borderColor: meta.color,
        color: meta.color,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '10px',
        letterSpacing: '0.3em',
      }}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  )
}

// ─── Toast helper ────────────────────────────────────────────────────────────

const showToast = (message, type = 'success') => {
  toast[type](message, {
    position: 'top-center',
    autoClose: 3000,
    style: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '13px',
      letterSpacing: '0.25em',
      backgroundColor: '#FDFAF3',
      color: type === 'success' ? '#2D5A2E' : '#D4651F',
      border: `1px solid ${type === 'success' ? '#2D5A2E' : '#D4651F'}`,
      borderRadius: 0,
    },
  })
}

// ─── Loader ──────────────────────────────────────────────────────────────────

function ManweLoader() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      <div style={{ animation: 'manwe-spin 3s linear infinite' }}>
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
        LOADING ORDERS
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

// ─── Orders Page ─────────────────────────────────────────────────────────────

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [viewType, setViewType] = useState('active')
  const [filters, setFilters] = useState({
    searchQuery: '',
    orderStatus: '',
    startDate: '',
    endDate: '',
  })

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'paid')       // Only show paid orders
        .order('created_at', { ascending: false })

      if (viewType === 'archived') {
        query = query.eq('order_status', 'delivered')
      } else {
        query = query.neq('order_status', 'delivered')
      }

      if (filters.orderStatus && viewType !== 'archived') {
        query = query.eq('order_status', filters.orderStatus)
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate + 'T23:59:59')
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      let filtered = data || []
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase()
        filtered = filtered.filter((o) =>
          o.order_id?.toLowerCase().includes(q) ||
          o.checkout_data?.firstName?.toLowerCase().includes(q) ||
          o.checkout_data?.lastName?.toLowerCase().includes(q) ||
          o.checkout_data?.email?.toLowerCase().includes(q)
        )
      }

      setOrders(filtered)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters, viewType])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const sendEmail = async (type, order) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch(`${FUNCTIONS_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ type, order }),
      })
    } catch (err) {
      console.error('Email send failed:', err)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Mark this order as ${newStatus.toUpperCase()}?`)) return

    setIsUpdating(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('order_id', orderId)
        .select()
        .single()

      if (error) throw error

      setOrders((prev) =>
        prev.map((o) => o.order_id === orderId ? { ...o, order_status: newStatus } : o)
      )
      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, order_status: newStatus }))
      }

      if (newStatus === 'shipped') await sendEmail('shipped', data)
      if (newStatus === 'delivered') await sendEmail('delivered', data)

      showToast(`ORDER MARKED AS ${newStatus.toUpperCase()}`)
    } catch (err) {
      console.error(err)
      showToast('FAILED TO UPDATE STATUS', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddNote = async () => {
    if (!selectedOrder || !noteContent.trim()) {
      showToast('NOTE CANNOT BE EMPTY', 'error')
      return
    }

    setIsUpdating(true)
    try {
      const updatedNotes = [...(selectedOrder.notes || []), noteContent]
      const { error } = await supabase
        .from('orders')
        .update({ notes: updatedNotes })
        .eq('order_id', selectedOrder.order_id)

      if (error) throw error

      setSelectedOrder((prev) => ({ ...prev, notes: updatedNotes }))
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === selectedOrder.order_id ? { ...o, notes: updatedNotes } : o
        )
      )
      setNoteContent('')
      showToast('NOTE ADDED')
    } catch (err) {
      console.error(err)
      showToast('FAILED TO ADD NOTE', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Permanently delete order ${orderId}?`)) return

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('order_id', orderId)

      if (error) throw error

      setOrders((prev) => prev.filter((o) => o.order_id !== orderId))
      if (selectedOrder?.order_id === orderId) {
        setIsModalOpen(false)
        setSelectedOrder(null)
      }
      showToast(`ORDER ${orderId} DELETED`)
    } catch (err) {
      console.error(err)
      showToast('FAILED TO DELETE ORDER', 'error')
    }
  }

  if (loading) return <ManweLoader />

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 p-6"
        style={{ backgroundColor: '#F4EFE6' }}
      >
        <ManweBeastEmblem size={64} opacity={0.5} />
        <p
          className="text-[#D4651F]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '16px',
            letterSpacing: '0.3em',
          }}
        >
          {error}
        </p>
        <button
          onClick={fetchOrders}
          className="border border-[#1A1A18] px-6 py-3 hover:bg-[#1A1A18] hover:text-[#F4EFE6] transition-all"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '13px',
            letterSpacing: '0.35em',
          }}
        >
          TRY AGAIN
        </button>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen pt-24 pb-16 relative overflow-hidden"
      style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={500} opacity={0.03} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <div className="mb-8">
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
              THE TRIBE PIECES
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
              ORDERS
            </ManweGradientText>
          </h1>

          <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em] mt-2">
            {orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'} · {viewType.toUpperCase()}
          </p>
        </div>

        {/* ── Filters ── */}
        <div
          className="relative border border-[#D9D2C4] p-5 mb-6"
          style={{ backgroundColor: '#FDFAF3' }}
        >
          <SectionLabel>FILTER</SectionLabel>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div
              className="flex items-center gap-2 border border-[#D9D2C4] px-3 py-2"
              style={{ backgroundColor: '#F4EFE6' }}
            >
              <Search size={14} className="text-[#8B8577]" />
              <input
                type="text"
                placeholder="Search ID, name, email"
                value={filters.searchQuery}
                onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
                className="flex-1 bg-transparent outline-none text-[#1A1A18] placeholder:text-[#B5AE9E]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                }}
              />
            </div>

            {/* Status */}
            <select
              value={filters.orderStatus}
              onChange={(e) => setFilters((p) => ({ ...p, orderStatus: e.target.value }))}
              disabled={viewType === 'archived'}
              className="border border-[#D9D2C4] px-3 py-2 text-[#1A1A18] outline-none focus:border-[#1A1A18] transition-colors appearance-none disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: '#F4EFE6',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '13px',
                letterSpacing: '0.15em',
              }}
            >
              <option value="">ALL STATUSES</option>
              <option value="confirmed">CONFIRMED</option>
              <option value="shipped">SHIPPED</option>
              <option value="delivered">DELIVERED</option>
            </select>

            {/* Dates */}
            <div className="flex items-center gap-2 border border-[#D9D2C4] px-3 py-2" style={{ backgroundColor: '#F4EFE6' }}>
              <Calendar size={14} className="text-[#8B8577]" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                className="flex-1 bg-transparent outline-none text-[#1A1A18]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px' }}
              />
            </div>
            <div className="flex items-center gap-2 border border-[#D9D2C4] px-3 py-2" style={{ backgroundColor: '#F4EFE6' }}>
              <Calendar size={14} className="text-[#8B8577]" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                className="flex-1 bg-transparent outline-none text-[#1A1A18]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px' }}
              />
            </div>
          </div>

          <button
            onClick={() => setFilters({ searchQuery: '', orderStatus: '', startDate: '', endDate: '' })}
            className="mt-4 text-[#6B6558] hover:text-[#D4651F] transition-colors"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.3em',
            }}
          >
            × CLEAR FILTERS
          </button>
        </div>

        {/* ── View Toggle ── */}
        <div className="flex gap-2 mb-6">
          {['active', 'archived'].map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`relative border px-5 py-2 transition-all ${
                viewType === type
                  ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F4EFE6]'
                  : 'border-[#D9D2C4] text-[#6B6558] hover:border-[#1A1A18]'
              }`}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.35em',
              }}
            >
              {type === 'active' ? 'ACTIVE' : 'ARCHIVED'}
            </button>
          ))}
        </div>

        {/* ── Orders Grid ── */}
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="relative border border-[#D9D2C4] hover:border-[#1A1A18] p-5 transition-all"
                style={{ backgroundColor: '#FDFAF3' }}
              >
                <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} /></span>
                <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={1} /></span>
                <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={1} /></span>
                <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={1} /></span>

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                      ORDER ID
                    </p>
                    <p
                      className="text-[#1A1A18] break-all"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '14px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {order.order_id}
                    </p>
                  </div>
                  <StatusBadge status={order.order_status} />
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em]">
                      CUSTOMER
                    </p>
                    <p
                      className="text-[#1A1A18]"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '15px',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {order.checkout_data.firstName?.toUpperCase()}{' '}
                      {order.checkout_data.lastName?.toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between pt-3 border-t border-[#D9D2C4]">
                    <ManweGradientText fontSize="22px" letterSpacing="0.02em">
                      ₦{order.total.toLocaleString()}
                    </ManweGradientText>
                    <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em]">
                      {format(new Date(order.created_at), 'MMM d')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D9D2C4]">
                  <button
                    onClick={() => handleDeleteOrder(order.order_id)}
                    className="p-2 text-[#8B8577] hover:text-[#D4651F] transition-colors"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                  <button
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true) }}
                    className="flex items-center gap-2 border border-[#1A1A18]/30 hover:border-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F4EFE6] px-4 py-1.5 transition-all"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '0.3em',
                    }}
                  >
                    <Eye size={12} />
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="relative border border-[#D9D2C4] p-12 flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: '#FDFAF3' }}
          >
            <ManweBeastEmblem size={64} opacity={0.3} />
            <p
              className="text-[#8B8577]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '15px',
                letterSpacing: '0.35em',
              }}
            >
              NO ORDERS FOUND
            </p>
          </div>
        )}

        {/* Bottom flag strip */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <FlagStrip className="w-24 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">
            NGR × CIV
          </span>
          <FlagStrip className="w-24 h-0.5" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ORDER DETAIL MODAL                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 pb-8 overflow-y-auto"
          style={{ backgroundColor: 'rgba(26, 26, 24, 0.6)', backdropFilter: 'blur(6px)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl border border-[#1A1A18]"
            style={{ backgroundColor: '#FDFAF3' }}
          >
            <span className="absolute -top-1 -left-1"><AdinkraDiamond size={8} fill="#2D5A2E" opacity={1} /></span>
            <span className="absolute -top-1 -right-1"><AdinkraDiamond size={8} fill="#D4651F" opacity={1} /></span>
            <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={8} fill="#D4651F" opacity={1} /></span>
            <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={8} fill="#2D5A2E" opacity={1} /></span>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9D2C4]">
              <div>
                <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                  ORDER
                </p>
                <p
                  className="text-[#1A1A18]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '16px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {selectedOrder.order_id}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6B6558] hover:text-[#1A1A18] transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Customer */}
              <div>
                <SectionLabel>CUSTOMER</SectionLabel>
                <div className="border-l-2 border-[#2D5A2E] pl-4 space-y-1">
                  <p
                    className="text-[#1A1A18]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '16px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {selectedOrder.checkout_data.firstName?.toUpperCase()}{' '}
                    {selectedOrder.checkout_data.lastName?.toUpperCase()}
                  </p>
                  <p className="font-mono text-[#6B6558] text-xs">
                    {selectedOrder.checkout_data.email}
                  </p>
                  <p className="font-mono text-[#6B6558] text-xs">
                    {selectedOrder.checkout_data.phone}
                  </p>
                  <p className="text-[#6B6558] text-sm leading-relaxed pt-2">
                    {selectedOrder.checkout_data.address}, {selectedOrder.checkout_data.city},{' '}
                    {selectedOrder.checkout_data.state}, {selectedOrder.checkout_data.country || 'Nigeria'}
                  </p>
                </div>
              </div>

              {/* Pieces */}
              <div>
                <SectionLabel>PIECES</SectionLabel>
                <div className="space-y-3">
                  {selectedOrder.cart_items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border border-[#D9D2C4] p-3"
                      style={{ backgroundColor: '#F4EFE6' }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-contain border border-[#D9D2C4]"
                        style={{ backgroundColor: '#FDFAF3' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[#1A1A18] mb-1"
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: '14px',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {item.name.toUpperCase()}
                        </p>
                        <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em]">
                          SIZE {item.size} · QTY {item.quantity}
                        </p>
                      </div>
                      <p
                        className="text-[#1A1A18] shrink-0"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '14px',
                        }}
                      >
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.special_instructions && (
                <div>
                  <SectionLabel>INSTRUCTIONS</SectionLabel>
                  <p className="text-[#6B6558] text-sm leading-relaxed italic pl-3 border-l-2 border-[#D4651F]">
                    {selectedOrder.special_instructions}
                  </p>
                </div>
              )}

              {/* Summary */}
              <div className="flex items-center justify-between border-t border-[#D9D2C4] pt-4">
                <div className="flex items-center gap-3">
                  <StatusBadge status={selectedOrder.order_status} />
                </div>
                <div className="text-right">
                  <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                    TOTAL
                  </p>
                  <ManweGradientText fontSize="26px" letterSpacing="0.02em">
                    ₦{selectedOrder.total.toLocaleString()}
                  </ManweGradientText>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <SectionLabel>UPDATE STATUS</SectionLabel>
                <div className="flex flex-wrap gap-3">
                  {selectedOrder.order_status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.order_id, 'shipped')}
                      disabled={isUpdating}
                      className="flex items-center gap-2 border border-[#D4651F] hover:bg-[#D4651F] hover:text-[#F4EFE6] px-5 py-2.5 transition-all disabled:opacity-50"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '12px',
                        letterSpacing: '0.3em',
                        color: '#D4651F',
                      }}
                    >
                      {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Truck size={12} />}
                      MARK AS SHIPPED
                    </button>
                  )}
                  {selectedOrder.order_status === 'shipped' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.order_id, 'delivered')}
                      disabled={isUpdating}
                      className="flex items-center gap-2 border border-[#2D5A2E] hover:bg-[#2D5A2E] hover:text-[#F4EFE6] px-5 py-2.5 transition-all disabled:opacity-50"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '12px',
                        letterSpacing: '0.3em',
                        color: '#2D5A2E',
                      }}
                    >
                      {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Archive size={12} />}
                      MARK AS DELIVERED
                    </button>
                  )}
                  {selectedOrder.order_status === 'delivered' && (
                    <div
                      className="border border-[#2D5A2E] bg-[#2D5A2E] text-[#F4EFE6] px-5 py-2.5 flex items-center gap-2"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '12px',
                        letterSpacing: '0.3em',
                      }}
                    >
                      <CheckCircle size={12} />
                      DELIVERED ✓
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <SectionLabel>NOTES</SectionLabel>

                <div
                  className="border border-[#D9D2C4] p-3 max-h-32 overflow-y-auto mb-3 space-y-1"
                  style={{ backgroundColor: '#F4EFE6' }}
                >
                  {selectedOrder.notes?.length > 0 ? (
                    selectedOrder.notes.map((note, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-[#6B6558]">
                        <AdinkraDiamond size={4} fill="#D4651F" opacity={0.8} />
                        <span>{note}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#8B8577] text-sm italic">No notes yet.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-3 py-2 text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors"
                    style={{
                      backgroundColor: '#F4EFE6',
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '13px',
                      letterSpacing: '0.1em',
                    }}
                    disabled={isUpdating}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={isUpdating}
                    className="border border-[#1A1A18] bg-[#1A1A18] hover:bg-[#D4651F] hover:border-[#D4651F] text-[#F4EFE6] px-3 py-2 transition-all disabled:opacity-50"
                    aria-label="Add note"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}