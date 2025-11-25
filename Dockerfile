# ============================
# 1. BUILDER IMAGE
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy full project
COPY . .

# Build Next.js (Payload Admin is inside .next)
RUN pnpm build


# ============================
# 2. RUNNER IMAGE
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy ONLY what is required to run Payload + Next.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules

# Copy Next.js build output
COPY --from=builder /app/.next ./.next

# Copy public folder IF it exists
COPY --from=builder /app/public ./public

# Copy your source files (for Payload server runtime)
COPY --from=builder /app/src ./src

# Copy tsconfig
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose web server port
EXPOSE 3000

# Start Next.js server (Payload is inside the Next server)
CMD ["pnpm", "start"]
