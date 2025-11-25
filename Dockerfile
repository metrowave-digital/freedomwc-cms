# ============================
# 1. Base image
# ============================
FROM node:20-slim AS base
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# ============================
# 2. Builder
# ============================
FROM base AS builder

WORKDIR /app

# Copy only package files first
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (NO --frozen-lockfile)
RUN pnpm install

# Copy the rest
COPY . .

# Build Next.js (includes Payload Admin UI)
RUN pnpm build


# ============================
# 3. Runner
# ============================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built next app
COPY --from=builder /app/.next ./.next

# Copy public folder
COPY --from=builder /app/public ./public

# Copy payload config + collections + globals
COPY --from=builder /app/src ./src

# Start server
EXPOSE 3000
CMD ["pnpm", "start"]
