import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { format } from 'date-fns'
import { Eye, X, Search, ShoppingBag } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
        LOADING TRIBE
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

// ─── Customers Page ──────────────────────────────────────────────────────────

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCustomers = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('checkout_data, total')

      if (fetchError) throw fetchError

      const customerMap = {}
      data.forEach((order) => {
        const email = order.checkout_data.email
        if (!customerMap[email]) {
          customerMap[email] = {
            email,
            firstName: order.checkout_data.firstName,
            lastName: order.checkout_data.lastName,
            phone: order.checkout_data.phone,
            orderCount: 0,
            totalSpent: 0,
          }
        }
        customerMap[email].orderCount += 1
        customerMap[email].totalSpent += order.total
      })

      setCustomers(
        Object.values(customerMap).sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        )
      )
    } catch (err) {
      console.error(err)
      setError('Failed to load the tribe.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerDetails = async (email) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('checkout_data->>email', email)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (!data.length) {
        showToast('MEMBER NOT FOUND', 'error')
        return
      }

      const totalSpent = data.reduce((sum, o) => sum + o.total, 0)

      setSelectedCustomer({
        firstName: data[0].checkout_data.firstName,
        lastName: data[0].checkout_data.lastName,
        email: data[0].checkout_data.email,
        phone: data[0].checkout_data.phone,
        orderCount: data.length,
        totalSpent,
        orders: data.map((o) => ({
          orderId: o.order_id,
          createdAt: o.created_at,
          total: o.total,
          orderStatus: o.order_status,
          paymentStatus: o.payment_status,
        })),
      })
      setIsModalOpen(true)
    } catch (err) {
      console.error(err)
      showToast('FAILED TO LOAD MEMBER', 'error')
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filtered = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          onClick={fetchCustomers}
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
      className="min-h-screen pt-8 pb-16 relative overflow-hidden"
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
              THE PEOPLE
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
              THE TRIBE
            </ManweGradientText>
          </h1>

          <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em] mt-2">
            {customers.length} {customers.length === 1 ? 'MEMBER' : 'MEMBERS'}
          </p>
        </div>

        {/* ── Search ── */}
        <div
          className="relative border border-[#D9D2C4] p-5 mb-6"
          style={{ backgroundColor: '#FDFAF3' }}
        >
          <SectionLabel>FIND MEMBER</SectionLabel>
          <div
            className="flex items-center gap-3 border border-[#D9D2C4] px-4 py-3"
            style={{ backgroundColor: '#F4EFE6' }}
          >
            <Search size={16} className="text-[#8B8577]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email"
              className="flex-1 bg-transparent outline-none text-[#1A1A18] placeholder:text-[#B5AE9E]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '14px',
                letterSpacing: '0.1em',
              }}
            />
          </div>
        </div>

        {/* ── Customers Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div
                key={c.email}
                className="relative border border-[#D9D2C4] hover:border-[#1A1A18] p-5 transition-all"
                style={{ backgroundColor: '#FDFAF3' }}
              >
                <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" /></span>
                <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" /></span>
                <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" /></span>
                <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" /></span>

                <div className="mb-4">
                  <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                    MEMBER
                  </p>
                  <p
                    className="text-[#1A1A18]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '18px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {c.firstName?.toUpperCase()} {c.lastName?.toUpperCase()}
                  </p>
                  <p className="font-mono text-[#6B6558] text-[10px] tracking-[0.2em] mt-1 truncate">
                    {c.email}
                  </p>
                  <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.2em]">
                    {c.phone || 'NO PHONE'}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#D9D2C4] pt-3">
                  <div>
                    <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em]">
                      PIECES
                    </p>
                    <p
                      className="text-[#1A1A18]"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '18px',
                      }}
                    >
                      {c.orderCount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em]">
                      SPENT
                    </p>
                    <ManweGradientText fontSize="18px" letterSpacing="0.02em">
                      ₦{c.totalSpent.toLocaleString()}
                    </ManweGradientText>
                  </div>
                </div>

                <button
                  onClick={() => fetchCustomerDetails(c.email)}
                  className="w-full mt-4 flex items-center justify-center gap-2 border border-[#1A1A18]/30 hover:border-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F4EFE6] px-4 py-2 transition-all"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                  }}
                >
                  <Eye size={12} />
                  VIEW HISTORY
                </button>
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
              NO MEMBERS FOUND
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
      {/* CUSTOMER MODAL                                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {isModalOpen && selectedCustomer && (
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
            <span className="absolute -top-1 -left-1"><AdinkraDiamond size={8} fill="#2D5A2E" /></span>
            <span className="absolute -top-1 -right-1"><AdinkraDiamond size={8} fill="#D4651F" /></span>
            <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={8} fill="#D4651F" /></span>
            <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={8} fill="#2D5A2E" /></span>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9D2C4]">
              <div>
                <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-1">
                  MEMBER
                </p>
                <p
                  className="text-[#1A1A18]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '18px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {selectedCustomer.firstName?.toUpperCase()}{' '}
                  {selectedCustomer.lastName?.toUpperCase()}
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

              {/* Contact */}
              <div>
                <SectionLabel>CONTACT</SectionLabel>
                <div className="border-l-2 border-[#2D5A2E] pl-4 space-y-1">
                  <p className="font-mono text-[#6B6558] text-xs">
                    {selectedCustomer.email}
                  </p>
                  <p className="font-mono text-[#6B6558] text-xs">
                    {selectedCustomer.phone || 'No phone'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="relative border border-[#D9D2C4] p-4"
                  style={{ backgroundColor: '#F4EFE6' }}
                >
                  <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-2">
                    PIECES
                  </p>
                  <p
                    className="text-[#1A1A18]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '32px',
                    }}
                  >
                    {selectedCustomer.orderCount}
                  </p>
                </div>
                <div
                  className="relative border border-[#D9D2C4] p-4"
                  style={{ backgroundColor: '#F4EFE6' }}
                >
                  <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em] mb-2">
                    TOTAL SPENT
                  </p>
                  <ManweGradientText fontSize="28px" letterSpacing="0.02em">
                    ₦{selectedCustomer.totalSpent.toLocaleString()}
                  </ManweGradientText>
                </div>
              </div>

              {/* Order History */}
              <div>
                <SectionLabel>ORDER HISTORY</SectionLabel>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {selectedCustomer.orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="border border-[#D9D2C4] p-3"
                      style={{ backgroundColor: '#F4EFE6' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p
                          className="text-[#1A1A18] break-all"
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {order.orderId}
                        </p>
                        <span
                          className="border px-2 py-0.5 shrink-0 ml-2"
                          style={{
                            borderColor: order.paymentStatus === 'paid' ? '#2D5A2E' : '#D4651F',
                            color: order.paymentStatus === 'paid' ? '#2D5A2E' : '#D4651F',
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: '9px',
                            letterSpacing: '0.3em',
                          }}
                        >
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#D9D2C4]">
                        <div>
                          <p className="font-mono text-[#8B8577] text-[9px] tracking-[0.3em]">
                            {format(new Date(order.createdAt), 'MMM d, yyyy')}
                          </p>
                          <p className="font-mono text-[#6B6558] text-[10px] tracking-[0.25em] capitalize mt-0.5">
                            {order.orderStatus}
                          </p>
                        </div>
                        <ManweGradientText fontSize="18px" letterSpacing="0.02em">
                          ₦{order.total.toLocaleString()}
                        </ManweGradientText>
                      </div>
                    </div>
                  ))}
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