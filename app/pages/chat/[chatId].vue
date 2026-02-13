<template>
  <div class="chat-page">
    <div class="chat-placeholder">
      <h2>Tarot Chat</h2>
      <p>Chat functionality will be migrated in Phase 4.</p>
      <p>Chat ID: {{ chatId }}</p>
      <NuxtLink to="/" class="back-link">Back to Home</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'app',
  middleware: 'auth',
})

const route = useRoute()
const chatId = route.params.chatId
</script>

<style scoped>
.chat-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}

.chat-placeholder {
  text-align: center;
  padding: 2rem;
}

.chat-placeholder h2 {
  color: var(--color-accent-text);
  margin-bottom: 1rem;
}

.chat-placeholder p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--color-accent-text);
  text-decoration: none;
}
</style>
