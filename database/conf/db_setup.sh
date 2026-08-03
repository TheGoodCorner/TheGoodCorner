#!/bin/sh
set -e 
echo -e " Starting PostgreSQL initialization sequence up !"

if [ -f "/run/secrets/db_password" ]; then
    export POSTGRES_PASSWORD=$(cat /run/secrets/db_password)
fi
exec docker-entrypoint.sh postgres	