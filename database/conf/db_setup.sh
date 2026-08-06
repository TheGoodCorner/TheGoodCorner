#!/bin/sh
set -e 
echo -e " Starting PostgreSQL initialization sequence up !\n"

if [ -f "/run/secrets/db_password" ]; then
	export POSTGRES_PASSWORD=$(cat /run/secrets/db_password)
else
	echo -e "Password has not been found ! aborting !\n"
	exit 1;
fi

exec docker-entrypoint.sh postgres
# execut ethe docker-entrypoint script inside the container and pass it postgres as an arg. becomes PID 1 