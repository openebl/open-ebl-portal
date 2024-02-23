#!/bin/bash

DATABASE_URL="postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"
export DATABASE_URL

# ignore ${SMTP_ENABLE_TLS} and let SMPT server do STARTTLS Upgrade
EMAIL_SERVER="smtp://${SMTP_USERNAME}:${SMTP_PASSWORD}@${SMTP_SERVER_DOMAIN}:${SMTP_SERVER_PORT}/${SMTP_EMAIL_DOMAIN}"
export EMAIL_SERVER

node server.js &

dumb-init node doc-ai-daemon.cjs &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
