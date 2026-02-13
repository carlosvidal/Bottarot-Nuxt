/**
 * Supabase client-only plugin
 *
 * We intentionally DO NOT use @nuxtjs/supabase to preserve
 * the existing PKCE auth flow with localStorage.
 * This plugin runs only on the client.
 */
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseAnonKey = config.public.supabaseAnonKey as string

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase configuration is missing. Check NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'bottarot-nuxt',
      },
    },
  })

  return {
    provide: {
      supabase,
    },
  }
})
