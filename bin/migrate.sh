#!/bin/bash

DATABASE_URL="postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"
export DATABASE_URL

prisma migrate deploy
node /app/seed.cjs
