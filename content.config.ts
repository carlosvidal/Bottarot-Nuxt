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
})

export default defineContentConfig({
  collections: {
    blog_en: defineCollection({ source: 'blog/en/**', type: 'page', schema: blogSchema }),
    blog_es: defineCollection({ source: 'blog/es/**', type: 'page', schema: blogSchema }),
    blog_it: defineCollection({ source: 'blog/it/**', type: 'page', schema: blogSchema }),
    blog_pt: defineCollection({ source: 'blog/pt/**', type: 'page', schema: blogSchema }),
    blog_fr: defineCollection({ source: 'blog/fr/**', type: 'page', schema: blogSchema }),
  },
})
