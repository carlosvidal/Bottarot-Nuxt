/**
 * Auth middleware for protected routes.
 *
 * Usage in pages:
 *   definePageMeta({ middleware: 'auth' })
 *
 * This middleware runs client-side only (since auth is client-side with Supabase PKCE).
 * On SSR, it lets the page render (CSR pages have ssr: false anyway).
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server - auth is client-side only
  if (!import.meta.client) return

  const auth = useAuthStore()

  // Wait for auth initialization (up to 5 seconds)
  if (!auth.isInitialized) {
    const maxWait = 5000
    const startTime = Date.now()
    while (!auth.isInitialized && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // If user is logged in but needs registration, redirect to landing
  if (auth.isLoggedIn && auth.needsRegistration) {
    return navigateTo('/')
  }

  // If user is not logged in and the route requires full auth
  if (!auth.isLoggedIn && to.meta.requiresAuth) {
    return navigateTo('/')
  }
})
