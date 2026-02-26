/**
 * Auth initialization plugin (client-only)
 *
 * Initializes auth state and sets up the auth listener
 * after the Supabase client is available.
 * Also syncs the user's profile language preference to i18n.
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()

  // Initialize auth (checks existing session)
  await auth.initAuth()

  // If user has a saved language preference, prioritize it over browser detection
  if (auth.profileLanguage) {
    const i18n = nuxtApp.$i18n as any
    if (i18n && i18n.locale.value !== auth.profileLanguage) {
      await i18n.setLocale(auth.profileLanguage)
    }
  }

  // Set up the auth state change listener
  auth.setupAuthListener()
})
