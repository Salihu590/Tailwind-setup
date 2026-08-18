import axios from 'axios'
import { supabase } from './supabase'

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const api = axios.create({
  baseURL: FUNCTIONS_URL,
  headers: {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
  },
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
    console.error('Failed to attach auth token:', err)
    config.headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`
  }

  return config
})

// ─── Response interceptor ────────────────────────────────────────────────────
// Auto-logout admin on 401

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session && window.location.pathname.startsWith('/admin')) {
        await supabase.auth.signOut()
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)