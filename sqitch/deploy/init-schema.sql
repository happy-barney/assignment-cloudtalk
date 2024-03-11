-- Deploy sqitch:init-schema.sql to pg

BEGIN;

SET client_encoding = 'UTF8';

CREATE SCHEMA IF NOT EXISTS assignment AUTHORIZATION current_user;

-- public so schema can see extensions
ALTER DATABASE assignment SET search_path=assignment,public;

COMMIT;
