<template>
  <div v-if="posts && posts.length > 0" class="blog-related">
    <h3 class="blog-related-title">Related Articles</h3>
    <div class="blog-related-grid">
      <BlogCard
        v-for="post in posts"
        :key="post._path"
        :post="post"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.blog-related {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
}

.blog-related-title {
  font-size: var(--font-size-xl);
  color: var(--color-accent-text);
  margin-bottom: 1.5rem;
}

.blog-related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
