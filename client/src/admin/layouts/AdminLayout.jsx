// AdminLayout.jsx — MANWE Admin shell
import { useEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Topbar from '../components/navigation/Topbar'

export default function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mainRef = useRef(null)

  // Reset scroll on inner main container when admin route changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      try {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUsername')
      } catch {
        /* ignore */
      }
      navigate('/admin/login', { replace: true })
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      <Topbar onLogout={handleLogout} />
      <main ref={mainRef} className="flex-1 mt-20 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}