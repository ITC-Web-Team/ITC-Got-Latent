# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# ---- deps: install everything once, cached as its own layer ----
FROM base AS deps
COPY package.json package-lock.json* ./
# jose (session JWTs), prisma + @prisma/client (pinned to 6.x — Prisma 7
# removed `url` from schema.prisma in favor of prisma.config.ts, which this
# project doesn't use), and tsx (to run prisma/seed.ts).
# Only needed here if they aren't already pinned in package.json.
RUN npm install jose "prisma@^6" "@prisma/client@^6" tsx --save

# ---- builder: generate the Prisma client and build Next.js ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so
# this one has to be passed as a build ARG, not just a runtime env var.
ARG NEXT_PUBLIC_PROJECT_ID
ENV NEXT_PUBLIC_PROJECT_ID=$NEXT_PUBLIC_PROJECT_ID

RUN npx prisma generate
RUN npm run build

# ---- runner: smaller final image ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.* ./
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]