<template>
  <div class="app-layout">
    <CommonAppHeader />
    <main class="app-main">
      <slot />
    </main>
    <CommonAppFooter />
  </div>
</template>

<script setup>
useBackendWakeUp()
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary), var(--bg-tertiary));
  color: var(--text-primary);
  font-family: var(--font-content);
}

.app-main {
  flex-grow: 1;
}
</style>
