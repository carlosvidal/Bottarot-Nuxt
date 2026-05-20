/**
 * useLocale composable for Nuxt.
 *
 * Persists the locale via @nuxtjs/i18n and (if signed in) pushes the change
 * to the backend profile so it survives across devices.
 */

const VALID_LANGS = ['es', 'en', 'it', 'pt', 'fr'] as const

export function useLocale() {
  const { locale, setLocale } = useI18n()
  const config = useRuntimeConfig()

  const changeLocale = async (newLocale: string) => {
    if (!VALID_LANGS.includes(newLocale as any)) return

    await setLocale(newLocale as any)

    if (import.meta.client) {
      try {
        const auth = useAuthStore()
        if (auth.user) {
          await fetch(`${config.public.apiUrl}/api/user/profile`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: newLocale }),
          })
        }
      } catch {
        // Silently fail — locale is already changed locally.
      }
    }
  }

  return {
    locale,
    changeLocale,
    VALID_LANGS,
  }
}
