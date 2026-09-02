#!/bin/sh
set -e

echo "[stripe_listener] Starting Stripe webhook listener..."

exec stripe listen \
    --api-key "$STRIPE_KEY" \
    --forward-to "http://back:3000/api/webhook" \
    --project-name "thegoodcorner"