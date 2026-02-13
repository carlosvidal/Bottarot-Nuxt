<template>
  <div class="blog-page">
    <div class="blog-hero">
      <h1 class="blog-hero-title">Tarot Blog</h1>
      <p class="blog-hero-subtitle">
        Explore the wisdom of tarot. Learn card meanings, spreads, and spiritual guidance.
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
        :key="post._path"
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

useSeoMeta({
  title: 'Tarot Blog - Card Meanings, Spreads & Guides | Free Tarot Fun',
  description: 'Explore our tarot blog. Learn card meanings, tarot spreads, spiritual guidance, and get free AI-powered tarot readings.',
  ogTitle: 'Tarot Blog | Free Tarot Fun',
  ogDescription: 'Learn card meanings, spreads, and spiritual guidance.',
  ogType: 'website',
})

const selectedCategory = ref('')

const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog_en')
    .order('publishedAt', 'DESC')
    .all()
)

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
