#!/bin/sh
set -e

# # Read from Docker Secret file if present, otherwise use environment variable
# if [ -f "/run/secrets/stripe_key" ]; then
#     STRIPE_KEY=$(cat /run/secrets/stripe_key)
# fi

# if [ -z "$STRIPE_KEY" ]; then
#     echo "[stripe_listener] ERROR: STRIPE_KEY is not set!"
#     exit 1
# fi

echo "[stripe_listener] Starting Stripe webhook listener..."

exec stripe listen \
    --api-key "$STRIPE_KEY" \
    --forward-to "back:3000/api/webhook" \
    --load-from-webhooks-api