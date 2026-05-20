import { defineStore } from 'pinia'
import { smartWarmup } from '~/utils/serverWarmup'

type AuthClient = ReturnType<typeof import('better-auth/vue')['createAuthClient']>

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const loading = ref(false)
  const needsRegistration = ref(false)
  const userSubscription = ref<any>(null)
  const isInitialized = ref(false)
  const warmupMessage = ref('')
  const profileLanguage = ref<string | null>(null)

  const readingPermissions = ref<any>(null)
  const anonymousSessionId = ref<string | null>(null)

  const pendingReferralCode = ref<string | null>(
    import.meta.client ? localStorage.getItem('pendingReferralCode') : null,
  )

  const isLoggedIn = computed(() => !!user.value)
  const isFullyRegistered = computed(() => isLoggedIn.value && !needsRegistration.value)
  const canReadToday = computed(() => readingPermissions.value?.can_read_today ?? true)
  const canSeeFuture = computed(
    () => readingPermissions.value?.can_see_future || readingPermissions.value?.is_premium || false,
  )
  const freeFuturesRemaining = computed(() => readingPermissions.value?.free_futures_remaining || 0)
  const isAnonymousUser = computed(() => !user.value)

  const isSubscriptionActive = computed(() => {
    if (!userSubscription.value) return false
    const now = new Date()
    const endDate = new Date(userSubscription.value.subscription_end_date)
    return userSubscription.value.has_active_subscription && endDate > now
  })
  const isPremiumUser = computed(() => isSubscriptionActive.value)
  const canAskQuestion = computed(() => userSubscription.value?.can_ask_question || false)
  const questionsRemaining = computed(() => userSubscription.value?.questions_remaining || 0)
  const currentPlan = computed(() => userSubscription.value?.plan_name || 'Gratuito')

  const getAuthClient = (): AuthClient | null => {
    if (!import.meta.client) return null
    const { $auth } = useNuxtApp()
    return $auth as AuthClient
  }

  const getApiUrl = () => useRuntimeConfig().public.apiUrl as string

  /** Refresh user state from the current Better Auth session. */
  const refreshSession = async () => {
    const client = getAuthClient()
    if (!client) return null
    try {
      const { data } = await client.getSession()
      user.value = data?.user ?? null
      return data?.session ?? null
    } catch (err) {
      console.error('Error refreshing session:', err)
      user.value = null
      return null
    }
  }

  const initAuth = async () => {
    if (!import.meta.client) return
    if (isInitialized.value) return

    captureReferralCode()
    loading.value = true
    try {
      const session = await refreshSession()
      if (session && user.value) {
        await checkUserProfile(user.value)
        await loadUserSubscription()
      }
      await loadReadingPermissions()
    } catch (error) {
      console.error('❌ Error during auth initialization:', error)
    } finally {
      isInitialized.value = true
      loading.value = false
    }
  }

  const showWarmupMessage = (message: string) => {
    warmupMessage.value = message
    setTimeout(() => { warmupMessage.value = '' }, 3000)
  }

  const performWarmup = async () => {
    if (!import.meta.client) return
    try {
      const result = await smartWarmup(getApiUrl(), showWarmupMessage)
      const skipped = 'skipped' in result && result.skipped
      if (result.success && !skipped) {
        console.log(`🔥 Servidor despierto (${result.latency}ms)`)
      }
    } catch (error) {
      console.warn('⚠️ Warmup failed:', error)
    }
  }

  /**
   * Better Auth does not expose an OAuth-style event stream; we just poll the
   * session reactively when the user returns from an OAuth callback. The
   * easiest hook is the OAuth `?callbackURL` redirect: we re-init.
   */
  const setupAuthListener = () => {
    if (!import.meta.client) return
    // After OAuth, the browser returns to the configured callbackURL with
    // the session cookie set. Re-init to pick it up.
    window.addEventListener('focus', () => { refreshSession() })
  }

  /** Fetch the user profile from the backend and decide whether registration is incomplete. */
  const checkUserProfile = async (userObj: any) => {
    if (!userObj) return
    try {
      const response = await fetch(`${getApiUrl()}/api/user/profile`, { credentials: 'include' })
      if (response.status === 404) {
        needsRegistration.value = true
        return
      }
      if (!response.ok) {
        needsRegistration.value = false
        return
      }
      const profile = await response.json()
      needsRegistration.value = !profile
      if (profile?.language) profileLanguage.value = profile.language
    } catch (error) {
      console.error('❌ Exception checking user profile:', error)
      needsRegistration.value = false
    }
  }

  const oauthRedirect = (customRedirectTo: string | null) =>
    customRedirectTo || (import.meta.client ? window.location.origin : '/')

  const loginWithGoogle = async (customRedirectTo: string | null = null) => {
    if (!import.meta.client) return { data: null, error: new Error('SSR') }
    const client = getAuthClient()
    if (!client) return { data: null, error: new Error('Auth client not available') }
    loading.value = true
    try {
      const { data, error } = await client.signIn.social({
        provider: 'google',
        callbackURL: oauthRedirect(customRedirectTo),
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error logging in with Google:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const loginWithFacebook = async (customRedirectTo: string | null = null) => {
    if (!import.meta.client) return { data: null, error: new Error('SSR') }
    const client = getAuthClient()
    if (!client) return { data: null, error: new Error('Auth client not available') }
    loading.value = true
    try {
      const { data, error } = await client.signIn.social({
        provider: 'facebook',
        callbackURL: oauthRedirect(customRedirectTo),
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error logging in with Facebook:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    const client = getAuthClient()
    if (!client) return { data: null, error: new Error('Auth client not available') }
    loading.value = true
    try {
      const { data, error } = await client.signIn.email({ email, password })
      if (error) throw error
      await refreshSession()
      if (user.value) {
        await Promise.all([
          registerReferral(user.value.id),
          checkUserProfile(user.value),
          loadUserSubscription(),
          loadReadingPermissions(),
        ])
      }
      return { data, error: null }
    } catch (error) {
      console.error('Error logging in with email:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signUpWithEmail = async (email: string, password: string, name?: string) => {
    const client = getAuthClient()
    if (!client) return { data: null, error: new Error('Auth client not available') }
    loading.value = true
    try {
      const { data, error } = await client.signUp.email({
        email,
        password,
        name: name || email.split('@')[0] || email,
      })
      if (error) throw error
      await refreshSession()
      if (user.value) {
        await registerReferral(user.value.id)
      }
      return { data, error: null }
    } catch (error) {
      console.error('Error signing up with email:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const completeRegistration = async (profileData: {
    name: string
    gender: string
    dateOfBirth: string
    timezone?: string
    language?: string
  }) => {
    if (!user.value) return { data: null, error: new Error('Not authenticated') }
    loading.value = true
    try {
      const response = await fetch(`${getApiUrl()}/api/user/profile`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          gender: profileData.gender,
          date_of_birth: profileData.dateOfBirth,
          timezone: profileData.timezone || 'America/Mexico_City',
          language: profileData.language || 'es',
        }),
      })
      if (!response.ok) throw new Error(await response.text())
      const data = await response.json()
      needsRegistration.value = false
      profileLanguage.value = profileData.language || 'es'
      return { data, error: null }
    } catch (error) {
      console.error('Error completing registration:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData: {
    name?: string
    gender?: string
    dateOfBirth?: string
    timezone?: string
    language?: string
  }) => {
    if (!user.value) return { data: null, error: new Error('Not authenticated') }
    loading.value = true
    try {
      const response = await fetch(`${getApiUrl()}/api/user/profile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          gender: profileData.gender,
          date_of_birth: profileData.dateOfBirth,
          timezone: profileData.timezone,
          language: profileData.language,
        }),
      })
      if (!response.ok) throw new Error(await response.text())
      const data = await response.json()
      if (profileData.language) profileLanguage.value = profileData.language
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const getAnonymousSessionId = () => {
    if (!import.meta.client) return 'anon_ssr'
    if (anonymousSessionId.value) return anonymousSessionId.value
    let sessionId = localStorage.getItem('bottarot_anonymous_session')
    if (!sessionId) {
      sessionId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('bottarot_anonymous_session', sessionId)
    }
    anonymousSessionId.value = sessionId
    return sessionId
  }

  const captureReferralCode = () => {
    if (!import.meta.client) return
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')
    if (refCode) {
      pendingReferralCode.value = refCode
      localStorage.setItem('pendingReferralCode', refCode)
      const url = new URL(window.location.href)
      url.searchParams.delete('ref')
      window.history.replaceState({}, '', url.toString())
    }
  }

  const registerReferral = async (userId: string) => {
    if (!pendingReferralCode.value || !userId) return
    try {
      const response = await fetch(`${getApiUrl()}/api/referral/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, referralCode: pendingReferralCode.value }),
      })
      const data = await response.json()
      if (data.success) console.log('✅ Referral registered')
      pendingReferralCode.value = null
      if (import.meta.client) localStorage.removeItem('pendingReferralCode')
    } catch (error) {
      console.error('❌ Failed to register referral:', error)
    }
  }

  const loadReadingPermissions = async () => {
    const userId = user.value?.id || 'anonymous'
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      const response = await fetch(`${getApiUrl()}/api/user/reading-permissions/${userId}`, {
        signal: controller.signal,
        credentials: 'include',
      })
      clearTimeout(timeoutId)
      if (response.ok) {
        readingPermissions.value = await response.json()
      } else {
        readingPermissions.value = {
          is_premium: false,
          can_read_today: true,
          can_see_future: !user.value,
          readings_today: 0,
          free_futures_remaining: user.value ? 5 : 0,
          history_limit: user.value ? 3 : 0,
          plan_name: user.value ? 'Gratuito' : 'Anónimo',
        }
      }
    } catch {
      readingPermissions.value = {
        is_premium: false,
        can_read_today: true,
        can_see_future: false,
        readings_today: 0,
        free_futures_remaining: 0,
        history_limit: 3,
        plan_name: 'Gratuito',
      }
    }
  }

  const recordReading = async (revealedFuture = false) => {
    if (!user.value?.id) return
    try {
      const response = await fetch(`${getApiUrl()}/api/user/record-reading`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.value.id, revealedFuture }),
      })
      if (response.ok) await loadReadingPermissions()
    } catch (error) {
      console.error('❌ Error recording reading:', error)
    }
  }

  const loadUserSubscription = async () => {
    if (!user.value?.id) return
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      const response = await fetch(`${getApiUrl()}/api/user/subscription/${user.value.id}`, {
        signal: controller.signal,
        credentials: 'include',
      })
      clearTimeout(timeoutId)
      if (response.ok) {
        userSubscription.value = await response.json()
      } else {
        userSubscription.value = { plan_name: 'Gratuito', has_active_subscription: false }
      }
    } catch {
      userSubscription.value = { plan_name: 'Gratuito', has_active_subscription: false }
    }
  }

  const checkCanAskQuestion = async () => {
    if (!user.value?.id) return false
    try {
      const response = await fetch(`${getApiUrl()}/api/user/can-ask/${user.value.id}`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        return data.canAsk
      }
    } catch (error) {
      console.error('Error checking question permission:', error)
    }
    return false
  }

  const recordQuestion = async (
    question: string,
    response: string,
    cards: any[] = [],
    isPremium = false,
  ) => {
    if (!user.value?.id) return
    try {
      await fetch(`${getApiUrl()}/api/user/question`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.value.id, question, response, cards, isPremium }),
      })
      await loadUserSubscription()
    } catch (error) {
      console.error('Error recording question:', error)
    }
  }

  const logout = async () => {
    const client = getAuthClient()
    if (!client) return
    loading.value = true
    try {
      await client.signOut()
      user.value = null
      needsRegistration.value = false
      userSubscription.value = null
      readingPermissions.value = null
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    isLoggedIn,
    isFullyRegistered,
    needsRegistration,
    loading,
    isInitialized,
    warmupMessage,
    userSubscription,
    isSubscriptionActive,
    isPremiumUser,
    canAskQuestion,
    questionsRemaining,
    currentPlan,
    readingPermissions,
    canReadToday,
    canSeeFuture,
    freeFuturesRemaining,
    isAnonymousUser,
    anonymousSessionId,
    initAuth,
    setupAuthListener,
    loginWithGoogle,
    loginWithFacebook,
    loginWithEmail,
    signUpWithEmail,
    completeRegistration,
    updateProfile,
    logout,
    loadUserSubscription,
    checkCanAskQuestion,
    recordQuestion,
    loadReadingPermissions,
    recordReading,
    getAnonymousSessionId,
    profileLanguage,
    performWarmup,
    showWarmupMessage,
    captureReferralCode,
    registerReferral,
    pendingReferralCode,
  }
})
