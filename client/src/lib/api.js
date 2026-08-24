import axios from 'axios'
import { supabase } from './supabase'

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// 1. DEPLOYMENT GUARD
if (!FUNCTIONS_URL || !SUPABASE_ANON_KEY) {
  console.error("🚨 MANWE API: Missing API environment variables. Edge functions will fail.")
}

export const api = axios.create({
  baseURL: FUNCTIONS_URL,
  headers: {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
  },
  // 2. UX UPGRADE: Prevent infinite loading spinners if a serverless function hangs
  timeout: 15000, // 15 seconds max wait time
})

// ─── Request interceptor ─────────────────────────────────────────────────────
// Attach Supabase session token (used by Edge Functions to verify admin role)

api.interceptors.request.use(async (config) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    } else {
      // Fallback to anon key for public endpoints (contact form, newsletter etc)
      config.headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`
    }
  } catch (err) {
    console.error('MANWE API: Failed to attach auth token:', err)
    config.headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`
  }

  return config
})

// ─── Response interceptor ────────────────────────────────────────────────────
// Auto-logout admin on 401 (Unauthorized) or 403 (Forbidden)

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // 3. SECURITY: Catch both 401 and 403 (Supabase sometimes uses 403 for expired tokens)
    if (err.response?.status === 401 || err.response?.status === 403) {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session && window.location.pathname.startsWith('/admin')) {
        // 4. UX UPGRADE: Remember where the admin was trying to go before the session expired
        const currentPath = window.location.pathname
        
        await supabase.auth.signOut()
        
        // Redirect with a return URL
        window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}`
      }
    }
    
    return Promise.reject(err)
  }
)