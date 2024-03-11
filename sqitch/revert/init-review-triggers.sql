-- Revert sqitch:init-review-triggers from pg

BEGIN;

DROP TRIGGER review_update_product_review ON review;
DROP FUNCTION review_on_change_trigger ();
DROP PROCEDURE product_review_log (
    _product_id int,
    _rating     int,
    _count      int
);

COMMIT;
