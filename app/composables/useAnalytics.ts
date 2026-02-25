/**
 * Composable for Google Analytics event tracking (SSR-safe).
 * Uses nuxt-gtag under the hood — gtag is loaded by the module
 * and consent is managed via Google Consent Mode v2 + vanilla-cookieconsent.
 */
export function useAnalytics() {
  const { gtag } = useGtag()

  const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
    if (!import.meta.client) return
    gtag('event', eventName, eventParams)
  }

  // Auth
  const trackSignUp = (method = 'email') => trackEvent('sign_up', { method })
  const trackLogin = (method = 'email') => trackEvent('login', { method })
  const trackLogout = () => trackEvent('logout')

  // Tarot Core
  const trackTarotReadingStart = (questionLength = 0) => trackEvent('tarot_reading_start', { question_length: questionLength })
  const trackTarotReadingComplete = (cardsDrawn = 3) => trackEvent('tarot_reading_complete', { cards_drawn: cardsDrawn })
  const trackTarotCardsRevealed = (cardNames: string[] = []) => trackEvent('tarot_cards_revealed', { cards: cardNames.join(', ') })
  const trackTarotTTSPlay = () => trackEvent('tarot_tts_play')
  const trackTarotReadingShare = (chatId = '') => trackEvent('tarot_reading_share', { chat_id: chatId })
  const trackTarotReadingFavorite = (isFavorite = true) => trackEvent('tarot_reading_favorite', { action: isFavorite ? 'add' : 'remove' })

  // Conversion
  const trackViewCheckout = (plan = '') => trackEvent('view_checkout', { plan })
  const trackBeginCheckout = (plan = '', value = 0) => trackEvent('begin_checkout', { plan, currency: 'USD', value })
  const trackPurchase = (plan = '', value = 0, transactionId = '') => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      plan,
      currency: 'USD',
      value,
      items: [{ item_id: plan, item_name: `${plan} subscription`, price: value, quantity: 1 }],
    })
  }
  const trackUpgradePromptView = (source = '') => trackEvent('upgrade_prompt_view', { source })

  // Limits
  const trackWeeklyLimitReached = (chatsUsed = 0) => trackEvent('weekly_limit_reached', { chats_used: chatsUsed })
  const trackWeeklyLimitModalView = () => trackEvent('weekly_limit_modal_view')
  const trackUpgradeFromLimit = () => trackEvent('upgrade_from_limit')

  // Engagement
  const trackFirstReading = () => trackEvent('first_reading')
  const trackProfileComplete = (fieldsCompleted: string[] = []) => trackEvent('profile_complete', { fields: fieldsCompleted.join(', ') })
  const trackLanguageChange = (from = '', to = '') => trackEvent('language_change', { from_language: from, to_language: to })
  const trackGeolocationGranted = () => trackEvent('geolocation_granted')
  const trackGeolocationDenied = () => trackEvent('geolocation_denied')

  // Navigation
  const trackPageView = (pagePath = '', pageTitle = '') => {
    if (!import.meta.client) return
    gtag('event', 'page_view', { page_path: pagePath, page_title: pageTitle })
  }

  // Errors
  const trackError = (errorType = '', errorMessage = '') => trackEvent('error', { error_type: errorType, error_message: errorMessage })

  return {
    trackSignUp, trackLogin, trackLogout,
    trackTarotReadingStart, trackTarotReadingComplete, trackTarotCardsRevealed,
    trackTarotTTSPlay, trackTarotReadingShare, trackTarotReadingFavorite,
    trackViewCheckout, trackBeginCheckout, trackPurchase, trackUpgradePromptView,
    trackWeeklyLimitReached, trackWeeklyLimitModalView, trackUpgradeFromLimit,
    trackFirstReading, trackProfileComplete, trackLanguageChange,
    trackGeolocationGranted, trackGeolocationDenied,
    trackPageView, trackError, trackEvent,
  }
}
