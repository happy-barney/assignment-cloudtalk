-- Deploy sqitch:init-table-review to pg

BEGIN;

CREATE TABLE review (
    id          serial  NOT NULL
                        CONSTRAINT review_pk_id PRIMARY KEY
                        ,
    public_id   uuid    NOT NULL
                        CONSTRAINT review_unique_public_id UNIQUE
                        DEFAULT public.uuid_generate_v4()
                        ,
    product_id  int     NOT NULL
                        CONSTRAINT review_product_id_fk REFERENCES product
                        ,
    first_name  text    NOT NULL,
    last_name   text    NOT NULL,
    comment     text    NOT NULL,
    rating      int     NOT NULL
                        CONSTRAINT review_rating_check CHECK (rating BETWEEN 0 AND 5)
);

COMMIT;
