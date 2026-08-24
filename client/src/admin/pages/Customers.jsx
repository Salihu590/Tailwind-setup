// Customers.jsx — MANWE Admin · UI/UX Improved
import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns'
import { Eye, Mail, Phone, MapPin, Loader2, Package } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import SearchInput from '../components/ui/SearchInput'
import { SkeletonGrid } from '../components/ui/Skeleton'

// ─── Design primitives ───────────────────────────────────────────────────────
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

function FlagStrip({ className = 'w-full h-0.5' }) {
  return (
    <div className={`${className} flex`}>
      <div className="flex flex-1"><div className="flex-1 bg-[#2D5A2E]" /><div className="flex-1 bg-[#F4EFE6]" /><div className="flex-1 bg-[#2D5A2E]" /></div>
      <div className="w-px" />
      <div className="flex flex-1"><div className="flex-1 bg-[#D4651F]" /><div className="flex-1 bg-[#F4EFE6]" /><div className="flex-1 bg-[#2D5A2E]" /></div>
    </div>
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function formatDate(value) {
  if (!value) return '—'
  try {
    const d = typeof value === 'string' ? parseISO(value) : new Date(value)
    return isValid(d) ? format(d, 'MMM d, yyyy') : '—'
  } catch { return '—' }
}

const showToast = (message, type = 'success') => {
  toast[type](message, {
    position: 'bottom-right', autoClose: 3000,
    style: {
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.25em',
      backgroundColor: '#FDFAF3', color: type === 'success' ? '#2D5A2E' : '#D4651F',
      border: `1px solid ${type === 'success' ? '#2D5A2E' : '#D4651F'}`, borderRadius: 0,
    },
  })
}

function buildCustomerMap(rows = []) {
  const map = {}
  rows.forEach((order) => {
    const cd = order?.checkout_data || {}
    const email = normalizeEmail(cd.email)
    if (!email) return

    if (!map[email]) {
      map[email] = {
        email,
        firstName: cd.firstName || '',
        lastName: cd.lastName || '',
        phone: cd.phone || '',
        orderCount: 0,
        totalSpent: 0,
        lastOrderDate: order.created_at,
      }
    }
    map[email].orderCount += 1
    map[email].totalSpent += toNumber(order.total)
    
    // Update last order date if this order is newer
    if (new Date(order.created_at) > new Date(map[email].lastOrderDate)) {
      map[email].lastOrderDate = order.created_at
      if (cd.firstName) map[email].firstName = cd.firstName
      if (cd.lastName) map[email].lastName = cd.lastName
      if (cd.phone) map[email].phone = cd.phone
    }
  })
  return Object.values(map)
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent') // recent | spent | orders | az

  const fetchCustomers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('checkout_data, total, created_at')
        .eq('payment_status', 'paid')

      if (fetchError) throw fetchError
      setCustomers(buildCustomerMap(data || []))
    } catch (err) {
      console.error(err)
      setError('FAILED TO LOAD THE TRIBE')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const fetchCustomerDetails = async (email) => {
    const normalized = normalizeEmail(email)
    if (!normalized || detailLoading) return

    setDetailLoading(true)
    try {
      // Find all paid orders for this exact email
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      const rows = (data || []).filter(o => normalizeEmail(o?.checkout_data?.email) === normalized)

      if (!rows.length) {
        showToast('MEMBER NOT FOUND', 'error')
        return
      }

      const first = rows[0].checkout_data || {}
      const totalSpent = rows.reduce((sum, o) => sum + toNumber(o.total), 0)

      setSelectedCustomer({
        firstName: first.firstName || '',
        lastName: first.lastName || '',
        email: normalized,
        phone: first.phone || '',
        address: first.address,
        city: first.city,
        state: first.state,
        country: first.country || 'Nigeria',
        orderCount: rows.length,
        totalSpent,
        orders: rows.map((o) => ({
          orderId: o.order_id || o.id,
          createdAt: o.created_at,
          total: toNumber(o.total),
          orderStatus: o.order_status || 'unknown',
        })),
      })
      setIsModalOpen(true)
    } catch (err) {
      console.error(err)
      showToast('FAILED TO LOAD DETAILS', 'error')
    } finally {
      setDetailLoading(false)
    }
  }

  // ─── Filter & Sort ───
  const processedCustomers = useMemo(() => {
    let result = [...customers]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(c => {
        const name = `${c.firstName} ${c.lastName}`.toLowerCase()
        return name.includes(q) || c.email.includes(q) || (c.phone || '').includes(q)
      })
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent
      if (sortBy === 'orders') return b.orderCount - a.orderCount
      if (sortBy === 'az') return a.firstName.localeCompare(b.firstName)
      // default: recent
      return new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
    })

    return result
  }, [customers, searchQuery, sortBy])

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
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-px bg-[#2D5A2E]" /><AdinkraDiamond size={6} fill="#D4651F" />
              <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.4em' }}>
                THE PEOPLE
              </span>
              <AdinkraDiamond size={6} fill="#D4651F" /><div className="w-4 h-px bg-[#D4651F]" />
            </div>

            <h1 className="leading-none mb-2">
              <ManweGradientText fontSize="clamp(32px, 5vw, 48px)">THE TRIBE</ManweGradientText>
            </h1>
            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em] mt-2">
              {customers.length} {customers.length === 1 ? 'MEMBER' : 'MEMBERS'}
              {searchQuery.trim() ? ` · SHOWING ${processedCustomers.length}` : ''}
            </p>
          </div>
          <Button variant="secondary" onClick={() => fetchCustomers(true)} loading={refreshing || loading} withDiamonds>
            REFRESH
          </Button>
        </div>

        {/* Search & Sort */}
        <div className="relative border border-[#D9D2C4] p-5 mb-6" style={{ backgroundColor: '#FDFAF3' }}>
          <SectionLabel>FIND & SORT</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, email, or phone"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#D9D2C4] px-4 py-2 text-[#1A1A18] outline-none focus:border-[#1A1A18] transition-colors appearance-none cursor-pointer"
              style={{ backgroundColor: '#F4EFE6', fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.15em' }}
            >
              <option value="recent">SORT: MOST RECENT</option>
              <option value="spent">SORT: TOP SPENDERS</option>
              <option value="orders">SORT: MOST ORDERS</option>
              <option value="az">SORT: A-Z</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <EmptyState title="SOMETHING WENT WRONG" message={error} actionLabel="TRY AGAIN" onAction={fetchCustomers} />
        ) : processedCustomers.length === 0 ? (
          <EmptyState
            title="NO MEMBERS FOUND"
            message={searchQuery ? "Try adjusting your search criteria." : "When customers check out, they will appear here."}
            actionLabel={searchQuery ? "CLEAR SEARCH" : null}
            onAction={searchQuery ? () => setSearchQuery('') : null}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {processedCustomers.map((c) => (
              <div
                key={c.email}
                onClick={() => fetchCustomerDetails(c.email)}
                className="group relative border border-[#D9D2C4] hover:border-[#1A1A18] hover:shadow-sm p-5 transition-all cursor-pointer"
                style={{ backgroundColor: '#FDFAF3' }}
              >
                <span className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity"><AdinkraDiamond size={6} fill="#2D5A2E" /></span>
                <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"><AdinkraDiamond size={6} fill="#D4651F" /></span>
                <span className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity"><AdinkraDiamond size={6} fill="#D4651F" /></span>
                <span className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"><AdinkraDiamond size={6} fill="#2D5A2E" /></span>

                <div className="mb-4">
                  <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">MEMBER</p>
                  <p
                    className="text-[#1A1A18] truncate"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.08em' }}
                  >
                    {(c.firstName || 'UNKNOWN').toUpperCase()} {(c.lastName || '').toUpperCase()}
                  </p>
                  <p className="font-mono text-[#6B6558] text-[10px] tracking-[0.2em] mt-1 truncate">{c.email}</p>
                </div>

                <div className="flex items-center justify-between border-t border-[#D9D2C4] pt-3">
                  <div>
                    <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em]">ORDERS</p>
                    <p className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px' }}>
                      {c.orderCount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em]">SPENT</p>
                    <ManweGradientText fontSize="18px" letterSpacing="0.02em">
                      ₦{c.totalSpent.toLocaleString()}
                    </ManweGradientText>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D9D2C4] flex items-center justify-between">
                  <p className="font-mono text-[#B5AE9E] text-[9px] tracking-widest">
                    LAST: {formatDistanceToNow(new Date(c.lastOrderDate), { addSuffix: true }).toUpperCase()}
                  </p>
                  <Eye size={14} className="text-[#8B8577] group-hover:text-[#1A1A18] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-3">
          <FlagStrip className="w-24 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
          <FlagStrip className="w-24 h-0.5" />
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${(selectedCustomer?.firstName || 'UNKNOWN').toUpperCase()} ${(selectedCustomer?.lastName || '').toUpperCase()}`}
        subtitle="MEMBER PROFILE"
        maxWidth="max-w-2xl"
      >
        {selectedCustomer && (
          <div className="p-6 space-y-6">
            
            {/* Contact */}
            <div>
              <SectionLabel>CONTACT</SectionLabel>
              <div className="border-l-2 border-[#2D5A2E] pl-4 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6B6558]">
                  <a href={`mailto:${selectedCustomer.email}`} className="flex items-center gap-2 hover:text-[#1A1A18] font-mono break-all">
                    <Mail size={12} className="text-[#8B8577] shrink-0" />
                    {selectedCustomer.email}
                  </a>
                  <a href={`tel:${selectedCustomer.phone}`} className="flex items-center gap-2 hover:text-[#1A1A18] font-mono">
                    <Phone size={12} className="text-[#8B8577] shrink-0" />
                    {selectedCustomer.phone || 'No phone'}
                  </a>
                </div>
                {selectedCustomer.address && (
                  <div className="flex items-start gap-2 text-[#6B6558] text-sm pt-2">
                    <MapPin size={14} className="text-[#8B8577] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}, {selectedCustomer.country}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative border border-[#D9D2C4] p-4" style={{ backgroundColor: '#F4EFE6' }}>
                <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-2 flex items-center gap-1">
                  <Package size={10}/> TOTAL PIECES
                </p>
                <p className="text-[#1A1A18]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px' }}>
                  {selectedCustomer.orderCount}
                </p>
              </div>
              <div className="relative border border-[#D9D2C4] p-4" style={{ backgroundColor: '#F4EFE6' }}>
                <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-2">LIFETIME VALUE</p>
                <ManweGradientText fontSize="28px" letterSpacing="0.02em">
                  ₦{selectedCustomer.totalSpent.toLocaleString()}
                </ManweGradientText>
              </div>
            </div>

            {/* History */}
            <div>
              <SectionLabel>ORDER HISTORY</SectionLabel>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedCustomer.orders.map((order) => (
                  <div key={order.orderId} className="border border-[#D9D2C4] p-3" style={{ backgroundColor: '#F4EFE6' }}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[#1A1A18] break-all" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', letterSpacing: '0.05em' }}>
                        {order.orderId}
                      </p>
                      <span className="border px-2 py-0.5 shrink-0 ml-2" style={{
                        borderColor: '#2D5A2E', color: '#2D5A2E', fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', letterSpacing: '0.3em',
                      }}>
                        {String(order.orderStatus).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#D9D2C4]">
                      <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em]">
                        {formatDate(order.createdAt)}
                      </p>
                      <ManweGradientText fontSize="18px" letterSpacing="0.02em">
                        ₦{order.total.toLocaleString()}
                      </ManweGradientText>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  )
}