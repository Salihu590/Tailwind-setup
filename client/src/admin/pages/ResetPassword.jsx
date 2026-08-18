// ResetPassword.jsx — Admin password reset (privacy-first, no oracle)

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loader2, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react'

// ─── MANWE Beast Emblem (Serpent M variant) ──────────────────────────────────

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

// ─── Password strength helpers ───────────────────────────────────────────────

const checkStrength = (pwd) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`;']/.test(pwd),
})

const isStrong = (checks) => Object.values(checks).every(Boolean)

// ─── Component ───────────────────────────────────────────────────────────────

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validSession, setValidSession] = useState(null) // null | true | false

  const navigate = useNavigate()

  const strength = checkStrength(newPassword)
  const passwordStrong = isStrong(strength)
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

  // Submit only enabled when password is strong AND both fields match
  const canSubmit = !loading && passwordStrong && passwordsMatch

  // ── Validate recovery session ──
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setValidSession(true)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidSession(true)
      else setValidSession(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

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

  const handleReset = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)

    try {
      // Silently accept — even if the password is the same as the old one.
      // This is intentional: we don't leak any information about the old password.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) throw updateError

      showToast('PASSWORD UPDATED — PLEASE SIGN IN', 'success')
      await supabase.auth.signOut()
      setTimeout(() => navigate('/admin/login'), 1500)
    } catch (err) {
      showToast(err.message?.toUpperCase() || 'RESET FAILED', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ─── Invalid session state ──
  if (validSession === false) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: '#F4EFE6' }}
      >
        <ManweSerpentM size={72} opacity={0.6} />
        <p
          className="mt-6 text-[#6B6558] text-center"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '18px',
            letterSpacing: '0.3em',
          }}
        >
          INVALID OR EXPIRED LINK
        </p>
        <button
          onClick={() => navigate('/admin/login')}
          className="mt-6 border border-[#1A1A18] px-6 py-3 hover:bg-[#1A1A18] hover:text-[#F4EFE6] transition-all"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '13px',
            letterSpacing: '0.3em',
          }}
        >
          ← BACK TO SIGN IN
        </button>
      </div>
    )
  }

  // ─── Live requirements (strength only — no info leaks) ──
  const requirements = [
    { key: 'length',  label: 'At least 8 characters',         met: strength.length },
    { key: 'upper',   label: 'One uppercase letter (A–Z)',    met: strength.upper },
    { key: 'lower',   label: 'One lowercase letter (a–z)',    met: strength.lower },
    { key: 'number',  label: 'One number (0–9)',              met: strength.number },
    { key: 'special', label: 'One special character (!@#$…)', met: strength.special },
    { key: 'match',   label: 'Both passwords match',          met: passwordsMatch },
  ]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}
    >
      {/* Background watermark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ManweSerpentM size={600} opacity={0.03} />
        </div>
      </div>

      {/* Top flag strip */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <FlagStrip />
      </div>

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
              NEW PASSWORD
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
              RESET
            </ManweGradientText>
          </h1>
        </div>

        {/* ── Form card ── */}
        <div
          className="relative border border-[#D9D2C4] p-7"
          style={{ backgroundColor: '#FDFAF3' }}
        >
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" opacity={1} /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" opacity={1} /></span>

          <form onSubmit={handleReset} className="flex flex-col gap-5">
            {[
              { label: 'NEW PASSWORD', value: newPassword, setter: setNewPassword },
              { label: 'CONFIRM PASSWORD', value: confirmPassword, setter: setConfirmPassword },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex flex-col gap-2">
                <label
                  className="text-[#6B6558] flex items-center gap-2"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                  }}
                >
                  {label}
                  <AdinkraDiamond size={4} fill="#D4651F" opacity={1} />
                </label>
                <div
                  className="flex items-center gap-3 border border-[#D9D2C4] focus-within:border-[#1A1A18] transition-colors px-4"
                  style={{ backgroundColor: '#F4EFE6' }}
                >
                  <Lock size={16} className="text-[#8B8577] shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required
                    autoComplete="new-password"
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
                    className="text-[#8B8577] hover:text-[#1A1A18] shrink-0"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            {/* ── Requirements block ── */}
            <div
              className="border-l-2 border-[#D4651F] pl-4 py-2"
              style={{ backgroundColor: '#F4EFE6' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={12} className="text-[#D4651F]" />
                <span
                  className="text-[#D4651F]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.35em',
                  }}
                >
                  REQUIREMENTS
                </span>
              </div>

              <ul className="space-y-1">
                {requirements.map((req) => (
                  <li key={req.key} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-1.5 h-1.5 rotate-45 shrink-0"
                      style={{
                        backgroundColor: req.met ? '#2D5A2E' : '#B5AE9E',
                      }}
                    />
                    <span
                      style={{
                        color: req.met ? '#2D5A2E' : '#8B8577',
                      }}
                    >
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Submit button ── */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                group relative flex items-center justify-center gap-4 border px-8 py-4 transition-all duration-300 mt-2
                ${!canSubmit
                  ? 'border-[#D9D2C4] cursor-not-allowed opacity-50'
                  : 'border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18]'}
              `}
            >
              {canSubmit && !loading && (
                <>
                  <span className="absolute -top-1 -left-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} /></span>
                  <span className="absolute -top-1 -right-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} /></span>
                  <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={6} fill="#D4651F" opacity={0.8} /></span>
                  <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={6} fill="#2D5A2E" opacity={0.8} /></span>
                </>
              )}
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-[#6B6558]" size={16} />
                  <span
                    className="text-[#6B6558]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.35em' }}
                  >
                    UPDATING...
                  </span>
                </>
              ) : (
                <>
                  <span
                    className={`transition-colors ${
                      canSubmit
                        ? 'text-[#1A1A18] group-hover:text-[#F4EFE6]'
                        : 'text-[#8B8577]'
                    }`}
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.35em' }}
                  >
                    UPDATE PASSWORD
                  </span>
                  {canSubmit && (
                    <span className="text-[#D4651F] group-hover:text-[#F4EFE6] font-mono">→</span>
                  )}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom flag strip */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <FlagStrip className="w-20 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
          <FlagStrip className="w-20 h-0.5" />
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}