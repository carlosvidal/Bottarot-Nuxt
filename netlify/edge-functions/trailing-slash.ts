/**
 * Netlify Edge Function: strip trailing slashes with 301 redirect.
 * Runs at the CDN edge BEFORE static files are served, so it catches
 * prerendered pages that Netlify would otherwise serve at both /path and /path/.
 */
export default async (request: Request, context: any) => {
  const url = new URL(request.url)

  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    const cleanPath = url.pathname.slice(0, -1)
    return new Response(null, {
      status: 301,
      headers: { Location: cleanPath + url.search },
    })
  }

  return context.next()
}
