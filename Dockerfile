# ---------------------------
# 1. BUILDER — Install deps + build Next.js
# ---------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prefer-frozen-lockfile

# Copy entire project
COPY . .

# Build Next.js (Payload admin is inside .next)
RUN pnpm build



# ---------------------------
# 2. RUNNER — Production image
# ---------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

# Copy only production dependencies (node_modules from builder)
COPY --from=builder /app/node_modules ./node_modules

# Copy Next.js build output
COPY --from=builder /app/.next ./.next

# Copy public folder (must exist)
COPY --from=builder /app/public ./public

# Copy server files
COPY --from=builder /app/src ./src
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/package.json ./package.json

# Start server
EXPOSE 3000
CMD ["pnpm", "start"]
