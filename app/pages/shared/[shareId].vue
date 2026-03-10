<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const { t } = useI18n()
const API_URL = config.public.apiUrl
const SITE_URL = config.public.siteUrl || 'https://freetarot.fun'

// Fetch shared reading data (SSR-compatible via useFetch)
const { data: sharedData, error, status } = await useFetch(
    `${API_URL}/api/shared/${route.params.shareId}`,
    { key: `shared-${route.params.shareId}` }
)

// Extract readings from response
const sharedReadings = computed(() => {
    if (!sharedData.value) return []
    return sharedData.value.readings || []
})

const sharedTitle = computed(() => {
    return sharedData.value?.share?.title || 'Shared Tarot Reading'
})

const sharedDescription = computed(() => {
    return sharedData.value?.share?.interpretation_summary || 'A tarot reading shared from Free Tarot Fun'
})

const sharedImage = computed(() => {
    return sharedData.value?.share?.preview_image_url || `${SITE_URL}/og-share-default.jpg`
})

const shareUrl = computed(() => {
    return `${SITE_URL}/shared/${route.params.shareId}`
})

// SEO meta tags (works on server for SSR)
useSeoMeta({
    title: () => `${sharedTitle.value} | Free Tarot Fun`,
    ogTitle: () => `${sharedTitle.value} | Free Tarot Fun`,
    description: () => sharedDescription.value,
    ogDescription: () => sharedDescription.value,
    ogImage: () => sharedImage.value,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogUrl: () => shareUrl.value,
    ogType: 'article',
    ogSiteName: 'Free Tarot Fun',
    ogLocale: 'es_ES',
    twitterCard: 'summary_large_image',
    twitterTitle: () => `${sharedTitle.value} | Free Tarot Fun`,
    twitterDescription: () => sharedDescription.value,
    twitterImage: () => sharedImage.value,
    robots: 'index, follow',
})

useHead({
    link: [
        { rel: 'canonical', href: shareUrl.value },
    ],
})
</script>

<template>
    <div class="shared-chat-layout">
        <header class="shared-header">
            <div class="header-content">
                <h1>Free Tarot Fun</h1>
                <p>{{ t('share.sharedReading') || 'Shared Tarot Reading' }}</p>
            </div>
        </header>

        <main class="shared-content">
            <div v-if="status === 'pending'" class="loading-message">
                <div class="spinner"></div>
                <p>{{ t('share.loading') || 'Loading shared reading...' }}</p>
            </div>

            <div v-else-if="error" class="error-message">
                <h2>{{ t('share.notFound') || 'Reading Not Found' }}</h2>
                <p>{{ t('share.notFoundMessage') || 'This shared reading could not be found or may have expired.' }}</p>
                <NuxtLink :to="$localePath('/chat')" class="home-link">{{ t('share.createOwn') || 'Create Your Own Reading' }}</NuxtLink>
            </div>

            <div v-else-if="sharedReadings.length === 0" class="empty-message">
                <h2>{{ t('share.emptyChat') || 'Empty Reading' }}</h2>
                <p>{{ t('share.emptyChatMessage') || 'This reading does not contain any messages.' }}</p>
                <NuxtLink :to="$localePath('/chat')" class="home-link">{{ t('share.createOwn') || 'Create Your Own Reading' }}</NuxtLink>
            </div>

            <div v-else class="readings-container">
                <div class="readings-list">
                    <AppReading
                        v-for="reading in sharedReadings"
                        :key="reading.id"
                        :reading-data="reading"
                        :is-shared="true"
                    />
                </div>

                <div class="shared-footer">
                    <p>{{ t('share.sharedAnonymously') || 'This reading has been shared anonymously' }}</p>
                    <NuxtLink :to="$localePath('/chat')" class="cta-button">{{ t('share.createOwn') || 'Create Your Own Reading' }}</NuxtLink>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.shared-chat-layout {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary), var(--bg-tertiary));
    color: var(--text-secondary);
}

/* Header */
.shared-header {
    background: var(--bg-input);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-primary);
    padding: 20px;
}

.header-content {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
}

.shared-header h1 {
    color: var(--color-accent-text);
    font-size: 2rem;
    margin-bottom: 8px;
}

.shared-header p {
    color: var(--text-secondary);
    font-size: 1.1rem;
}

/* Content */
.shared-content {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

/* Loading */
.loading-message {
    text-align: center;
    padding: 60px 20px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-primary);
    border-top: 4px solid var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error and Empty states */
.error-message, .empty-message {
    text-align: center;
    padding: 60px 20px;
}

.error-message h2, .empty-message h2 {
    color: var(--color-accent-text);
    font-size: 1.8rem;
    margin-bottom: 15px;
}

.error-message p, .empty-message p {
    font-size: 1.1rem;
    margin-bottom: 30px;
    line-height: 1.6;
}

/* Links and buttons */
.home-link, .cta-button {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(45deg, var(--color-accent), var(--color-accent-light));
    color: var(--bg-primary);
    text-decoration: none;
    border-radius: 25px;
    font-weight: bold;
    transition: all 0.3s ease;
}

.home-link:hover, .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

/* Readings */
.readings-container {
    min-height: 400px;
}

.readings-list {
    margin-bottom: 40px;
}

/* Shared footer */
.shared-footer {
    text-align: center;
    padding: 40px 20px;
    border-top: 1px solid rgba(255, 215, 0, 0.2);
    margin-top: 40px;
}

.shared-footer p {
    color: var(--text-secondary);
    margin-bottom: 20px;
    font-size: 0.95rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .shared-header {
        padding: 15px;
    }

    .shared-header h1 {
        font-size: 1.6rem;
    }

    .shared-header p {
        font-size: 1rem;
    }

    .shared-content {
        padding: 15px;
    }

    .loading-message, .error-message, .empty-message {
        padding: 40px 15px;
    }
}
</style>
