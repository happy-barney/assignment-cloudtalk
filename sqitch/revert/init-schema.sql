-- Revert sqitch:init-schema.sql from pg

BEGIN;

DROP SCHEMA IF EXISTS assignment;

COMMIT;
