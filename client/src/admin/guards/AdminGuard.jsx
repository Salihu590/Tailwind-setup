// AdminGuard.jsx — MANWE Admin Route Protection
// Verifies active Supabase session + admin role

import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

// ─── MANWE Serpent M — for loading state ─────────────────────────────────────

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

export default function AdminGuard({ children }) {
  const location = useLocation()
  const [status, setStatus] = useState('checking') // checking | authorized | denied

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error || !session) {
        setStatus('denied')
        return
      }

      // Check if user has admin role
      const role = session.user?.user_metadata?.role

      if (role === 'admin') {
        setStatus('authorized')
      } else {
        // User is logged in but not an admin — sign them out and deny
        await supabase.auth.signOut()
        setStatus('denied')
      }
    }

    checkAuth()

    // Listen for auth state changes (sign in / sign out from other tabs)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_OUT' || !session) {
        setStatus('denied')
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const role = session.user?.user_metadata?.role
        setStatus(role === 'admin' ? 'authorized' : 'denied')
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  if (status === 'checking') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ backgroundColor: '#F4EFE6' }}
      >
        <div
          className="relative w-20 h-20 flex items-center justify-center"
          style={{ animation: 'manwe-spin 3s linear infinite' }}
        >
          <ManweSerpentM size={64} opacity={0.9} />
        </div>
        <p
          className="text-[#6B6558]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.4em',
          }}
        >
          VERIFYING SESSION
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

  if (status === 'denied') {
    return <Navigate to='/admin/login' replace state={{ from: location }} />
  }

  return children
}