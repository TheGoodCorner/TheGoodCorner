#!/bin/sh
set -e 
echo -e " Starting back container initialization sequence up !"

if [ -f "/run/secrets/db_password" ]; then
	export POSTGRES_PASSWORD=$(cat /run/secrets/db_password)
elif [ -f "../.secrets/password.txt" ]; then
	export POSTGRES_PASSWORD=$(cat ../.secrets/password.txt)
fi
exec "$@"