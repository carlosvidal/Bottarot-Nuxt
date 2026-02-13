/**
 * useLocale composable for Nuxt
 *
 * In Nuxt with @nuxtjs/i18n, most locale functionality is handled by the module:
 * - Browser language detection via `detectBrowserLanguage` config
 * - Locale persistence via cookie (`i18n_locale`)
 * - URL prefix management via `strategy: 'prefix_except_default'`
 *
 * This composable adds Supabase profile language sync on top.
 */

const VALID_LANGS = ['es', 'en', 'it', 'pt', 'fr'] as const

export function useLocale() {
  const { locale, setLocale } = useI18n()

  const changeLocale = async (newLocale: string) => {
    if (!VALID_LANGS.includes(newLocale as any)) return

    await setLocale(newLocale)

    // Sync with Supabase profile if user is logged in
    if (import.meta.client) {
      try {
        const auth = useAuthStore()
        if (auth.user) {
          const { $supabase } = useNuxtApp()
          const supabase = $supabase as any
          await supabase
            .from('profiles')
            .update({ language: newLocale })
            .eq('id', auth.user.id)
        }
      } catch {
        // Silently fail - language is still changed locally
      }
    }
  }

  return {
    locale,
    changeLocale,
    VALID_LANGS,
  }
}
