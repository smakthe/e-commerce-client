# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder

WORKDIR /app

# Install dependencies first (layer-cached unless lockfile changes)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build


# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Drop the default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Inject our custom site config (sourced from the build context, not builder stage)
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy the compiled Vite output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]