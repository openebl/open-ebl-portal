#!/bin/bash

node server.js &

npx --yes tsx doc-ai-daemon.ts &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
