FROM node:18-slim as base
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM base as builder
WORKDIR /app
RUN npm ci
COPY . .

ENV DATABASE_URL=postgres://localhost:5432/database
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXTAUTH_SECRET="--secret--"
ENV GOOGLE_CLIENT_ID="--google-client-id--"
ENV GOOGLE_CLIENT_SECRET="--google-client-secret--"

RUN npm run postinstall
RUN npm run build


FROM node:18-slim as base
WORKDIR /app

ENV NODE_ENV=production
# COPY package*.json ./
# RUN npm ci

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
