FROM node:18-slim as base
WORKDIR /app
COPY package*.json ./

FROM base as builder
RUN apt-get update && \
  apt-get install -y libssl-dev dumb-init && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm ci

# set these only for build
ENV DATABASE_URL=postgres://localhost:5432/database
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXTAUTH_SECRET="--secret--"
ENV GOOGLE_CLIENT_ID="--google-client-id--"
ENV GOOGLE_CLIENT_SECRET="--google-client-secret--"
ENV EMAIL_SERVER=smtps://smtp.example.com:465
ENV EMAIL_FROM=noreply@example.com
ENV S3_BUCKET=example-bucket
ENV BU_SERVER_API_KEY=key

# Build next.js app
ADD . /app
RUN npm run postinstall
RUN npm run build
RUN npx tsup prisma/seed.ts src/daemons/doc-ai-daemon.ts
RUN ls -la  /app/dist

# Build the production image
FROM node:18-slim

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

# install prisma for migration
RUN npm i prisma -g

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/dist/prisma/seed.cjs ./seed.cjs
COPY --from=builder --chown=nextjs:nodejs /app/dist/src/daemons/doc-ai-daemon.cjs ./doc-ai-daemon.cjs
ADD ./prisma ./prisma
ADD ./bin/launch.sh ./launch.sh
ADD ./bin/migrate.sh ./migrate.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["dumb-init", "./launch.sh"]
