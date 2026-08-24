// Login.jsx — MANWE Admin Login
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Mail, Lock, Eye, EyeOff, Send, LogIn } from 'lucide-react'

import Button from '../components/ui/Button'

// ─── Design Primitives ───────────────────────────────────────────────────────

function ManweSerpentM({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity }}>
      <path d="M25 20 Q20 15 25 12 Q32 10 35 18 L35 40 L30 45 L20 50 L28 60 L25 75 Q22 85 30 88" stroke="#2D5A2E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M25 12 Q28 10 30 12 Q28 16 25 15" fill="#2D5A2E" />
      <path d="M75 20 Q80 15 75 12 Q68 10 65 18 L65 40 L70 45 L80 50 L72 60 L75 75 Q78 85 70 88" stroke="#D4651F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M75 12 Q72 10 70 12 Q72 16 75 15" fill="#D4651F" />
      <path d="M28 45 L28 75 L35 75 L35 55" stroke="#1A1A18" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <path d="M72 45 L72 75 L65 75 L65 55" stroke="#1A1A18" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <path d="M35 55 L50 70 L65 55" stroke="#1A1A18" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <circle cx="50" cy="55" r="2" fill="#1A1A18" opacity="0.9" />
      <circle cx="35" cy="45" r="1.5" fill="#2D5A2E" />
      <circle cx="65" cy="45" r="1.5" fill="#D4651F" />
    </svg>
  )
}

function AdinkraDiamond({ size = 8, fill = '#D4651F', opacity = 0.8 }) {
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
      <div className="w-px bg-transparent" />
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ADMIN_HOME = '/admin'
const MAX_EMAIL_LEN = 254
const MIN_PASSWORD_LEN = 8

function isAdmin(user) {
  return user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin'
}

function safeAdminPath(path) {
  if (typeof path === 'string' && path.startsWith('/admin')) return path
  return ADMIN_HOME
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already logged in
  useEffect(() => {
    let cancelled = false
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (session?.user && isAdmin(session.user)) {
        navigate(safeAdminPath(location.state?.from?.pathname), { replace: true })
      }
    }
    checkSession()
    return () => { cancelled = true }
  }, [navigate, location.state])

  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: 'top-center', autoClose: 4000,
      style: {
        fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.25em',
        backgroundColor: '#FDFAF3', color: type === 'success' ? '#2D5A2E' : '#D4651F',
        border: `1px solid ${type === 'success' ? '#2D5A2E' : '#D4651F'}`, borderRadius: 0,
      },
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return

    const trimmed = email.trim().toLowerCase()
    if (!trimmed || trimmed.length > MAX_EMAIL_LEN) {
      showToast('ENTER A VALID EMAIL', 'error')
      return
    }
    if (!password || password.length < MIN_PASSWORD_LEN) {
      showToast('INVALID EMAIL OR PASSWORD', 'error')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: trimmed, password })
      if (error) throw error

      if (!isAdmin(data.user)) {
        await supabase.auth.signOut()
        throw new Error('INVALID EMAIL OR PASSWORD')
      }

      showToast('WELCOME BACK', 'success')
      setTimeout(() => navigate(safeAdminPath(location.state?.from?.pathname), { replace: true }), 500)
    } catch (err) {
      const raw = err?.message || ''
      const msg = raw === 'Invalid login credentials' || raw === 'INVALID EMAIL OR PASSWORD'
          ? 'INVALID EMAIL OR PASSWORD' : 'LOGIN FAILED — PLEASE TRY AGAIN'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (loading) return

    const trimmed = email.trim().toLowerCase()
    if (!trimmed) {
      showToast('ENTER YOUR EMAIL FIRST', 'error')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })
      if (error) throw error
      showToast('IF THAT EMAIL EXISTS, A RESET LINK WAS SENT', 'success')
      setResetMode(false)
      setPassword('')
    } catch {
      showToast('IF THAT EMAIL EXISTS, A RESET LINK WAS SENT', 'success')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ManweSerpentM size={600} opacity={0.03} />
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-10"><FlagStrip /></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <ManweSerpentM size={60} opacity={1} />
          <div className="flex items-center gap-3 mt-6 mb-4">
            <div className="w-10 h-px bg-[#2D5A2E]" /><AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
            <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.4em' }}>
              {resetMode ? 'RESET ACCESS' : 'ADMIN ACCESS'}
            </span>
            <AdinkraDiamond size={7} fill="#D4651F" opacity={1} /><div className="w-10 h-px bg-[#D4651F]" />
          </div>
          <h1 className="text-center leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 7vw, 56px)', letterSpacing: '0.05em' }}>
            <ManweGradientText fontSize="clamp(36px, 7vw, 56px)">
              {resetMode ? 'RESET' : 'MANWE'}
            </ManweGradientText>
          </h1>
          <p className="text-[#8B8577] mt-3 font-mono text-[10px] tracking-[0.4em]">
            {resetMode ? 'WE WILL EMAIL YOU A LINK' : 'THE TRIBE HEADQUARTERS'}
          </p>
        </div>

        {/* Form */}
        <div className="relative border border-[#D9D2C4] p-7 shadow-sm transition-all duration-300" style={{ backgroundColor: '#FDFAF3' }}>
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>

          <form onSubmit={resetMode ? handlePasswordReset : handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className="text-[#6B6558] flex items-center gap-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.3em' }}>
                EMAIL <AdinkraDiamond size={4} fill="#D4651F" />
              </label>
              <div className="flex items-center gap-3 border border-[#D9D2C4] focus-within:border-[#1A1A18] focus-within:shadow-sm transition-all px-4" style={{ backgroundColor: '#F4EFE6' }}>
                <Mail size={16} className="text-[#8B8577] shrink-0" aria-hidden />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@manweofficial.com.ng"
                  required
                  autoComplete="username"
                  autoFocus
                  maxLength={MAX_EMAIL_LEN}
                  className="flex-1 bg-transparent outline-none py-3 text-[#1A1A18] placeholder:text-[#B5AE9E]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.1em' }}
                />
              </div>
            </div>

            {!resetMode && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <label htmlFor="admin-password" className="text-[#6B6558] flex items-center gap-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.3em' }}>
                  PASSWORD <AdinkraDiamond size={4} fill="#D4651F" />
                </label>
                <div className="flex items-center gap-3 border border-[#D9D2C4] focus-within:border-[#1A1A18] focus-within:shadow-sm transition-all px-4" style={{ backgroundColor: '#F4EFE6' }}>
                  <Lock size={16} className="text-[#8B8577] shrink-0" aria-hidden />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    minLength={MIN_PASSWORD_LEN}
                    className="flex-1 bg-transparent outline-none py-3 text-[#1A1A18] placeholder:text-[#B5AE9E]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.1em' }}
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-[#8B8577] hover:text-[#1A1A18] transition-colors shrink-0">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-2 space-y-3">
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                icon={resetMode ? Send : LogIn}
                withDiamonds
              >
                {resetMode ? 'SEND RESET LINK' : 'SIGN IN'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setResetMode((r) => !r)
                  setError(null)
                }}
                className="w-full text-center text-[#6B6558] hover:text-[#1A1A18] transition-colors py-2"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.3em' }}
              >
                {resetMode ? '← BACK TO SIGN IN' : 'FORGOT PASSWORD ?'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <FlagStrip className="w-20 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
          <FlagStrip className="w-20 h-0.5" />
        </div>
      </div>

      <ToastContainer />
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  )
}