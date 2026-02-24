<template>
    <div class="checkout-page">
        <AppCheckoutModal
            @close="navigateTo('/')"
            @payment-success="handleSuccess"
        />
    </div>
</template>

<script setup>
definePageMeta({ layout: 'app' })

const auth = useAuthStore()

const handleSuccess = async () => {
    await auth.loadUserSubscription()
    await auth.loadReadingPermissions()
    navigateTo('/checkout-success')
}
</script>

<style scoped>
.checkout-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary), var(--bg-tertiary));
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
