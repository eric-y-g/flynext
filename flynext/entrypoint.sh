#!/bin/sh

echo "Waiting for the database to be ready..."
echo "Database URL is: $DATABASE_URL"

sleep 3
# Try connecting to the database using Prisma (retry until successful)
until npx prisma db pull > /dev/null 2>&1; do
  echo "Waiting for Postgres to accept connections..."
  sleep 3
done

echo "Running migrations..."
npx prisma migrate deploy

echo "✅ Starting the app..."
npm run start
