import { useState, useEffect } from 'react'
import { Menu, X, LayoutDashboard, FileText, Users, Mail, TrendingUp, Bell, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'

// ─── MANWE Beast Emblem ──────────────────────────────────────────────────────

function ManweBeastEmblem({ size = 32, opacity = 1 }) {
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

function AdinkraDiamond({ size = 6, fill = '#D4651F', opacity = 0.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
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

// ─── Topbar ───────────────────────────────────────────────────────────────────

export default function Topbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [newOrderCount, setNewOrderCount] = useState(0)
  const location = useLocation()

  const fetchNewOrderCount = async () => {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('viewed', false)
    setNewOrderCount(count || 0)
  }

  const markOrdersAsViewed = async () => {
    await supabase.from('orders').update({ viewed: true }).eq('viewed', false)
    setNewOrderCount(0)
  }

  useEffect(() => {
    fetchNewOrderCount()
    const interval = setInterval(fetchNewOrderCount, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (location.pathname === '/admin/orders' && newOrderCount > 0) {
      markOrdersAsViewed()
    }
  }, [location.pathname, newOrderCount])

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={16} />, label: 'DASHBOARD' },
    { to: '/admin/orders', icon: <FileText size={16} />, label: 'ORDERS' },
    { to: '/admin/customers', icon: <Users size={16} />, label: 'CUSTOMERS' },
    { to: '/admin/topproducts', icon: <TrendingUp size={16} />, label: 'PIECES' },
    { to: '/admin/newsletter', icon: <Mail size={16} />, label: 'NEWSLETTER' },
  ]

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className="w-full fixed top-0 left-0 right-0 z-40 border-b border-[#D9D2C4]"
      style={{ backgroundColor: '#FDFAF3' }}
    >
      {/* Flag strip at top */}
      <div className="w-full flex h-[3px]">
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

      <div className="flex items-center justify-between px-6 lg:px-10 h-[68px]">

        {/* ── Brand ── */}
        <Link to="/admin" className="flex items-center gap-3">
          <ManweBeastEmblem size={36} opacity={1} />
          <div className="flex flex-col gap-0.5">
            <ManweGradientText fontSize="20px" letterSpacing="0.18em">
              MANWE
            </ManweGradientText>
            <div className="flex items-center gap-1.5">
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

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(({ to, icon, label }) => {
            const active = isActive(to)
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-4 py-2 transition-all ${
                  active
                    ? 'text-[#1A1A18]'
                    : 'text-[#6B6558] hover:text-[#1A1A18]'
                }`}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '12px',
                  letterSpacing: '0.25em',
                }}
              >
                {icon}
                {label}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                    <AdinkraDiamond size={5} fill="#D4651F" opacity={1} />
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">
          {/* Bell */}
          <Link
            to="/admin/orders"
            className="relative p-2 text-[#6B6558] hover:text-[#1A1A18] transition-colors"
            aria-label={`${newOrderCount} new orders`}
          >
            <Bell size={18} />
            {newOrderCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#D4651F] text-[#F4EFE6] rounded-full font-bold"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '10px',
                }}
              >
                {newOrderCount > 99 ? '99+' : newOrderCount}
              </span>
            )}
          </Link>

          {/* Logout (desktop only) */}
          <button
            onClick={onLogout}
            className="hidden lg:flex items-center gap-2 border border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18] px-4 py-2 transition-all group"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '12px',
              letterSpacing: '0.25em',
            }}
          >
            <LogOut
              size={14}
              className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
            />
            <span className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors">
              LOG OUT
            </span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-[#1A1A18]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#D9D2C4]" style={{ backgroundColor: '#FDFAF3' }}>
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map(({ to, icon, label }) => {
              const active = isActive(to)
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-l-2 transition-all ${
                    active
                      ? 'border-[#D4651F] bg-[#F4EFE6] text-[#1A1A18]'
                      : 'border-transparent text-[#6B6558] hover:bg-[#F4EFE6]/50'
                  }`}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '14px',
                    letterSpacing: '0.25em',
                  }}
                >
                  {icon}
                  {label}
                </Link>
              )
            })}

            <button
              onClick={() => {
                setMenuOpen(false)
                onLogout()
              }}
              className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-[#D9D2C4] text-[#D4651F]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '14px',
                letterSpacing: '0.25em',
              }}
            >
              <LogOut size={16} />
              LOG OUT
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}