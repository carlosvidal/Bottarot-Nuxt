/**
 * Netlify Edge Function: URL normalization.
 * - Strip trailing slashes: /path/ → /path (301)
 * - Redirect legacy /landing/* URLs to correct locale roots (301)
 */

const LEGACY_REDIRECTS: Record<string, string> = {
  '/landing/en': '/',
  '/landing/es': '/es',
  '/landing/it': '/it',
  '/landing/pt': '/pt',
  '/landing/fr': '/fr',
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url)
  const path = url.pathname

  // Legacy URL redirects
  const legacyTarget = LEGACY_REDIRECTS[path] || LEGACY_REDIRECTS[path.replace(/\/$/, '')]
  if (legacyTarget) {
    return new Response(null, {
      status: 301,
      headers: { Location: legacyTarget },
    })
  }

  // Strip trailing slash
  if (path !== '/' && path.endsWith('/')) {
    return new Response(null, {
      status: 301,
      headers: { Location: path.slice(0, -1) + url.search },
    })
  }

  return context.next()
}
