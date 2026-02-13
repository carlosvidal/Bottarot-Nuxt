<template>
  <div class="blog-post-page">
    <article v-if="post" class="blog-content">
      <!-- Breadcrumb -->
      <nav class="blog-breadcrumb">
        <NuxtLink to="/blog">Blog</NuxtLink>
        <span>/</span>
        <span v-if="post.category">
          <NuxtLink :to="`/blog/category/${post.category}`">{{ formatCategory(post.category) }}</NuxtLink>
          <span>/</span>
        </span>
        <span class="current">{{ post.title }}</span>
      </nav>

      <!-- Header -->
      <header class="blog-post-header">
        <span v-if="post.category" class="blog-post-category">{{ formatCategory(post.category) }}</span>
        <h1>{{ post.title }}</h1>
        <div class="blog-post-meta">
          <span v-if="post.publishedAt" class="meta-date">{{ formatDate(post.publishedAt) }}</span>
          <span v-if="post.readingTime" class="meta-reading">{{ post.readingTime }} min read</span>
        </div>
        <div v-if="post.tags && post.tags.length" class="blog-post-tags">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag"
            :to="`/blog/tag/${tag}`"
            class="tag"
          >
            #{{ tag }}
          </NuxtLink>
        </div>
      </header>

      <!-- Featured image -->
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="blog-post-image"
      />

      <!-- Content body rendered from markdown -->
      <div class="blog-post-body">
        <ContentRenderer v-if="post" :value="post" />
      </div>

      <!-- CTA -->
      <BlogCta />

      <!-- Related posts -->
      <BlogRelated :posts="relatedPosts || []" />
    </article>

    <div v-else class="blog-not-found">
      <h2>Article not found</h2>
      <p>The article you're looking for doesn't exist.</p>
      <NuxtLink to="/blog" class="back-link">Back to Blog</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const slug = route.params.slug

const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog_en')
    .where('stem', 'LIKE', `%${slug}%`)
    .first()
)

// SEO meta
if (post.value) {
  useSeoMeta({
    title: post.value.seo?.title || post.value.title,
    description: post.value.seo?.description || post.value.description,
    ogTitle: post.value.seo?.title || post.value.title,
    ogDescription: post.value.seo?.description || post.value.description,
    ogImage: post.value.seo?.ogImage || post.value.image,
    ogType: 'article',
    articlePublishedTime: post.value.publishedAt,
    articleModifiedTime: post.value.updatedAt || post.value.publishedAt,
    articleTag: post.value.tags,
  })

  useSchemaOrg([
    defineArticle({
      headline: post.value.title,
      description: post.value.description,
      image: post.value.image,
      datePublished: post.value.publishedAt,
      dateModified: post.value.updatedAt || post.value.publishedAt,
      author: {
        name: 'Free Tarot Fun',
        url: 'https://freetarot.fun',
      },
    }),
  ])
}

// Related posts
const { data: relatedPosts } = await useAsyncData(`related-${slug}`, () => {
  if (!post.value?.category) return Promise.resolve([])
  return queryCollection('blog_en')
    .where('category', '=', post.value.category)
    .where('stem', 'NOT LIKE', `%${slug}%`)
    .limit(3)
    .all()
})

const formatCategory = (cat) => {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.blog-post-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 1.5rem 3rem;
}

.blog-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-bottom: 1.5rem;
}

.blog-breadcrumb a {
  color: var(--text-secondary);
  text-decoration: none;
}

.blog-breadcrumb a:hover {
  color: var(--color-accent-text);
}

.blog-breadcrumb .current {
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.blog-post-header {
  margin-bottom: 2rem;
}

.blog-post-category {
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);
  color: var(--color-accent-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.blog-post-header h1 {
  font-size: 2rem;
  color: var(--text-primary);
  margin: 0.5rem 0;
  line-height: 1.3;
}

.blog-post-meta {
  display: flex;
  gap: 1.5rem;
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: 0.5rem;
}

.blog-post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tag {
  font-family: var(--font-ui);
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg-overlay-light);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.3s;
}

.tag:hover {
  background: var(--bg-overlay-medium);
  color: var(--color-accent-text);
}

.blog-post-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.blog-post-body {
  line-height: 1.8;
  color: var(--text-secondary);
}

.blog-post-body :deep(h2) {
  font-size: 1.5rem;
  color: var(--color-accent-text);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.blog-post-body :deep(h3) {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.blog-post-body :deep(p) {
  margin-bottom: 1rem;
}

.blog-post-body :deep(ul), .blog-post-body :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.blog-post-body :deep(li) {
  margin-bottom: 0.5rem;
}

.blog-post-body :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  margin: 1.5rem 0;
  padding: 0.75rem 1.25rem;
  background: var(--bg-overlay-light);
  border-radius: 0 8px 8px 0;
  font-style: italic;
}

.blog-post-body :deep(strong) {
  color: var(--text-primary);
}

.blog-not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.blog-not-found h2 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.blog-not-found p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.back-link {
  color: var(--color-accent-text);
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 600px) {
  .blog-post-header h1 {
    font-size: 1.5rem;
  }
}
</style>
