# =========================
# 1. BUILD STAGE
# =========================
FROM node:22 AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Solo dependencias primero (cache optimizada)
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN npm install

# Copiamos el resto del código
COPY . .

# Prisma generate en build
RUN npx prisma generate

# (opcional) build si tuvieras TS
# RUN pnpm build


# =========================
# 2. RUNTIME STAGE
# =========================
FROM node:22-slim AS runner

RUN apt-get update && apt-get install -y libreoffice --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Solo lo necesario del build anterior
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src ./src

# Si usas otros folders necesarios
# COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "dev"]