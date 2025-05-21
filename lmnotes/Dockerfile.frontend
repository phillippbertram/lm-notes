# Use Node.js LTS (Long Term Support) as base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy application code
COPY . .

# Build application
RUN pnpm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install pnpm and production dependencies
RUN npm install -g pnpm && \
    pnpm install --prod

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
