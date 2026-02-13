import { defineStore } from 'pinia'
import { smartWarmup, updateServerActivity } from '~/utils/serverWarmup'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const loading = ref(false)
  const needsRegistration = ref(false)
  const userSubscription = ref<any>(null)
  const isInitialized = ref(false)
  const warmupMessage = ref('')

  // Reading permissions state
  const readingPermissions = ref<any>(null)
  const anonymousSessionId = ref<string | null>(null)

  // Referral system
  const pendingReferralCode = ref<string | null>(
    import.meta.client ? localStorage.getItem('pendingReferralCode') : null
  )

  // Computed properties
  const isLoggedIn = computed(() => !!user.value)
  const isFullyRegistered = computed(() => isLoggedIn.value && !needsRegistration.value)

  const canReadToday = computed(() => {
    if (!readingPermissions.value) return true
    return readingPermissions.value.can_read_today
  })

  const canSeeFuture = computed(() => {
    if (!readingPermissions.value) return false
    return readingPermissions.value.can_see_future || readingPermissions.value.is_premium
  })

  const freeFuturesRemaining = computed(() => {
    if (!readingPermissions.value) return 0
    return readingPermissions.value.free_futures_remaining || 0
  })

  const isAnonymousUser = computed(() => !user.value)

  const isSubscriptionActive = computed(() => {
    if (!userSubscription.value) return false
    const now = new Date()
    const endDate = new Date(userSubscription.value.subscription_end_date)
    return userSubscription.value.has_active_subscription && endDate > now
  })

  const isPremiumUser = computed(() => isSubscriptionActive.value)

  const canAskQuestion = computed(() => {
    return userSubscription.value?.can_ask_question || false
  })

  const questionsRemaining = computed(() => {
    return userSubscription.value?.questions_remaining || 0
  })

  const currentPlan = computed(() => {
    return userSubscription.value?.plan_name || 'Gratuito'
  })

  // Helper to get Supabase client (client-only)
  const getSupabase = () => {
    if (!import.meta.client) return null
    const { $supabase } = useNuxtApp()
    return $supabase as any
  }

  // Helper to get API URL
  const getApiUrl = () => {
    const config = useRuntimeConfig()
    return config.public.apiUrl as string
  }

  // Clear Supabase auth keys from localStorage
  const clearSupabaseAuthData = () => {
    if (!import.meta.client) return
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('supabase.auth')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }

  // Initialize auth state
  const initAuth = async () => {
    if (!import.meta.client) return
    if (isInitialized.value) return

    captureReferralCode()

    loading.value = true
    try {
      const supabase = getSupabase()
      if (!supabase) return

      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('❌ Error getting session:', error)
        const isNetworkError = error.message?.includes('fetch') ||
          error.message?.includes('network') ||
          error.message?.includes('Failed to fetch') ||
          error.status === 0

        if (isNetworkError) {
          clearSupabaseAuthData()
        } else {
          try { await supabase.auth.signOut() } catch {}
        }
      }

      user.value = session?.user || null

      if (session?.user) {
        await checkUserProfile(session.user)
        await loadUserSubscription()
        await loadReadingPermissions()
      } else {
        await loadReadingPermissions()
      }

      isInitialized.value = true
    } catch (error: any) {
      console.error('❌ Error during auth initialization:', error)
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        clearSupabaseAuthData()
      }
      isInitialized.value = true
    } finally {
      loading.value = false
    }
  }

  // Show warmup messages
  const showWarmupMessage = (message: string) => {
    warmupMessage.value = message
    setTimeout(() => { warmupMessage.value = '' }, 3000)
  }

  // Perform server warmup
  const performWarmup = async () => {
    if (!import.meta.client) return
    try {
      const result = await smartWarmup(getApiUrl(), showWarmupMessage)
      if (result.success && !result.skipped) {
        console.log(`🔥 Servidor despierto (${result.latency}ms)`)
      }
    } catch (error) {
      console.warn('⚠️ Warmup failed:', error)
    }
  }

  // Listen for auth changes
  const setupAuthListener = () => {
    if (!import.meta.client) return

    const supabase = getSupabase()
    if (!supabase) return

    supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log('🔔 Auth state change:', event, !!session?.user)
      user.value = session?.user || null

      if (event === 'TOKEN_REFRESHED' && !session) {
        clearSupabaseAuthData()
        return
      }

      if (event === 'SIGNED_IN' && session?.user) {
        registerReferral(session.user.id)

        Promise.all([
          checkUserProfile(session.user),
          loadUserSubscription(),
          loadReadingPermissions(),
        ]).then(() => {
          console.log('✅ Profile check complete. needsRegistration:', needsRegistration.value)
        }).catch((error) => {
          console.error('⚠️ Profile loading failed:', error)
          needsRegistration.value = false
        })
      }

      if (!isInitialized.value) {
        isInitialized.value = true
      }
    })
  }

  // Check if user needs to complete profile
  const checkUserProfile = async (userObj: any) => {
    const supabase = getSupabase()
    if (!supabase) return

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userObj.id)
        .maybeSingle()

      if (error) {
        console.error('❌ Error checking user profile:', error)
        needsRegistration.value = false
        return
      }

      needsRegistration.value = !profile
    } catch (error) {
      console.error('❌ Exception checking user profile:', error)
      needsRegistration.value = false
    }
  }

  // Login with Google
  const loginWithGoogle = async (customRedirectTo: string | null = null) => {
    if (!import.meta.client) return { data: null, error: new Error('SSR') }

    const supabase = getSupabase()
    if (!supabase) return { data: null, error: new Error('Supabase not available') }

    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: customRedirectTo || window.location.origin },
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

  // Login with Facebook
  const loginWithFacebook = async (customRedirectTo: string | null = null) => {
    if (!import.meta.client) return { data: null, error: new Error('SSR') }

    const supabase = getSupabase()
    if (!supabase) return { data: null, error: new Error('Supabase not available') }

    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: customRedirectTo || window.location.origin },
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

  // Login with email/password
  const loginWithEmail = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) return { data: null, error: new Error('Supabase not available') }

    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error logging in with email:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Sign up with email/password
  const signUpWithEmail = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) return { data: null, error: new Error('Supabase not available') }

    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error signing up with email:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Complete user registration
  const completeRegistration = async (profileData: {
    name: string
    gender: string
    dateOfBirth: string
    timezone?: string
    language?: string
  }) => {
    const supabase = getSupabase()
    if (!supabase || !user.value) return { data: null, error: new Error('Not available') }

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: user.value.id,
          email: user.value.email,
          name: profileData.name,
          gender: profileData.gender,
          date_of_birth: profileData.dateOfBirth,
          timezone: profileData.timezone || 'America/Mexico_City',
          language: profileData.language || 'es',
          created_at: new Date().toISOString(),
        }])

      if (error) throw error
      needsRegistration.value = false
      return { data, error: null }
    } catch (error) {
      console.error('Error completing registration:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Update user profile
  const updateProfile = async (profileData: {
    name?: string
    gender?: string
    dateOfBirth?: string
    timezone?: string
    language?: string
  }) => {
    const supabase = getSupabase()
    if (!supabase || !user.value) return { data: null, error: new Error('Not available') }

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          gender: profileData.gender,
          date_of_birth: profileData.dateOfBirth,
          timezone: profileData.timezone,
          language: profileData.language,
        })
        .eq('id', user.value.id)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Generate or retrieve anonymous session ID
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

  // Capture referral code from URL (?ref=CODE)
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

  // Register referral with backend
  const registerReferral = async (userId: string) => {
    if (!pendingReferralCode.value || !userId) return

    const apiUrl = getApiUrl()
    try {
      const response = await fetch(`${apiUrl}/api/referral/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, referralCode: pendingReferralCode.value }),
      })

      const data = await response.json()
      if (data.success) {
        console.log('✅ Referral registered successfully')
      }

      pendingReferralCode.value = null
      if (import.meta.client) localStorage.removeItem('pendingReferralCode')
    } catch (error) {
      console.error('❌ Failed to register referral:', error)
    }
  }

  // Load user reading permissions
  const loadReadingPermissions = async () => {
    const apiUrl = getApiUrl()
    const userId = user.value?.id || 'anonymous'

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${apiUrl}/api/user/reading-permissions/${userId}`, {
        signal: controller.signal,
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
    } catch (error: any) {
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

  // Record a reading
  const recordReading = async (revealedFuture = false) => {
    if (!user.value?.id) return

    const apiUrl = getApiUrl()
    try {
      const response = await fetch(`${apiUrl}/api/user/record-reading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.value.id, revealedFuture }),
      })

      if (response.ok) {
        await loadReadingPermissions()
      }
    } catch (error) {
      console.error('❌ Error recording reading:', error)
    }
  }

  // Load user subscription
  const loadUserSubscription = async () => {
    if (!user.value?.id) return

    const apiUrl = getApiUrl()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${apiUrl}/api/user/subscription/${user.value.id}`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        userSubscription.value = await response.json()
      } else {
        userSubscription.value = { plan_name: 'Gratuito', has_active_subscription: false }
      }
    } catch (error: any) {
      userSubscription.value = { plan_name: 'Gratuito', has_active_subscription: false }
    }
  }

  // Check if user can ask a question
  const checkCanAskQuestion = async () => {
    if (!user.value?.id) return false
    const apiUrl = getApiUrl()
    try {
      const response = await fetch(`${apiUrl}/api/user/can-ask/${user.value.id}`)
      if (response.ok) {
        const data = await response.json()
        return data.canAsk
      }
    } catch (error) {
      console.error('Error checking question permission:', error)
    }
    return false
  }

  // Record a user question
  const recordQuestion = async (question: string, response: string, cards: any[] = [], isPremium = false) => {
    if (!user.value?.id) return
    const apiUrl = getApiUrl()
    try {
      await fetch(`${apiUrl}/api/user/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.value.id, question, response, cards, isPremium }),
      })
      await loadUserSubscription()
    } catch (error) {
      console.error('Error recording question:', error)
    }
  }

  // Logout
  const logout = async () => {
    const supabase = getSupabase()
    if (!supabase) return

    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
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
    // Subscription
    userSubscription,
    isSubscriptionActive,
    isPremiumUser,
    canAskQuestion,
    questionsRemaining,
    currentPlan,
    // Reading permissions
    readingPermissions,
    canReadToday,
    canSeeFuture,
    freeFuturesRemaining,
    isAnonymousUser,
    anonymousSessionId,
    // Auth functions
    initAuth,
    setupAuthListener,
    loginWithGoogle,
    loginWithFacebook,
    loginWithEmail,
    signUpWithEmail,
    completeRegistration,
    updateProfile,
    logout,
    // Subscription functions
    loadUserSubscription,
    checkCanAskQuestion,
    recordQuestion,
    // Reading permissions functions
    loadReadingPermissions,
    recordReading,
    getAnonymousSessionId,
    // Warmup
    performWarmup,
    showWarmupMessage,
    // Referral
    captureReferralCode,
    registerReferral,
    pendingReferralCode,
  }
})
