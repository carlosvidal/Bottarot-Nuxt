<template>
  <footer class="app-footer">
    <div class="footer-links">
      <NuxtLink :to="$localePath('/terms')">{{ $t('landing.footer.terms') }}</NuxtLink>
      <span class="separator">|</span>
      <NuxtLink :to="$localePath('/privacy')">{{ $t('landing.footer.privacy') }}</NuxtLink>
      <span class="separator">|</span>
      <NuxtLink :to="$localePath('/cookies')">{{ $t('landing.footer.cookies') }}</NuxtLink>
    </div>
    <div class="lang-switcher">
      <button
        v-for="lang in availableLangs"
        :key="lang.code"
        :class="['lang-btn', { active: currentLocale === lang.code }]"
        @click="switchLang(lang.code)"
      >
        {{ lang.label }}
      </button>
    </div>
  </footer>
</template>

<script setup>
const route = useRoute()
const { locale, setLocale } = useI18n()

const currentLocale = computed(() => locale.value)

const availableLangs = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'pt', label: 'PT' },
  { code: 'fr', label: 'FR' },
]

const isBlogArticlePage = computed(() => {
  return route.name?.toString().startsWith('blog-slug') || route.path.match(/^(\/[a-z]{2})?\/blog\/.+/)
})

const switchLang = async (code) => {
  if (isBlogArticlePage.value) {
    // Blog articles have different slugs per language — redirect to blog index
    const blogPath = code === 'en' ? '/blog' : `/${code}/blog`
    await setLocale(code)
    await navigateTo(blogPath)
  } else {
    setLocale(code)
  }
}
</script>

<style scoped>
.app-footer {
  padding: 15px;
  border-top: 1px solid var(--border-primary);
  text-align: center;
}

.footer-links {
  margin-bottom: 10px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  margin: 0 15px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--color-accent-text);
}

.footer-links .separator {
  color: var(--text-tertiary);
}

.lang-switcher {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lang-btn {
  background: none;
  border: 1px solid transparent;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.lang-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.lang-btn.active {
  color: var(--color-accent-text);
  border-color: var(--color-accent-text);
  font-weight: bold;
}

@media (max-width: 600px) {
  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .footer-links .separator {
    display: none;
  }

  .footer-links a {
    margin: 0;
  }
}
</style>
