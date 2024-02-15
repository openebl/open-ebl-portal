#!/bin/bash

node server.js &

dumb-init node doc-ai-daemon.cjs &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
