<template>
  <NuxtLink :to="postUrl" class="blog-card">
    <div class="blog-card-image">
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        loading="lazy"
      />
      <div v-else class="blog-card-placeholder">
        <span>&#x2728;</span>
      </div>
    </div>
    <div class="blog-card-body">
      <span v-if="post.category" class="blog-card-category">{{ formatCategory(post.category) }}</span>
      <h3 class="blog-card-title">{{ post.title }}</h3>
      <p class="blog-card-excerpt">{{ post.description }}</p>
      <div class="blog-card-meta">
        <span v-if="post.readingTime" class="blog-card-time">{{ post.readingTime }} min read</span>
        <span v-if="post.publishedAt" class="blog-card-date">{{ formatDate(post.publishedAt) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const { locale } = useI18n()
const localePath = useLocalePath()

const postUrl = computed(() => {
  // post.path already includes the correct locale prefix (e.g., /blog/career/slug or /es/blog/career/slug)
  if (props.post.path) return props.post.path
  // Fallback: extract slug from stem
  const stem = props.post.stem || ''
  const slug = stem.split('/').pop() || props.post.slug || ''
  return localePath(`/blog/${slug}`)
})

const formatCategory = (cat) => {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (date) => {
  const localeMap = { en: 'en-US', es: 'es-ES', it: 'it-IT', pt: 'pt-BR', fr: 'fr-FR' }
  return new Date(date).toLocaleDateString(localeMap[locale.value] || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.blog-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid var(--border-subtle);
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow-md);
}

.blog-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--bg-elevated);
}

.blog-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.blog-card:hover .blog-card-image img {
  transform: scale(1.05);
}

.blog-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
}

.blog-card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-card-category {
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);
  color: var(--color-accent-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.blog-card-title {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.blog-card-excerpt {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-family: var(--font-ui);
  font-size: 0.8rem;
  color: var(--text-tertiary);
}
</style>
