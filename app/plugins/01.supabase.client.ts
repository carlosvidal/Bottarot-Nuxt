/**
 * Better Auth client-only plugin.
 *
 * Replaces the previous Supabase client. Exposes the auth client at
 * `useNuxtApp().$auth` so the auth store can call sign-in / sign-out
 * / getSession against the backend Better Auth handler.
 *
 * The file is still named 01.supabase.client.ts for diff continuity;
 * the export is just `$auth` now.
 */
import { createAuthClient } from 'better-auth/vue'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiUrl as string) || 'http://localhost:3000'

  const authClient = createAuthClient({
    baseURL,
    fetchOptions: { credentials: 'include' },
  })

  return {
    provide: {
      auth: authClient,
    },
  }
})
