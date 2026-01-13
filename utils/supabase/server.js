import { createServerClient } from '@supabase/ssr'

export function createSupabaseServer(request, response) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createServerClient(url, key, {
    cookies: {
      get(name) {
        return request?.cookies?.get(name)?.value
      },
      set(name, value, options) {
        if (response) {
          response.cookies.set({ name, value, ...options })
        }
      },
      remove(name, options) {
        if (response) {
          response.cookies.set({ name, value: '', ...options })
        }
      },
    },
  })
}

export default createSupabaseServer
