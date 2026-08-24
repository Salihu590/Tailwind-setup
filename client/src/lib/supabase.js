import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 1. DEPLOYMENT GUARD: Warn immediately if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "🚨 MANWE SECURITY: Missing Supabase environment variables. Check your hosting provider settings (.env)."
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Explicitly declare storage (helps prevent edge-case hydration issues in some browsers)
    storage: window.localStorage, 
  },
})