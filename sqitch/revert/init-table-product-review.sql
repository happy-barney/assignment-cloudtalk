-- Revert sqitch:init-table-product-review from pg

BEGIN;

DROP TABLE product_review;

COMMIT;
