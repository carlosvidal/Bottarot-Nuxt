/**
 * Returns a queryCollection builder for the blog collection matching the given locale.
 * Nuxt Content v3 requires literal string collection names at compile time,
 * so we use a switch instead of dynamic template strings.
 */
export function queryBlogCollection(locale: string) {
  switch (locale) {
    case 'es': return queryCollection('blog_es')
    case 'it': return queryCollection('blog_it')
    case 'pt': return queryCollection('blog_pt')
    case 'fr': return queryCollection('blog_fr')
    default: return queryCollection('blog_en')
  }
}
