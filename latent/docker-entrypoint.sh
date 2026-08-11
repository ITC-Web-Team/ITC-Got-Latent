#!/bin/sh
set -e

echo "Syncing database schema..."
npx prisma db push --skip-generate --accept-data-loss

echo "Seeding clubs (safe to re-run — upserts by slug)..."
npx prisma db seed

echo "Starting Next.js..."
exec npm run start -- -p "${PORT:-3000}"