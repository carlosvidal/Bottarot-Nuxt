<template>
    <div class="success-page">
        <div class="success-content">
            <div class="success-icon">
                <div class="sparkle sparkle-1"></div>
                <div class="sparkle sparkle-2"></div>
                <div class="sparkle sparkle-3"></div>
                <div class="star-icon">&#10024;</div>
            </div>
            <h1>{{ t('checkout.successTitle') || 'Payment Successful!' }}</h1>
            <p class="success-message">{{ t('checkout.successMessage') || 'Your premium plan is now active. Enjoy unlimited readings and full future revelations.' }}</p>
            <div class="plan-badge" v-if="planName">
                <span>{{ planName }}</span>
            </div>
            <NuxtLink :to="$localePath('/chat')" class="start-btn">{{ t('checkout.startReading') || 'Start Reading' }}</NuxtLink>
            <NuxtLink :to="$localePath('/profile')" class="profile-link">{{ t('checkout.viewProfile') || 'View Profile' }}</NuxtLink>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'app' })

const { t } = useI18n()
const planName = ref('')

onMounted(() => {
    if (import.meta.client) {
        try {
            const successData = sessionStorage.getItem('paymentSuccess')
            if (successData) {
                const parsed = JSON.parse(successData)
                planName.value = parsed.planName || ''
                // Clean up
                sessionStorage.removeItem('paymentSuccess')
            }
        } catch (e) {
            // Ignore parse errors
        }
    }
})
</script>

<style scoped>
.success-page {
    font-family: var(--font-content);
    background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary), var(--bg-tertiary));
    color: var(--text-primary);
    min-height: 100vh;
    padding: 40px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-content {
    max-width: 600px;
    margin: 0 auto;
    background: var(--bg-overlay-strong);
    padding: 50px 40px;
    border-radius: 16px;
    text-align: center;
    border: 1px solid rgba(255, 215, 0, 0.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
}

.success-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
}

.success-icon {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.star-icon {
    font-size: 4rem;
    animation: pulseIcon 2s ease-in-out infinite;
}

@keyframes pulseIcon {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.9; }
}

.sparkle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--color-accent);
    border-radius: 50%;
    animation: sparkleFloat 3s ease-in-out infinite;
}

.sparkle-1 {
    top: 5px;
    left: 10px;
    animation-delay: 0s;
}

.sparkle-2 {
    top: 15px;
    right: 5px;
    animation-delay: 1s;
}

.sparkle-3 {
    bottom: 10px;
    left: 25px;
    animation-delay: 2s;
}

@keyframes sparkleFloat {
    0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
    50% { opacity: 1; transform: translateY(-10px) scale(1); }
}

h1 {
    color: var(--color-accent-text);
    font-size: 2.2rem;
    margin-bottom: 15px;
    line-height: 1.2;
}

.success-message {
    font-size: 1.15rem;
    line-height: 1.7;
    margin-bottom: 25px;
    color: var(--text-secondary);
}

.plan-badge {
    display: inline-block;
    padding: 8px 20px;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 237, 74, 0.1));
    border: 1px solid var(--color-accent);
    border-radius: 20px;
    color: var(--color-accent-text);
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 30px;
}

.start-btn {
    display: inline-block;
    background: linear-gradient(45deg, var(--btn-primary), var(--btn-primary-hover));
    color: var(--color-white);
    text-decoration: none;
    padding: 15px 40px;
    font-size: 1.2rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-weight: 600;
    margin-bottom: 15px;
}

.start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.profile-link {
    display: block;
    color: var(--color-accent-text);
    text-decoration: none;
    font-size: 0.95rem;
    transition: opacity 0.3s ease;
}

.profile-link:hover {
    opacity: 0.8;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .success-content {
        padding: 35px 25px;
    }

    h1 {
        font-size: 1.8rem;
    }

    .success-message {
        font-size: 1rem;
    }

    .start-btn {
        padding: 14px 30px;
        font-size: 1.1rem;
        width: 100%;
    }
}
</style>
