<template>
  <div class="blog-page">
    <div class="blog-hero">
      <h1 class="blog-hero-title">{{ t('seo.blog.heroTitle') }}</h1>
      <p class="blog-hero-subtitle">
        {{ t('seo.blog.heroSubtitle') }}
      </p>
    </div>

    <!-- Category filter -->
    <div class="blog-filters">
      <button
        :class="['filter-btn', { active: !selectedCategory }]"
        @click="selectedCategory = ''"
      >
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['filter-btn', { active: selectedCategory === cat }]"
        @click="selectedCategory = cat"
      >
        {{ formatCategory(cat) }}
      </button>
    </div>

    <!-- Blog grid -->
    <div class="blog-grid">
      <BlogCard
        v-for="post in filteredPosts"
        :key="post.path"
        :post="post"
      />
    </div>

    <div v-if="filteredPosts && filteredPosts.length === 0" class="blog-empty">
      <p>No articles found. Check back soon!</p>
    </div>

    <!-- CTA -->
    <BlogCta />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://freetarot.fun'
const localePrefix = locale.value === 'en' ? '' : `/${locale.value}`
const canonicalUrl = `${siteUrl}${localePrefix}/blog`

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
})

useSeoMeta({
  title: t('seo.blog.title'),
  description: t('seo.blog.description'),
  ogTitle: t('seo.blog.title'),
  ogDescription: t('seo.blog.description'),
  ogUrl: canonicalUrl,
  ogImage: `${siteUrl}/og-image.png`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('seo.blog.title'),
  twitterDescription: t('seo.blog.description'),
  twitterImage: `${siteUrl}/og-image.png`,
})

const selectedCategory = ref('')

const { data: posts } = await useAsyncData(`blog-posts-${locale.value}`, () =>
  queryBlogCollection(locale.value)
    .order('publishedAt', 'DESC')
    .all()
, { watch: [locale] })

const categories = computed(() => {
  if (!posts.value) return []
  const cats = [...new Set(posts.value.map(p => p.category).filter(Boolean))]
  return cats.sort()
})

const filteredPosts = computed(() => {
  if (!posts.value) return []
  if (!selectedCategory.value) return posts.value
  return posts.value.filter(p => p.category === selectedCategory.value)
})

const formatCategory = (cat) => {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
</script>

<style scoped>
.blog-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
}

.blog-hero {
  text-align: center;
  padding: 3rem 0 2rem;
}

.blog-hero-title {
  font-size: 2.5rem;
  color: var(--color-accent-text);
  margin-bottom: 0.75rem;
}

.blog-hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.blog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.filter-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: var(--border-primary);
  color: var(--text-primary);
}

.filter-btn.active {
  background: var(--btn-secondary);
  color: var(--color-white);
  border-color: var(--btn-secondary);
}

.blog-empty {
  text-align: center;
  padding: 3rem;
  color: var(--text-tertiary);
}

@media (max-width: 600px) {
  .blog-hero-title {
    font-size: 1.75rem;
  }
}
</style>
