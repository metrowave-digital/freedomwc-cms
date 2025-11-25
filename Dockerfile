# -------------------------------------------------------
# 1. Base builder image
# -------------------------------------------------------
FROM node:20 AS builder

# Disable prompts
ENV CI=true

# Create app directory
WORKDIR /app

# Copy package.json + lockfile
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies (no dev pruning yet—Payload needs them)
RUN pnpm install

# Copy all source code
COPY . .

# Build Payload Admin UI
RUN pnpm build


# -------------------------------------------------------
# 2. Production image (thin)
# -------------------------------------------------------
FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

# Install pnpm globally
RUN npm install -g pnpm

# Copy only necessary runtime files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# IMPORTANT: Payload admin needs public folder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

EXPOSE 3000

# Run Payload in production mode
CMD ["node", "dist/server.js"]
