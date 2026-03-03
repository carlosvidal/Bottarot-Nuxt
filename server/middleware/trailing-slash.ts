/**
 * Nitro server middleware: strip trailing slashes with 301 redirect.
 * Handles SSR routes. Prerendered pages are served as static files by Netlify
 * and don't pass through this middleware (the route middleware handles those).
 */
export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (path !== '/' && path.endsWith('/')) {
    return sendRedirect(event, path.slice(0, -1), 301)
  }
})
