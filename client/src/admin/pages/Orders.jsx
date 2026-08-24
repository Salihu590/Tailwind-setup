// Orders.jsx — MANWE Admin · UI/UX Improved
import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns'
import {
  Eye, Plus, Package, CheckCircle, Truck, Archive, Trash,
  Calendar, Loader2, MapPin, Phone, Mail, Clock, MessageSquare,
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import SearchInput from '../components/ui/SearchInput'
import { SkeletonGrid } from '../components/ui/Skeleton'

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL

// ─── Design Primitives ───────────────────────────────────────────────────────

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

// ─── Status utilities ────────────────────────────────────────────────────────

const STATUS_META = {
  confirmed: { label: 'CONFIRMED', color: '#4A8C4D', icon: CheckCircle },
  shipped:   { label: 'SHIPPED',   color: '#D4651F', icon: Truck },
  delivered: { label: 'DELIVERED', color: '#2D5A2E', icon: Archive },
}

function StatusBadge({ status, size = 'md' }) {
  const meta = STATUS_META[status] || {
    label: String(status || 'UNKNOWN').toUpperCase(),
    color: '#8B8577',
    icon: Package,
  }
  const Icon = meta.icon

  const sizes = {
    sm: { padding: '2px 6px', fontSize: '9px', iconSize: 10 },
    md: { padding: '4px 10px', fontSize: '10px', iconSize: 11 },
  }
  const sz = sizes[size]

  return (
    <span
      className="inline-flex items-center gap-1.5 border"
      style={{
        borderColor: meta.color,
        color: meta.color,
        padding: sz.padding,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: sz.fontSize,
        letterSpacing: '0.3em',
      }}
    >
      <Icon size={sz.iconSize} />
      {meta.label}
    </span>
  )
}

// ─── Order Timeline ──────────────────────────────────────────────────────────

function OrderTimeline({ order }) {
  const steps = [
    { key: 'confirmed', label: 'ORDER CONFIRMED', icon: CheckCircle, date: order.created_at },
    { key: 'shipped',   label: 'SHIPPED',         icon: Truck,       date: order.shipped_at },
    { key: 'delivered', label: 'DELIVERED',       icon: Archive,     date: order.delivered_at },
  ]

  const currentIndex = steps.findIndex((s) => s.key === order.order_status)

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const isDone = i <= currentIndex
        const isCurrent = i === currentIndex
        const StepIcon = step.icon

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 border flex items-center justify-center transition-all ${
                  isDone ? 'border-current' : 'border-[#D9D2C4]'
                }`}
                style={{
                  color: isDone ? (isCurrent ? '#D4651F' : '#2D5A2E') : '#B5AE9E',
                  backgroundColor: isDone ? '#F4EFE6' : 'transparent',
                }}
              >
                <StepIcon size={14} />
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-px h-8 mt-1"
                  style={{
                    backgroundColor: i < currentIndex ? '#2D5A2E' : '#D9D2C4',
                  }}
                />
              )}
            </div>

            <div className="flex-1 pt-1">
              <p
                className={isDone ? 'text-[#1A1A18]' : 'text-[#B5AE9E]'}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '12px',
                  letterSpacing: '0.25em',
                }}
              >
                {step.label}
              </p>
              {isDone && step.date && (
                <p className="font-mono text-[#8B8577] text-[10px] tracking-wider mt-0.5">
                  {format(new Date(step.date), 'MMM d, yyyy · h:mm a')}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return '—'
  try {
    const d = typeof value === 'string' ? parseISO(value) : new Date(value)
    if (!isValid(d)) return '—'
    return format(d, 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

function formatRelative(value) {
  if (!value) return '—'
  try {
    const d = typeof value === 'string' ? parseISO(value) : new Date(value)
    if (!isValid(d)) return '—'
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return '—'
  }
}

const showToast = (message, type = 'success') => {
  toast[type](message, {
    position: 'bottom-right',
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
        .eq('payment_status', 'paid')
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

      setOrders(data || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      const msg = (err?.message || '').toLowerCase()
      setError(
        msg.includes('permission') || msg.includes('row-level security') || msg.includes('jwt')
          ? 'ACCESS DENIED — CHECK ADMIN ROLE OR ORDERS RLS'
          : 'FAILED TO LOAD ORDERS. PLEASE TRY AGAIN.'
      )
    } finally {
      setLoading(false)
    }
  }, [viewType, filters.orderStatus, filters.startDate, filters.endDate])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Client-side search
  const filteredOrders = useMemo(() => {
    if (!filters.searchQuery.trim()) return orders
    const q = filters.searchQuery.toLowerCase().trim()
    return orders.filter((o) => {
      const cd = o.checkout_data || {}
      return (
        o.order_id?.toLowerCase().includes(q) ||
        cd.firstName?.toLowerCase().includes(q) ||
        cd.lastName?.toLowerCase().includes(q) ||
        cd.email?.toLowerCase().includes(q) ||
        cd.phone?.toLowerCase().includes(q)
      )
    })
  }, [orders, filters.searchQuery])

  const hasActiveFilters =
    filters.searchQuery || filters.orderStatus || filters.startDate || filters.endDate

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
      const updateData = { order_status: newStatus }
      if (newStatus === 'shipped') updateData.shipped_at = new Date().toISOString()
      if (newStatus === 'delivered') updateData.delivered_at = new Date().toISOString()

      const { data, error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('order_id', orderId)
        .select()
        .single()

      if (updateError) throw updateError

      setOrders((prev) =>
        prev.map((o) => o.order_id === orderId ? { ...o, ...updateData } : o)
      )
      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, ...updateData }))
      }

      if (newStatus === 'shipped') await sendEmail('shipped', data)
      if (newStatus === 'delivered') await sendEmail('delivered', data)

      showToast(`ORDER ${newStatus.toUpperCase()}`)
    } catch (err) {
      console.error(err)
      showToast('FAILED TO UPDATE STATUS', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddNote = async () => {
    if (!selectedOrder || !noteContent.trim()) return

    setIsUpdating(true)
    try {
      const newNote = {
        text: noteContent.trim(),
        created_at: new Date().toISOString(),
      }
      
      // Support both old (string) and new (object) note formats
      const existingNotes = (selectedOrder.notes || []).map((n) =>
        typeof n === 'string' ? { text: n, created_at: null } : n
      )
      const updatedNotes = [...existingNotes, newNote]

      const { error: updateError } = await supabase
        .from('orders')
        .update({ notes: updatedNotes })
        .eq('order_id', selectedOrder.order_id)

      if (updateError) throw updateError

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
    if (!window.confirm(`Permanently delete order ${orderId}?\n\nThis cannot be undone.`)) return

    try {
      const { error: delError } = await supabase.from('orders').delete().eq('order_id', orderId)
      if (delError) throw delError

      setOrders((prev) => prev.filter((o) => o.order_id !== orderId))
      if (selectedOrder?.order_id === orderId) {
        setIsModalOpen(false)
        setSelectedOrder(null)
      }
      showToast('ORDER DELETED')
    } catch (err) {
      console.error(err)
      showToast('FAILED TO DELETE ORDER', 'error')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
    setNoteContent('')
  }

  const clearFilters = () => {
    setFilters({ searchQuery: '', orderStatus: '', startDate: '', endDate: '' })
  }

  return (
    <div
      className="min-h-screen pt-8 pb-16 relative overflow-hidden"
      style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-px bg-[#2D5A2E]" />
              <AdinkraDiamond size={6} fill="#D4651F" />
              <span
                className="text-[#2D5A2E]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.4em' }}
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
              <ManweGradientText fontSize="clamp(32px, 5vw, 48px)">
                ORDERS
              </ManweGradientText>
            </h1>

            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em] mt-2">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'ORDER' : 'ORDERS'}
              {hasActiveFilters && orders.length !== filteredOrders.length && ` OF ${orders.length}`}
              {' · '}{viewType.toUpperCase()}
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={fetchOrders}
            loading={loading}
            withDiamonds
          >
            REFRESH
          </Button>
        </div>

        {/* View toggle tabs */}
        <div className="flex gap-0 mb-6 border-b border-[#D9D2C4]">
          {[
            { key: 'active', label: 'ACTIVE ORDERS' },
            { key: 'archived', label: 'ARCHIVED' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setViewType(tab.key)}
              className={`relative px-6 py-3 transition-all ${
                viewType === tab.key
                  ? 'text-[#1A1A18]'
                  : 'text-[#8B8577] hover:text-[#1A1A18]'
              }`}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.35em',
              }}
            >
              {tab.label}
              {viewType === tab.key && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#D4651F' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div
          className="relative border border-[#D9D2C4] p-5 mb-6"
          style={{ backgroundColor: '#FDFAF3' }}
        >
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>FILTER</SectionLabel>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                × CLEAR ALL
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <SearchInput
              value={filters.searchQuery}
              onChange={(v) => setFilters((p) => ({ ...p, searchQuery: v }))}
              placeholder="Search ID, name, email, phone"
            />

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
            </select>

            <div className="flex items-center gap-2 border border-[#D9D2C4] px-3 py-2" style={{ backgroundColor: '#F4EFE6' }}>
              <Calendar size={14} className="text-[#8B8577] shrink-0" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                className="flex-1 bg-transparent outline-none text-[#1A1A18] min-w-0"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px' }}
              />
            </div>
            <div className="flex items-center gap-2 border border-[#D9D2C4] px-3 py-2" style={{ backgroundColor: '#F4EFE6' }}>
              <Calendar size={14} className="text-[#8B8577] shrink-0" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                className="flex-1 bg-transparent outline-none text-[#1A1A18] min-w-0"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px' }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <EmptyState
            title="SOMETHING WENT WRONG"
            message={error}
            actionLabel="TRY AGAIN"
            onAction={fetchOrders}
          />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'NO MATCHING ORDERS' : 'NO ORDERS YET'}
            message={
              hasActiveFilters
                ? 'Try adjusting your filters or clearing them to see all orders.'
                : viewType === 'archived'
                ? 'Delivered orders will appear here.'
                : 'When customers place orders, they will show up here.'
            }
            actionLabel={hasActiveFilters ? 'CLEAR FILTERS' : null}
            onAction={hasActiveFilters ? clearFilters : null}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const cd = order.checkout_data || {}
              const total = Number(order.total) || 0
              const itemCount = Array.isArray(order.cart_items)
                ? order.cart_items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
                : 0

              return (
                <div
                  key={order.order_id}
                  className="group relative border border-[#D9D2C4] hover:border-[#1A1A18] p-5 transition-all cursor-pointer"
                  style={{ backgroundColor: '#FDFAF3' }}
                  onClick={() => {
                    setSelectedOrder(order)
                    setIsModalOpen(true)
                  }}
                >
                  <span className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AdinkraDiamond size={6} fill="#2D5A2E" />
                  </span>
                  <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AdinkraDiamond size={6} fill="#D4651F" />
                  </span>
                  <span className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AdinkraDiamond size={6} fill="#D4651F" />
                  </span>
                  <span className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AdinkraDiamond size={6} fill="#2D5A2E" />
                  </span>

                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                        ORDER ID
                      </p>
                      <p
                        className="text-[#1A1A18] truncate"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '14px',
                          letterSpacing: '0.05em',
                        }}
                        title={order.order_id}
                      >
                        {order.order_id}
                      </p>
                    </div>
                    <StatusBadge status={order.order_status} size="sm" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p
                        className="text-[#1A1A18] truncate"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '15px',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {(cd.firstName || 'UNKNOWN').toUpperCase()}{' '}
                        {(cd.lastName || '').toUpperCase()}
                      </p>
                      <p className="font-mono text-[#8B8577] text-[10px] tracking-wider truncate mt-0.5">
                        {cd.email || 'No email'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono text-[#8B8577] tracking-wider">
                      <span className="flex items-center gap-1">
                        <Package size={10} />
                        {itemCount} {itemCount === 1 ? 'PIECE' : 'PIECES'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatRelative(order.created_at)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-3 border-t border-[#D9D2C4]">
                      <ManweGradientText fontSize="22px" letterSpacing="0.02em">
                        ₦{total.toLocaleString()}
                      </ManweGradientText>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteOrder(order.order_id)
                          }}
                          className="p-2 text-[#8B8577] hover:text-[#D4651F] transition-colors"
                          title="Delete"
                          aria-label="Delete order"
                        >
                          <Trash size={14} />
                        </button>
                        <Eye size={14} className="text-[#8B8577] group-hover:text-[#1A1A18] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedOrder?.order_id}
        subtitle="ORDER"
        maxWidth="max-w-3xl"
      >
        {selectedOrder && (
          <div className="p-6 space-y-6">
            {/* Timeline */}
            <div>
              <SectionLabel>TIMELINE</SectionLabel>
              <OrderTimeline order={selectedOrder} />
            </div>

            {/* Customer */}
            <div>
              <SectionLabel>CUSTOMER</SectionLabel>
              <div className="border-l-2 border-[#2D5A2E] pl-4 space-y-2">
                <p
                  className="text-[#1A1A18]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '16px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {(selectedOrder.checkout_data?.firstName || 'UNKNOWN').toUpperCase()}{' '}
                  {(selectedOrder.checkout_data?.lastName || '').toUpperCase()}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6B6558]">
                  <a
                    href={`mailto:${selectedOrder.checkout_data?.email || ''}`}
                    className="flex items-center gap-2 hover:text-[#1A1A18] font-mono"
                  >
                    <Mail size={12} className="text-[#8B8577]" />
                    {selectedOrder.checkout_data?.email || 'No email'}
                  </a>
                  <a
                    href={`tel:${selectedOrder.checkout_data?.phone || ''}`}
                    className="flex items-center gap-2 hover:text-[#1A1A18] font-mono"
                  >
                    <Phone size={12} className="text-[#8B8577]" />
                    {selectedOrder.checkout_data?.phone || 'No phone'}
                  </a>
                </div>

                <div className="flex items-start gap-2 text-[#6B6558] text-sm pt-2">
                  <MapPin size={14} className="text-[#8B8577] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {selectedOrder.checkout_data?.address}, {selectedOrder.checkout_data?.city}, {selectedOrder.checkout_data?.state}, {selectedOrder.checkout_data?.country || 'Nigeria'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pieces */}
            <div>
              <SectionLabel>PIECES ({Array.isArray(selectedOrder.cart_items) ? selectedOrder.cart_items.length : 0})</SectionLabel>
              <div className="space-y-3">
                {(Array.isArray(selectedOrder.cart_items) ? selectedOrder.cart_items : []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border border-[#D9D2C4] p-3 hover:border-[#1A1A18] transition-colors"
                    style={{ backgroundColor: '#F4EFE6' }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain border border-[#D9D2C4]"
                      style={{ backgroundColor: '#FDFAF3' }}
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[#1A1A18] mb-1 truncate"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '14px',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {(item.name || 'UNKNOWN').toUpperCase()}
                      </p>
                      <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em]">
                        SIZE {item.size} · QTY {item.quantity} · ₦{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                    <p
                      className="text-[#1A1A18] shrink-0"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '14px',
                      }}
                    >
                      ₦{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            {selectedOrder.special_instructions && (
              <div>
                <SectionLabel>INSTRUCTIONS</SectionLabel>
                <div
                  className="border-l-2 border-[#D4651F] pl-4 py-3"
                  style={{ backgroundColor: '#F4EFE6' }}
                >
                  <p className="text-[#6B6558] text-sm leading-relaxed italic">
                    "{selectedOrder.special_instructions}"
                  </p>
                </div>
              </div>
            )}

            {/* Total */}
            <div
              className="flex items-center justify-between border border-[#1A1A18] p-4"
              style={{ backgroundColor: '#F4EFE6' }}
            >
              <StatusBadge status={selectedOrder.order_status} />
              <div className="text-right">
                <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                  TOTAL
                </p>
                <ManweGradientText fontSize="26px" letterSpacing="0.02em">
                  ₦{(Number(selectedOrder.total) || 0).toLocaleString()}
                </ManweGradientText>
              </div>
            </div>

            {/* Actions */}
            <div>
              <SectionLabel>ACTIONS</SectionLabel>
              <div className="flex flex-wrap gap-3">
                {selectedOrder.order_status === 'confirmed' && (
                  <Button
                    variant="danger"
                    icon={Truck}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.order_id, 'shipped')}
                    loading={isUpdating}
                  >
                    MARK AS SHIPPED
                  </Button>
                )}
                {selectedOrder.order_status === 'shipped' && (
                  <Button
                    variant="success"
                    icon={Archive}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.order_id, 'delivered')}
                    loading={isUpdating}
                  >
                    MARK AS DELIVERED
                  </Button>
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
                    DELIVERED
                  </div>
                )}
                <Button
                  variant="ghost"
                  icon={Trash}
                  onClick={() => handleDeleteOrder(selectedOrder.order_id)}
                >
                  DELETE
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div>
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
                  NOTES
                </span>
                {selectedOrder.notes?.length > 0 && (
                  <span className="font-mono text-[#8B8577] text-[9px] tracking-wider">
                    ({selectedOrder.notes.length})
                  </span>
                )}
                <div className="flex-1 h-px bg-[#D9D2C4]" />
              </div>

              <div
                className="border border-[#D9D2C4] p-3 max-h-40 overflow-y-auto mb-3 space-y-2"
                style={{ backgroundColor: '#F4EFE6' }}
              >
                {selectedOrder.notes?.length > 0 ? (
                  selectedOrder.notes.map((note, i) => {
                    const noteObj = typeof note === 'string' ? { text: note, created_at: null } : note
                    return (
                      <div key={i} className="flex items-start gap-2 text-sm text-[#6B6558]">
                        <MessageSquare size={12} className="text-[#D4651F] shrink-0 mt-1" />
                        <div className="flex-1">
                          <p>{noteObj.text}</p>
                          {noteObj.created_at && (
                            <p className="font-mono text-[#8B8577] text-[9px] tracking-wider mt-0.5">
                              {formatRelative(noteObj.created_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })
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
                  type="button"
                  onClick={handleAddNote}
                  disabled={isUpdating || !noteContent.trim()}
                  className="border border-[#1A1A18] bg-[#1A1A18] hover:bg-[#D4651F] hover:border-[#D4651F] text-[#F4EFE6] px-4 py-2 transition-all disabled:opacity-50"
                  aria-label="Add note"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  )
}