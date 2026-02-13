# Bottarot-Nuxt

Nuxt 3 frontend for **Free Tarot Fun** — an AI-powered tarot reading application. This project replaces the original Vue 3 SPA frontend with hybrid rendering for better SEO performance while keeping the full chat/app functionality intact.

## Architecture

Hybrid rendering via Nuxt `routeRules`:

| Routes | Mode | Reason |
|--------|------|--------|
| `/blog/**` | SSG (prerender) | Maximum SEO, CDN-cached |
| `/`, `/es`, `/en`... | SSR | Fresh meta tags per locale |
| `/shared/**` | SSR | OG tags for social sharing |
| `/terms`, `/privacy`, `/cookies` | SSG | Static content |
| `/chat/**`, `/profile`, `/checkout` | CSR (`ssr: false`) | App logic, SSE streaming, auth |

## Tech Stack

- **Nuxt 4.3** with Nitro server
- **@nuxt/content** — Markdown blog with SSG
- **@nuxtjs/i18n** — 5 languages (en, es, it, pt, fr)
- **@nuxtjs/sitemap** + **@nuxtjs/robots** — SEO automation
- **nuxt-og-image** + **nuxt-schema-org** — Rich results
- **Pinia** — SSR-safe state management
- **Supabase** — Auth (PKCE flow) + database (client-only plugin)

## Project Structure

```
app/
  components/
    app/          # Chat components (Reading, Sidebar, etc.)
    blog/         # Blog components (BlogCard, BlogCta, etc.)
    common/       # Shared (AppHeader, AppFooter)
  composables/    # useLocale
  layouts/        # default (blog/marketing), app (chat)
  middleware/     # auth guard
  pages/
    blog/         # Blog listing + [slug] posts
    chat/         # Chat redirect + [chatId] page
    shared/       # Shared readings (SSR)
    index.vue     # Landing page
  plugins/        # supabase.client.ts, auth-init.client.ts
  stores/         # auth.ts, chats.ts (SSR-safe)
  utils/          # serverWarmup.ts
content/
  blog/           # Markdown posts organized by locale
i18n/
  locales/        # en.json, es.json, it.json, pt.json, fr.json
public/
  img/            # Tarot card images (.webp)
server/
  api/            # Nitro API routes (sitemap sources)
```

## Setup

```bash
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

## Development

```bash
npm run dev
```

Runs on `http://localhost:3000`. The backend API (Bottarot-Backend) should be running on port 3000, so use `NUXT_PUBLIC_API_URL` to point to it.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NUXT_PUBLIC_API_URL` | Backend Express API URL |
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NUXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID |
| `NUXT_PUBLIC_SITE_URL` | Public site URL (for SEO/sitemap) |

All variables are **runtime** (`NUXT_PUBLIC_` prefix) — they can be changed without rebuilding.

## Production Build

```bash
npm run build
```

Output goes to `.output/`. Run the Nitro server:

```bash
node .output/server/index.mjs
```

## Docker

```bash
docker build -t bottarot-nuxt .
docker run -p 3000:3000 --env-file .env bottarot-nuxt
```

Or with Docker Compose from the root `Bottarot/` directory:

```bash
docker-compose up --build nuxt
```

## Deployment (Coolify)

- **Type**: Docker (not Nixpacks)
- **Dockerfile**: `Dockerfile` (multi-stage, node:20-alpine)
- **Port**: 3000 (Nitro server)
- **Env vars**: Set `NUXT_PUBLIC_*` variables in Coolify dashboard

See [DEPLOY_COOLIFY.md](../DEPLOY_COOLIFY.md) for full instructions.

## Related Services

| Service | Repository | Port |
|---------|-----------|------|
| Backend API | `Bottarot-Backend` | 3000 |
| Frontend (legacy) | `Bottarot-FrontEnd` | 80 |
| Automation | `Bottarot-Automation` | — |

## Migration Status

- [x] Phase 1: Scaffolding + Blog (SSG)
- [x] Phase 2: Landing + Legal pages
- [x] Phase 3: Auth + Stores (SSR-safe)
- [ ] Phase 4: Chat + Full app migration
- [ ] Phase 5: QA + Performance
- [ ] Phase 6: AI content pipeline (300+ blog posts)
- [ ] Phase 7: Deploy + Cutover
