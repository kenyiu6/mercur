# Mercur backend (Medusa v2 + Mercur core)
FROM oven/bun:1.3-alpine AS deps
WORKDIR /app
COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages
RUN bun install --frozen-lockfile

FROM oven/bun:1.3-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cd apps/api && bun run build || true

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app /app
RUN npm install -g @medusajs/medusa-cli || true
EXPOSE 9000
WORKDIR /app/apps/api
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
