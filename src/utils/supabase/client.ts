import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_URL || import.meta.env?.NEXT_PUBLIC_SUPABASE_URL)) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://wztsczaaaiceaoerdbfr.supabase.co'

const supabaseKey =
  (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  'sb_publishable_UnIEEMCkUzUpeaHt7kLpUw_O8CNig68'

export const createClient = () => {
  try {
    return createBrowserClient(supabaseUrl, supabaseKey)
  } catch {
    return createSupabaseClient(supabaseUrl, supabaseKey)
  }
}

export const supabase = createClient()

export default supabase
