-- Revert sqitch:init-table-review from pg

BEGIN;

DROP TABLE review;

COMMIT;
