#!/bin/sh
set -e

# Wait for the database to be ready
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

# Run database migrations
echo "Running database migrations..."
pnpm db:push

# Start the development server
echo "Starting Next.js development server..."
exec pnpm dev 