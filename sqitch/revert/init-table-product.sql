-- Revert sqitch:init-table-product from pg

BEGIN;

DROP FUNCTION product_public_id (_id int);
DROP TABLE product;

COMMIT;
