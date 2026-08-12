# Mercur B2C storefront (Next.js 15)
FROM node:20-alpine AS deps
WORKDIR /app
COPY apps/storefront/package*.json ./apps/storefront/
WORKDIR /app/apps/storefront
RUN npm install --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/apps/storefront/node_modules ./apps/storefront/node_modules
COPY apps/storefront ./apps/storefront
WORKDIR /app/apps/storefront
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build || (echo "Build failed — check storefront/.env defaults" && exit 1)

FROM node:20-alpine
WORKDIR /app/apps/storefront
ENV NODE_ENV=production
COPY --from=builder /app/apps/storefront /app/apps/storefront
EXPOSE 3000
CMD ["npm", "run", "start"]
