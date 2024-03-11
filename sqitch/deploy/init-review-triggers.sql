-- Deploy sqitch:init-review-triggers to pg

BEGIN;

CREATE OR REPLACE PROCEDURE product_review_log (
    _product_id int,
    _rating     int,
    _count      int
)
    LANGUAGE 'sql'
    AS $$
        INSERT INTO
            product_review AS old ( product_id,  average, count)
            VALUES                (_product_id, _rating, _count)
        ON CONFLICT ON CONSTRAINT product_review_pk DO UPDATE SET
            count   = old.count + EXCLUDED.count,
            average = CASE
                WHEN old.count + EXCLUDED.count < 1 THEN 0
                ELSE
                    ((old.average * old.count) + EXCLUDED.average) / (old.count + EXCLUDED.count)
            END
        ;
    $$
;

CREATE FUNCTION review_on_change_trigger ()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    AS $$
    BEGIN
        IF TG_OP <> 'INSERT' THEN
            CALL product_review_log (
                _product_id => OLD.product_id,
                _rating     => -OLD.rating,
                _count      => -1
            );
        END IF;

        IF TG_OP <> 'DELETE' THEN
            CALL product_review_log (
                _product_id => NEW.product_id,
                _rating     => NEW.rating,
                _count      => 1
            );
        END IF;

        IF TG_OP <> 'DELETE' THEN return NEW; END IF;
        return OLD;
    END;
    $$
;

CREATE TRIGGER review_update_product_review
    AFTER INSERT OR UPDATE OR DELETE
    ON review
    FOR EACH ROW
    EXECUTE PROCEDURE review_on_change_trigger ()
;

COMMIT;
