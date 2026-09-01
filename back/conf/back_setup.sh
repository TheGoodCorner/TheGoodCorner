#!/bin/sh
set -e 
echo -e " Starting back container initialization sequence up !"

if [ -f "/run/secrets/db_password" ]; then
	export POSTGRES_PASSWORD=$(cat /run/secrets/db_password)
else
	echo -e "Password has not been found ! aborting !\n"
	exit 1;
fi

if [ -f "/run/secrets/stripe_key" ]; then
	export STRIPE_KEY=$(cat /run/secrets/stripe_key)
fi

export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=public"

npx prisma generate --schema=./dist/prisma/schema.prisma
npx prisma db push --schema=./dist/prisma/schema.prisma

node dist/prisma/seed.js

exec "$@"