# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Nuxt (generates .output/)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

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
