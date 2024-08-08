FROM node:18-slim as base
WORKDIR /app

FROM base as builder
RUN apt-get update && \
  apt-get install -y libssl-dev dumb-init && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json pnpm*.yaml ./
RUN npm install -g pnpm \
  && pnpm install --frozen-lockfile

# set these only for build
ENV DATABASE_URL=postgres://localhost:5432/database
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXTAUTH_SECRET="--secret--"
ENV GOOGLE_CLIENT_ID="--google-client-id--"
ENV GOOGLE_CLIENT_SECRET="--google-client-secret--"
ENV EMAIL_SERVER=smtps://smtp.example.com:465
ENV EMAIL_FROM=noreply@example.com
ENV S3_BUCKET=example-bucket
ENV BU_SERVER_URL="http://localhost:8080"
ENV BU_SERVER_API_KEY=key
ENV PORTAL_URL="http://localhost:3000"
ENV SYSADMIN_EMAIL=admin@example.com
ENV BU_INFO_LIST_URL=https://example.com/business-info-list.json

# Build next.js app
ADD . /app
RUN pnpm run build
RUN npx tsup src/drizzle/seed.ts src/drizzle/migrate.ts src/daemons/email-notify-daemon.ts
RUN ls -la dist

# Build the production image
FROM base

RUN apt-get update && \
  apt-get install -y libssl-dev dumb-init poppler-data poppler-utils && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/dist/drizzle/migrate.cjs ./migrate.cjs
COPY --from=builder --chown=nextjs:nodejs /app/dist/drizzle/seed.cjs ./seed.cjs
COPY --from=builder --chown=nextjs:nodejs /app/dist/daemons/email-notify-daemon.cjs ./email-notify-daemon.cjs
ADD ./src/drizzle ./drizzle
ADD ./bin/launch.sh ./launch.sh
ADD ./bin/migrate.sh ./migrate.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["dumb-init", "./launch.sh"]
