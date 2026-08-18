import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Topbar from '../components/navigation/Topbar'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUsername')
      navigate('/admin/login')
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      <Topbar onLogout={handleLogout} />
      <main className="flex-1 mt-20 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}