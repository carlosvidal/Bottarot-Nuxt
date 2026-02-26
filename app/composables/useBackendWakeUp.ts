/**
 * Sends a single fire-and-forget ping to the backend /health endpoint
 * to wake it up from Render free-tier sleep (~30 s cold start).
 * Runs once per session on the client side.
 */
const pinged = ref(false)

export function useBackendWakeUp() {
  if (import.meta.server || pinged.value) return

  pinged.value = true
  const config = useRuntimeConfig()
  const url = `${config.public.apiUrl}/health`

  fetch(url, { method: 'HEAD', mode: 'cors' }).catch(() => {})
}
