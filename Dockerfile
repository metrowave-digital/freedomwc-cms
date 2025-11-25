# ===============================
# 1) BASE / BUILDER
# ===============================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (no frozen lockfile)
RUN pnpm install

# Copy source code
COPY . .

# Build the Payload Admin + Next.js
RUN pnpm build


# ===============================
# 2) RUNNER — PRODUCTION
# ===============================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy ONLY what is needed at runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy Payload config and server files
COPY --from=builder /app/src ./src
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Payload runs inside Next.js via next start
EXPOSE 3000
CMD ["pnpm", "start"]
