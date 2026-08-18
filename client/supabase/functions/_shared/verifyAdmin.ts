// _shared/verifyAdmin.ts
// Verifies that the request comes from a signed-in Supabase user
// whose user_metadata.role === 'admin'

export async function verifyAdminToken(req: Request): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return false

    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return false

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
      return false
    }

    // Verify the token belongs to a real Supabase user
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey,
      },
    })

    if (!res.ok) return false

    const user = await res.json()

    // Only allow if user has role: 'admin' in their metadata
    return user?.user_metadata?.role === 'admin'
  } catch (err) {
    console.error('verifyAdminToken error:', err)
    return false
  }
}