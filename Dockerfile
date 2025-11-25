# ============================
# 1. Base image
# ============================
FROM node:20-slim

# Fix node-gyp and sharp
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# ============================
# 2. Create working dir
# ============================
WORKDIR /app

# ============================
# 3. Install dependencies
# ============================
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# ============================
# 4. Copy source code
# ============================
COPY . .

# ============================
# 5. Payload v3 DOES NOT NEED build step
#    Admin panel builds at runtime automatically
# ============================

# ============================
# 6. Expose port
# ============================
EXPOSE 3000

# ============================
# 7. Start server
# ============================
CMD ["pnpm", "run", "start"]
