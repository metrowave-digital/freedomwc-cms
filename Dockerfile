# ============================
# 1. Builder
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build Payload admin panel
RUN pnpm payload build

# ============================
# 2. Runner (Production)
# ============================
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build      # Payload admin build
COPY --from=builder /app/public ./public    # static assets
COPY --from=builder /app/src ./src          # your source code
COPY package.json ./

EXPOSE 3000

# Payload runs via the "payload" CLI or server.js entry
CMD ["node", "node_modules/payload/dist/bundles/server.js"]
