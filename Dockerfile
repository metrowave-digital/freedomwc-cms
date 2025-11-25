# ============================================
# 1) BUILDER — Install deps + build Next.js + Payload Admin
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./tsconfig.json

# Install dependencies
RUN pnpm install

# Copy source files
COPY src ./src
COPY next.config.mjs ./
COPY eslint.config.mjs ./
COPY playwright.config.ts ./
COPY vitest.config.mts ./
COPY vitest.setup.ts ./

# Copy Payload config
COPY src/payload.config.ts ./src/payload.config.ts

# Only copy /public IF you have it
# (this won't break if it's missing)
RUN mkdir -p public
COPY public ./public 2>/dev/null || true

# Build Next.js
RUN pnpm build

# Build Payload Admin
RUN pnpm payload:build


# ============================================
# 2) RUNNER — minimal image for production
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/public ./public 2>/dev/null || true

# Payload Admin build output
COPY --from=builder /app/build ./build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]
