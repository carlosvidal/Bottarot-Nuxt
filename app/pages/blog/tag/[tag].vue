<template>
  <div class="blog-page">
    <div class="blog-hero">
      <NuxtLink :to="localePath('/blog')" class="back-link">&larr; All Articles</NuxtLink>
      <h1 class="blog-hero-title">#{{ tag }}</h1>
    </div>

    <div class="blog-grid">
      <BlogCard
        v-for="post in posts"
        :key="post.path"
        :post="post"
      />
    </div>

    <div v-if="posts && posts.length === 0" class="blog-empty">
      <p>No articles with this tag yet.</p>
    </div>

    <BlogCta />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const tag = route.params.tag
const { locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: `#${tag} - Tarot Blog | Free Tarot Fun`,
  description: `Read all articles tagged "${tag}" on Free Tarot Fun.`,
})

const { data: posts } = await useAsyncData(`blog-tag-${locale.value}-${tag}`, () =>
  queryBlogCollection(locale.value)
    .where('tags', 'LIKE', `%${tag}%`)
    .order('publishedAt', 'DESC')
    .all()
)
</script>

<style scoped>
.blog-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
}

.blog-hero {
  text-align: center;
  padding: 2rem 0;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);
}

.back-link:hover {
  color: var(--color-accent-text);
}

.blog-hero-title {
  font-size: 2rem;
  color: var(--color-accent-text);
  margin-top: 0.5rem;
}

.blog-empty {
  text-align: center;
  padding: 3rem;
  color: var(--text-tertiary);
}
</style>
