import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  image: z.string().optional(),
  locale: z.string().optional(),
  readingTime: z.number().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
  sitemap: z.object({
    loc: z.string().optional(),
    lastmod: z.string().optional(),
  }).optional(),
})

export default defineContentConfig({
  collections: {
    blog_en: defineCollection({
      source: { include: 'blog/en/**', prefix: '/blog' },
      type: 'page',
      schema: blogSchema,
    }),
    blog_es: defineCollection({
      source: { include: 'blog/es/**', prefix: '/es/blog' },
      type: 'page',
      schema: blogSchema,
    }),
    blog_it: defineCollection({
      source: { include: 'blog/it/**', prefix: '/it/blog' },
      type: 'page',
      schema: blogSchema,
    }),
    blog_pt: defineCollection({
      source: { include: 'blog/pt/**', prefix: '/pt/blog' },
      type: 'page',
      schema: blogSchema,
    }),
    blog_fr: defineCollection({
      source: { include: 'blog/fr/**', prefix: '/fr/blog' },
      type: 'page',
      schema: blogSchema,
    }),
  },
})
