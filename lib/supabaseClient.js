/*
  Updated Supabase helpers using @supabase/ssr recommended helpers.
  - For client components, use createBrowserClient (from @supabase/ssr)
  - For server code, use createServerClient and pass req/res when available

  This file re-exports convenient wrappers for backward compatibility.
*/
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_PUBLISHABLE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.NEXT_SUPABASE_KEY

export const createSupabaseBrowser = () => {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE) {
    console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return createBrowserClient(SUPABASE_URL ?? '', SUPABASE_PUBLISHABLE ?? '')
}

export const createSupabaseServer = (req, res) => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_SUPABASE_KEY for server Supabase')
  }
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { req, res })
}

// Convenience sign-in / sign-out using browser client (client components)
export async function signInWithEmail(email, password) {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createSupabaseBrowser()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}
