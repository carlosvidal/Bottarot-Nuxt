/**
 * Global route middleware: strip trailing slashes.
 * Fires during client-side hydration of prerendered pages and during
 * client-side navigation, redirecting /path/ → /path so content queries
 * resolve correctly (Nuxt Content paths have no trailing slash).
 */
export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/' && to.path.endsWith('/')) {
    const { path, query, hash } = to
    return navigateTo(
      { path: path.replace(/\/+$/, ''), query, hash },
      { redirectCode: 301 },
    )
  }
})
