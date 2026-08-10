#!/bin/sh
set -e 
echo -e " Starting back container initialization sequence up !"

if [ -f "/run/secrets/db_password" ]; then
	export POSTGRES_PASSWORD=$(cat /run/secrets/db_password)
fi

npx prisma generate --schema=./dist/prisma/schema.prisma
npx prisma db push --schema=./dist/prisma/schema.prisma

exec "$@"