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

# Only copy /public IF you have it. 
# NOTE: The source "public" directory MUST exist on your host machine 
# for this line to work. If it might be missing, create it locally first.
COPY public ./public

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
# Note: The builder stage copy ensures this exists in the image now
COPY --from=builder /app/public ./public

# Payload Admin build output
COPY --from=builder /app/build ./build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]