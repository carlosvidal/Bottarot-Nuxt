<template>
  <div class="blog-cta">
    <div class="blog-cta-icon">&#x1F52E;</div>
    <h3 class="blog-cta-title">{{ title || 'Get Your Free Tarot Reading' }}</h3>
    <p class="blog-cta-text">{{ text || 'Discover what the cards have in store for you. Our AI-powered tarot reader provides personalized insights about your past, present, and future.' }}</p>
    <NuxtLink :to="$localePath('/chat')" class="blog-cta-button">
      {{ buttonText || 'Start Free Reading' }}
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
  buttonText: { type: String, default: '' },
})
</script>

<style scoped>
.blog-cta {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
  border: 1px solid var(--accent-border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  margin: 2.5rem 0;
}

.blog-cta-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.blog-cta-title {
  font-size: var(--font-size-xl);
  color: var(--color-accent-text);
  margin-bottom: 0.75rem;
}

.blog-cta-text {
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  max-width: 500px;
  margin: 0 auto 1.25rem;
  line-height: 1.6;
}

.blog-cta-button {
  display: inline-block;
  background: var(--btn-primary);
  color: var(--color-white);
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: var(--font-size-md);
  text-decoration: none;
  transition: background 0.3s, transform 0.2s;
}

.blog-cta-button:hover {
  background: var(--btn-primary-hover);
  transform: translateY(-2px);
  color: var(--color-white);
}
</style>
