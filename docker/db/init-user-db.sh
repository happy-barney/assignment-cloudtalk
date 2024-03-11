#!/bin/sh

set -e

createuser assignment

createdb -O assignment -E UTF8 assignment

psql -v ON_ERROR_STOP=1 --username postgres assignment <<-EOSQL
ALTER USER assignment WITH PASSWORD 'db-pwd';

CREATE EXTENSION "uuid-ossp";
EOSQL

