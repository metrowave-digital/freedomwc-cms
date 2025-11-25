# ============================
# 1. Base Builder Image
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./tsconfig.json
COPY public ./public
COPY src ./src
COPY payload.config.ts ./payload.config.ts

# Install dependencies
RUN pnpm install

# Generate Payload types and import-map
RUN pnpm payload generate:types
RUN pnpm payload generate:importmap

# Build Next.js (includes Payload admin)
RUN pnpm build


# ============================
# 2. Runner Image
# ============================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy ONLY required runtime files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules

# NEXT.JS BUILD OUTPUT
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# COPY SOURCE (Payload needs these for server runtime)
COPY --from=builder /app/src ./src
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["pnpm", "start"]
