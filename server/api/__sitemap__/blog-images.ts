import { defineEventHandler } from 'h3'
import { queryCollection } from '@nuxt/content/server'

/**
 * Sitemap source that provides blog post images and lastmod dates.
 * The @nuxtjs/sitemap module merges these entries with auto-discovered URLs,
 * so matching `loc` values get their `images` and `lastmod` data added.
 */
export default defineEventHandler(async (e) => {
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://freetarot.fun'
  const collections = ['blog_en', 'blog_es', 'blog_it', 'blog_pt', 'blog_fr'] as const
  const urls: Array<{ loc: string; lastmod?: string; images: Array<{ loc: string; title: string }> }> = []

  for (const collection of collections) {
    try {
      const posts = await queryCollection(e, collection)
        .select('path', 'title', 'image', 'publishedAt', 'updatedAt')
        .where('path', 'IS NOT NULL')
        .all()

      for (const post of posts) {
        if (post.path) {
          const images: Array<{ loc: string; title: string }> = []

          if (post.image) {
            const imageLoc = post.image.startsWith('http')
              ? post.image
              : `${siteUrl}${post.image}`
            images.push({ loc: imageLoc, title: post.title || '' })
          }

          const entry: { loc: string; lastmod?: string; images: Array<{ loc: string; title: string }> } = {
            loc: post.path,
            images,
          }

          // Add lastmod from updatedAt or publishedAt
          const lastmod = post.updatedAt || post.publishedAt
          if (lastmod) {
            entry.lastmod = new Date(lastmod).toISOString()
          }

          urls.push(entry)
        }
      }
    } catch (err) {
      // Collection might not exist in some builds
      console.warn(`Sitemap: failed to query ${collection}:`, err)
    }
  }

  return urls
})
