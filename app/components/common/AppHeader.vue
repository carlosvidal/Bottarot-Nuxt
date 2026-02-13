<template>
  <header class="app-header">
    <NuxtLink to="/" class="logo-link">
      <img src="~/assets/images/Free-Tarot-Fun-logo-darkmode.svg" alt="Free Tarot Fun" class="logo logo-dark" />
      <img src="~/assets/images/Free-Tarot-Fun-logo-lightmode.svg" alt="Free Tarot Fun" class="logo logo-light" />
    </NuxtLink>
    <nav class="header-nav">
      <NuxtLink to="/blog" class="nav-link">{{ $t('nav.blog') }}</NuxtLink>
      <ClientOnly>
        <template v-if="auth.isLoggedIn">
          <NuxtLink to="/profile" class="nav-link">{{ $t('nav.profile') || 'Profile' }}</NuxtLink>
          <NuxtLink to="/chat" class="nav-link nav-cta">{{ $t('nav.freeReading') }}</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/chat" class="nav-link nav-cta">{{ $t('nav.freeReading') }}</NuxtLink>
        </template>
        <template #fallback>
          <NuxtLink to="/chat" class="nav-link nav-cta">{{ $t('nav.freeReading') }}</NuxtLink>
        </template>
      </ClientOnly>
    </nav>
  </header>
</template>

<script setup>
const auth = useAuthStore()
</script>

<style scoped>
.app-header {
  padding: 20px;
  text-align: center;
}

.logo-link {
  display: inline-block;
}

.logo {
  max-width: 240px;
  width: 100%;
  height: auto;
}

.logo-dark {
  display: block;
  margin: 0 auto;
}

.logo-light {
  display: none;
}

:root.light-mode .logo-dark {
  display: none;
}

:root.light-mode .logo-light {
  display: block;
  margin: 0 auto;
}

.header-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.75rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-family: var(--font-ui);
  font-size: var(--font-size-md);
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-cta {
  background: var(--btn-primary);
  color: var(--color-white);
  font-weight: 500;
}

.nav-cta:hover {
  background: var(--btn-primary-hover);
  color: var(--color-white);
}
</style>
