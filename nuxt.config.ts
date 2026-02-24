// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-og-image',
    'nuxt-schema-org',
    '@pinia/nuxt',
  ],

  // Runtime config (replaces VITE_ env vars)
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      paypalClientId: process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://freetarot.fun',
    },
  },

  // Global CSS
  css: [
    '~/assets/css/main.css',
  ],

  // App head
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap',
        },
      ],
    },
  },

  // Hybrid rendering: SSG for blog, SSR for landing, CSR for app
  routeRules: {
    // Blog: pre-rendered at build time (SSG)
    '/blog/**': { prerender: true },
    '/blog': { prerender: true },

    // Legal pages: pre-rendered
    '/terms': { prerender: true },
    '/privacy': { prerender: true },
    '/cookies': { prerender: true },

    // Landing pages: SSR for fresh meta tags
    '/': { ssr: true },

    // Shared readings: SSR for OG tags
    '/shared/**': { ssr: true },

    // App pages: CSR only (no SSR needed)
    '/chat/**': { ssr: false },
    '/chat': { ssr: false },
    '/profile': { ssr: false },
    '/checkout': { ssr: false },
    '/checkout-success': { ssr: false },
    '/debug': { ssr: false },
    '/admin': { ssr: false },
  },

  // Site info for SEO modules
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://freetarot.fun',
    name: 'Free Tarot Fun',
    description: 'Free AI-powered tarot readings online',
    defaultLocale: 'en',
  },

  // Nuxt Content
  content: {
    // Content module configuration
  },

  // i18n
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'es', language: 'es-ES', file: 'es.json', name: 'Espanol' },
      { code: 'it', language: 'it-IT', file: 'it.json', name: 'Italiano' },
      { code: 'pt', language: 'pt-BR', file: 'pt.json', name: 'Portugues' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Francais' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    lazy: false,
    langDir: '../i18n/locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
  },

  // Sitemap
  sitemap: {
    exclude: [
      '/chat/**',
      '/chat',
      '/profile',
      '/checkout',
      '/checkout-success',
      '/debug',
      '/admin',
    ],
  },

  // Robots
  robots: {
    disallow: [
      '/chat/',
      '/profile',
      '/checkout',
      '/checkout-success',
      '/debug',
      '/admin',
    ],
  },

  // Schema.org
  schemaOrg: {
    identity: {
      type: 'WebApplication',
      name: 'Free Tarot Fun',
      url: 'https://freetarot.fun',
      description: 'Free AI-powered tarot readings online',
    },
  },
})
