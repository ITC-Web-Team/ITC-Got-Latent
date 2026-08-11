# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# ---- deps ----
FROM base AS deps

COPY package.json package-lock.json* ./

RUN npm install jose "prisma@^6" "@prisma/client@^6" tsx --save

# ---- builder ----
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_PROJECT_ID
ENV NEXT_PUBLIC_PROJECT_ID=$NEXT_PUBLIC_PROJECT_ID

RUN npx prisma generate
RUN npm run build

# ---- runner ----
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/next.config.* ./

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]