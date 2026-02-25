# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build-time env vars for prerendering (overridable at runtime)
ARG NUXT_PUBLIC_API_URL=https://backend.freetarot.fun
ARG NUXT_PUBLIC_SUPABASE_URL=https://apmgbxcokozyqhmpjivt.supabase.co
ARG NUXT_PUBLIC_SUPABASE_ANON_KEY
ARG NUXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NUXT_PUBLIC_SITE_URL=https://freetarot.fun
ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_ANON_KEY=$NUXT_PUBLIC_SUPABASE_ANON_KEY
ENV NUXT_PUBLIC_PAYPAL_CLIENT_ID=$NUXT_PUBLIC_PAYPAL_CLIENT_ID
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

# 4GB heap needed for prerendering 1,500+ blog articles
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build Nuxt (generates .output/)
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Copy only the built output (includes server + public assets)
COPY --from=build /app/.output .output

# Nuxt Nitro server listens on port 3000 by default
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the Nitro server
CMD ["node", ".output/server/index.mjs"]
