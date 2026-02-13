import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog_en: defineCollection({
      source: 'blog/en/**',
      type: 'page',
      schema: z.object({
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
      }),
    }),
    blog_es: defineCollection({
      source: 'blog/es/**',
      type: 'page',
      schema: z.object({
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
      }),
    }),
  },
})
