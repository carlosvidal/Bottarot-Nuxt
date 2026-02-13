<template>
  <div class="chat-redirect">
    <p>Redirecting to new reading...</p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'app',
})

// Redirect to a new chat with UUID (placeholder - will be fully implemented in Phase 4)
if (import.meta.client) {
  const chatId = crypto.randomUUID()
  navigateTo(`/chat/${chatId}`)
}
</script>

<style scoped>
.chat-redirect {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: var(--text-secondary);
  background: var(--bg-primary);
}
</style>
