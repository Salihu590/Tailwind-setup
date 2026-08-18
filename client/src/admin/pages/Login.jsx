// Login.jsx — MANWE Admin Login
// Supabase Auth with email + password

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

// ─── MANWE Serpent M ──────────────────────────────────────────────────────────

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
  );
}

function AdinkraDiamond({ size = 8, fill = '#D4651F', opacity = 0.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  );
}

function FlagStrip({ className = 'w-full h-0.5' }) {
  return (
    <div className={`${className} flex`}>
      <div className="flex flex-1">
        <div className="flex-1 bg-[#2D5A2E]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
      <div className="w-px bg-transparent" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#D4651F]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
    </div>
  );
}

function ManweGradientText({ children, fontSize = '32px', letterSpacing = '0.05em' }) {
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
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already logged in as admin
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.role === 'admin') {
        const from = location.state?.from?.pathname || '/admin'
        navigate(from, { replace: true })
      }
    }
    checkSession()
  }, [navigate, location])

  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: 'top-center',
      autoClose: 4000,
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

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) throw error

      // Check admin role
      const role = data.user?.user_metadata?.role
      if (role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('ACCESS DENIED — NOT AN ADMIN ACCOUNT')
      }

      showToast('WELCOME BACK', 'success')

      const from = location.state?.from?.pathname || '/admin'
      setTimeout(() => navigate(from, { replace: true }), 500)
    } catch (err) {
      const msg =
        err.message === 'Invalid login credentials'
          ? 'INVALID EMAIL OR PASSWORD'
          : err.message?.toUpperCase() || 'LOGIN FAILED — PLEASE TRY AGAIN'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (resetLoading) return

    if (!email.trim()) {
      showToast('ENTER YOUR EMAIL FIRST', 'error')
      return
    }

    setResetLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) throw error

      showToast('RESET LINK SENT — CHECK YOUR EMAIL', 'success')
      setResetMode(false)
    } catch (err) {
      showToast(
        err.message?.toUpperCase() || 'FAILED TO SEND RESET LINK',
        'error'
      )
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}
    >
      {/* Background watermarks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ManweSerpentM size={600} opacity={0.03} />
        </div>
      </div>

      {/* Top flag strip */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <FlagStrip />
      </div>

      {/* Login card */}
      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <ManweSerpentM size={60} opacity={1} />

          <div className="flex items-center gap-3 mt-6 mb-4">
            <div className="w-10 h-px bg-[#2D5A2E]" />
            <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
            <span
              className="text-[#2D5A2E]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.4em',
              }}
            >
              {resetMode ? 'RESET ACCESS' : 'ADMIN ACCESS'}
            </span>
            <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
            <div className="w-10 h-px bg-[#D4651F]" />
          </div>

          <h1
            className="text-center leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 7vw, 56px)',
              letterSpacing: '0.05em',
            }}
          >
            <ManweGradientText fontSize="clamp(36px, 7vw, 56px)" letterSpacing="0.05em">
              {resetMode ? 'RESET' : 'MANWE'}
            </ManweGradientText>
          </h1>

          <p
            className="text-[#8B8577] mt-3 font-mono text-[10px] tracking-[0.4em]"
          >
            {resetMode ? 'WE WILL EMAIL YOU A LINK' : 'THE TRIBE HEADQUARTERS'}
          </p>
        </div>

        {/* Form card */}
        <div
          className="relative border border-[#D9D2C4] p-7"
          style={{ backgroundColor: '#FDFAF3' }}
        >
          {/* Corner diamonds */}
          <span className="absolute -top-1 -left-1">
            <AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} />
          </span>
          <span className="absolute -top-1 -right-1">
            <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
          </span>
          <span className="absolute -bottom-1 -left-1">
            <AdinkraDiamond size={7} fill="#D4651F" opacity={1} />
          </span>
          <span className="absolute -bottom-1 -right-1">
            <AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} />
          </span>

          <form
            onSubmit={resetMode ? handlePasswordReset : handleLogin}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[#6B6558] flex items-center gap-2"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                }}
              >
                EMAIL
                <AdinkraDiamond size={4} fill="#D4651F" opacity={1} />
              </label>
              <div
                className="flex items-center gap-3 border border-[#D9D2C4] focus-within:border-[#1A1A18] transition-colors px-4"
                style={{ backgroundColor: '#F4EFE6' }}
              >
                <Mail size={16} className="text-[#8B8577] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@manweofficial.com.ng"
                  required
                  autoComplete="username"
                  className="flex-1 bg-transparent outline-none py-3 text-[#1A1A18] placeholder:text-[#B5AE9E]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '15px',
                    letterSpacing: '0.1em',
                  }}
                />
              </div>
            </div>

            {/* Password — hidden in reset mode */}
            {!resetMode && (
              <div className="flex flex-col gap-2">
                <label
                  className="text-[#6B6558] flex items-center gap-2"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                  }}
                >
                  PASSWORD
                  <AdinkraDiamond size={4} fill="#D4651F" opacity={1} />
                </label>
                <div
                  className="flex items-center gap-3 border border-[#D9D2C4] focus-within:border-[#1A1A18] transition-colors px-4"
                  style={{ backgroundColor: '#F4EFE6' }}
                >
                  <Lock size={16} className="text-[#8B8577] shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="flex-1 bg-transparent outline-none py-3 text-[#1A1A18] placeholder:text-[#B5AE9E]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '15px',
                      letterSpacing: '0.1em',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-[#8B8577] hover:text-[#1A1A18] transition-colors shrink-0"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || resetLoading}
              className={`
                group relative flex items-center justify-center gap-4 border px-8 py-4 transition-all duration-300 mt-2
                ${
                  loading || resetLoading
                    ? 'border-[#D9D2C4] cursor-not-allowed opacity-50'
                    : 'border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18]'
                }
              `}
            >
              {!loading && !resetLoading && (
                <>
                  <span className="absolute -top-1 -left-1">
                    <AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} />
                  </span>
                  <span className="absolute -top-1 -right-1">
                    <AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} />
                  </span>
                  <span className="absolute -bottom-1 -left-1">
                    <AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} />
                  </span>
                  <span className="absolute -bottom-1 -right-1">
                    <AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} />
                  </span>
                </>
              )}

              {loading || resetLoading ? (
                <>
                  <Loader2 className="animate-spin text-[#6B6558]" size={16} />
                  <span
                    className="text-[#6B6558]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '15px',
                      letterSpacing: '0.35em',
                    }}
                  >
                    {resetMode ? 'SENDING...' : 'SIGNING IN...'}
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '15px',
                      letterSpacing: '0.35em',
                    }}
                  >
                    {resetMode ? 'SEND RESET LINK' : 'SIGN IN'}
                  </span>
                  <span className="text-[#D4651F] group-hover:text-[#F4EFE6] transition-colors font-mono">
                    →
                  </span>
                </>
              )}
            </button>

            {/* Toggle reset / login mode */}
            <button
              type="button"
              onClick={() => setResetMode((r) => !r)}
              className="text-[#6B6558] hover:text-[#1A1A18] transition-colors mt-1"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.3em',
              }}
            >
              {resetMode ? '← BACK TO SIGN IN' : 'FORGOT PASSWORD ?'}
            </button>
          </form>
        </div>

        {/* Bottom flag strip */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <FlagStrip className="w-20 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">
            NGR × CIV
          </span>
          <FlagStrip className="w-20 h-0.5" />
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}