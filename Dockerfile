# ============================================================
#  ALEX.STORE - imagen de producción (Node + Next.js standalone)
# ============================================================
#  Build de la app en una etapa y servidor mínimo en otra.
# ============================================================

# ---- Etapa 1: construir la app ----
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT_STANDALONE=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Etapa 2: servidor mínimo de producción ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S app && adduser -S app -G app

# servidor standalone + assets estáticos
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# datos iniciales de la tienda (store.json). analytics.json se crea en runtime.
COPY --from=builder /app/data/store.json ./data/store.json

# directorios escribibles para persistir fotos y estadísticas
RUN mkdir -p /app/data /app/public/uploads \
    && chown -R app:app /app

USER app
EXPOSE 3000

CMD ["node", "server.js"]
