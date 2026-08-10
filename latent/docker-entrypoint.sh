#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding clubs (safe to re-run — upserts by slug)..."
npx prisma db seed

echo "Starting Next.js..."
exec npm run start -- -p "${PORT:-3000}"
