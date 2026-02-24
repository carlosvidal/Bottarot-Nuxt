/**
 * Auth initialization plugin (client-only)
 *
 * Initializes auth state and sets up the auth listener
 * after the Supabase client is available.
 */
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()

  // Initialize auth (checks existing session)
  await auth.initAuth()

  // Set up the auth state change listener
  auth.setupAuthListener()
})
