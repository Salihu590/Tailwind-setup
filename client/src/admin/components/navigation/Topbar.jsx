// Topbar.jsx — MANWE Admin Console navigation
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  TrendingUp,
  Bell,
  LogOut,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'

// ─── Design primitives ───────────────────────────────────────────────────────

function ManweBeastEmblem({ size = 32, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }} aria-hidden>
      <path
        d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40"
        stroke="#2D5A2E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40"
        stroke="#D4651F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M30 40 L35 55 L40 35 L45 55 L50 40"
        stroke="#1A1A18"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#1A1A18" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#2D5A2E" />
      <circle cx="44" cy="28" r="1.5" fill="#D4651F" />
      <path
        d="M37 18 L40 8 L43 18"
        stroke="#1A1A18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="40" y1="55" x2="40" y2="70" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="#1A1A18" opacity="0.7" />
    </svg>
  )
}

function AdinkraDiamond({ size = 6, fill = '#D4651F', opacity = 0.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }} aria-hidden>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  )
}

function ManweGradientText({ children, fontSize = '18px', letterSpacing = '0.2em' }) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
        lineHeight: 1,
        background:
          'linear-gradient(135deg, #2D5A2E 0%, #4A8C4D 25%, #1A1A18 50%, #D4651F 75%, #C4541A 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}

// ─── Nav config ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'DASHBOARD', end: true },
  { to: '/admin/orders', icon: FileText, label: 'ORDERS' },
  { to: '/admin/customers', icon: Users, label: 'CUSTOMERS' },
  {
    to: '/admin/topproducts',
    icon: TrendingUp,
    label: 'PIECES',
    // match common alternate slugs without breaking routing
    matchAlso: ['/admin/top-products', '/admin/topproducts'],
  },
  { to: '/admin/newsletter', icon: Mail, label: 'NEWSLETTER' },
]

function pathIsActive(pathname, item) {
  if (item.end) return pathname === item.to
  if (pathname === item.to || pathname.startsWith(`${item.to}/`)) return true
  if (item.matchAlso?.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true
  return false
}

// ─── Topbar ──────────────────────────────────────────────────────────────────

export default function Topbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [newOrderCount, setNewOrderCount] = useState(0)
  const [markingViewed, setMarkingViewed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const toggleRef = useRef(null)

  const fetchNewOrderCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'paid')
        .eq('viewed', false)

      if (error) {
        // Column missing or RLS — fail silently for badge only
        console.warn('New order count:', error.message)
        return
      }
      setNewOrderCount(count || 0)
    } catch (err) {
      console.warn('New order count failed:', err)
    }
  }, [])

  const markOrdersAsViewed = useCallback(async () => {
    if (markingViewed) return
    setMarkingViewed(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ viewed: true })
        .eq('viewed', false)
        .eq('payment_status', 'paid')

      if (error) {
        console.warn('Mark viewed:', error.message)
        return
      }
      setNewOrderCount(0)
    } catch (err) {
      console.warn('Mark viewed failed:', err)
    } finally {
      setMarkingViewed(false)
    }
  }, [markingViewed])

  // Initial fetch + poll fallback
  useEffect(() => {
    fetchNewOrderCount()
    const interval = setInterval(fetchNewOrderCount, 30000)
    return () => clearInterval(interval)
  }, [fetchNewOrderCount])

  // Realtime: new/updated orders refresh badge
  useEffect(() => {
    const channel = supabase
      .channel('admin-orders-badge')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchNewOrderCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchNewOrderCount])

  // On Orders page, clear unviewed badge
  useEffect(() => {
    if (location.pathname.startsWith('/admin/orders') && newOrderCount > 0) {
      markOrdersAsViewed()
    }
  }, [location.pathname, newOrderCount, markOrdersAsViewed])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Escape + body scroll lock for mobile menu
  useEffect(() => {
    if (!menuOpen) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleLogout = async () => {
    setMenuOpen(false)
    if (typeof onLogout === 'function') {
      await onLogout()
      return
    }
    // Fallback if parent didn't pass onLogout
    try {
      await supabase.auth.signOut()
    } finally {
      navigate('/admin/login', { replace: true })
    }
  }

  const badgeLabel =
    newOrderCount === 0
      ? 'Orders'
      : newOrderCount === 1
        ? '1 new order'
        : `${newOrderCount > 99 ? '99+' : newOrderCount} new orders`

  return (
    <header
      className="w-full fixed top-0 left-0 right-0 z-40 border-b border-[#D9D2C4]"
      style={{ backgroundColor: '#FDFAF3' }}
    >
      {/* Flag strip */}
      <div className="w-full flex h-[3px]" aria-hidden>
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

      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[68px]">
        {/* Brand */}
        <Link
          to="/admin"
          className="flex items-center gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4651F] focus-visible:ring-offset-2"
          style={{ '--tw-ring-offset-color': '#FDFAF3' }}
        >
          <ManweBeastEmblem size={36} opacity={1} />
          <div className="flex flex-col gap-0.5">
            <ManweGradientText fontSize="20px" letterSpacing="0.18em">
              MANWE
            </ManweGradientText>
            <div className="hidden sm:flex items-center gap-1.5">
              <AdinkraDiamond size={4} fill="#2D5A2E" />
              <span
                className="text-[#2D5A2E]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '8px',
                  letterSpacing: '0.35em',
                }}
              >
                ADMIN CONSOLE
              </span>
              <AdinkraDiamond size={4} fill="#D4651F" />
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Admin">
          {NAV_ITEMS.map((item) => {
            const active = pathIsActive(location.pathname, item)
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-2 px-3 xl:px-4 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4651F] ${
                  active ? 'text-[#1A1A18]' : 'text-[#6B6558] hover:text-[#1A1A18]'
                }`}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '12px',
                  letterSpacing: '0.22em',
                }}
              >
                <Icon size={15} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                <span>{item.label}</span>
                {item.to === '/admin/orders' && newOrderCount > 0 && (
                  <span
                    className="min-w-[16px] h-4 px-1 flex items-center justify-center bg-[#D4651F] text-[#F4EFE6] text-[9px] leading-none"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {newOrderCount > 99 ? '99+' : newOrderCount}
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
                    <AdinkraDiamond size={5} fill="#D4651F" opacity={1} />
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/admin/orders"
            className="relative p-2.5 text-[#6B6558] hover:text-[#1A1A18] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4651F]"
            aria-label={badgeLabel}
            title={badgeLabel}
          >
            <Bell size={18} aria-hidden />
            {newOrderCount > 0 && (
              <span
                className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#D4651F] text-[#F4EFE6] font-bold animate-pulse"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '10px',
                }}
              >
                {newOrderCount > 99 ? '99+' : newOrderCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden lg:inline-flex items-center gap-2 border border-[#1A1A18]/30 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-4 py-2 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4651F]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '12px',
              letterSpacing: '0.25em',
            }}
          >
            <LogOut
              size={14}
              className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
              aria-hidden
            />
            <span className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors">
              LOG OUT
            </span>
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden p-2.5 text-[#1A1A18] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4651F]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-nav"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="admin-mobile-nav"
        ref={menuRef}
        className={`lg:hidden border-t border-[#D9D2C4] overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          menuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#FDFAF3' }}
        hidden={!menuOpen}
      >
        <nav className="flex flex-col p-3 gap-0.5" aria-label="Admin mobile">
          {NAV_ITEMS.map((item) => {
            const active = pathIsActive(location.pathname, item)
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3.5 border-l-2 transition-colors ${
                  active
                    ? 'border-[#D4651F] bg-[#F4EFE6] text-[#1A1A18]'
                    : 'border-transparent text-[#6B6558] hover:bg-[#F4EFE6]/60 hover:text-[#1A1A18]'
                }`}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '14px',
                  letterSpacing: '0.25em',
                }}
              >
                <Icon size={16} aria-hidden />
                <span className="flex-1">{item.label}</span>
                {item.to === '/admin/orders' && newOrderCount > 0 && (
                  <span
                    className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-[#D4651F] text-[#F4EFE6] text-[10px]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {newOrderCount > 99 ? '99+' : newOrderCount}
                  </span>
                )}
              </Link>
            )
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 mt-1 border-t border-[#D9D2C4] text-[#D4651F] hover:bg-[#F4EFE6]/50 transition-colors text-left"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '14px',
              letterSpacing: '0.25em',
            }}
          >
            <LogOut size={16} aria-hidden />
            LOG OUT
          </button>
        </nav>
      </div>
    </header>
  )
}