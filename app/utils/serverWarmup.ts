/**
 * Server warmup utility for Render.com free tier
 * Helps wake up sleeping servers before making API calls
 *
 * All functions are guarded with import.meta.client checks
 * to be SSR-safe even though they should only be called client-side.
 */

const WARMUP_TIMEOUT = 15000
const SLOW_RESPONSE_THRESHOLD = 3000

export async function wakeUpServer(apiUrl: string, showMessage: ((msg: string) => void) | null = null) {
  if (!import.meta.client) return { success: false, latency: 0, error: 'SSR' }

  const start = performance.now()

  if (!apiUrl) {
    console.warn('⚠️ API URL not configured for warmup')
    return { success: false, latency: 0, error: 'No API URL configured' }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), WARMUP_TIMEOUT)

    const response = await fetch(`${apiUrl}/ping`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const latency = performance.now() - start

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (latency > SLOW_RESPONSE_THRESHOLD && showMessage) {
      showMessage('El oráculo ha despertado ✨')
    }

    return { success: true, latency: Math.round(latency), serverTime: data.time, message: data.message }
  } catch (error: any) {
    const latency = performance.now() - start

    if (error.name === 'AbortError') {
      if (showMessage) showMessage('El servidor está tardando más de lo esperado...')
      return { success: false, latency, error: 'Timeout' }
    } else {
      if (showMessage) showMessage('No se pudo contactar al oráculo 😕')
      return { success: false, latency, error: error.message }
    }
  }
}

export async function smartWarmup(apiUrl: string, showMessage: ((msg: string) => void) | null = null) {
  if (!import.meta.client) return { success: true, latency: 0, skipped: true }

  const lastActivity = localStorage.getItem('lastServerActivity')
  const now = Date.now()
  const SLEEP_THRESHOLD = 15 * 60 * 1000

  if (!lastActivity || (now - parseInt(lastActivity)) > SLEEP_THRESHOLD) {
    const result = await wakeUpServer(apiUrl, showMessage)
    if (result.success) {
      localStorage.setItem('lastServerActivity', now.toString())
    }
    return result
  } else {
    return { success: true, latency: 0, skipped: true }
  }
}

export function updateServerActivity() {
  if (!import.meta.client) return
  localStorage.setItem('lastServerActivity', Date.now().toString())
}
