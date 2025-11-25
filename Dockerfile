# ============================
# 1. BASE IMAGE
# ============================
FROM node:20 AS base
WORKDIR /app

# ============================
# 2. INSTALL PNPM
# ============================
RUN npm install -g pnpm

# ============================
# 3. INSTALL DEPENDENCIES
# ============================
FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# ❗️ NO --frozen-lockfile (Render fails with it)
RUN pnpm install

# ============================
# 4. BUILD PHASE
# ============================
FROM deps AS builder
WORKDIR /app

COPY . .

# ----------------------------
# BUILD PAYLOAD ADMIN
# ----------------------------
RUN pnpm payload build

# ----------------------------
# BUILD NEXT.JS
# ----------------------------
RUN pnpm build

# ============================
# 5. RUNNER / PRODUCTION IMAGE
# ============================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what we need for production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Payload Admin build output
COPY --from=builder /app/build ./build

# Next.js build output (.next)
COPY --from=builder /app/.next ./.next

# Public folder
COPY --from=builder /app/public ./public

# Start the Next.js server (Payload runs inside it)
EXPOSE 3000
CMD ["pnpm", "start"]
