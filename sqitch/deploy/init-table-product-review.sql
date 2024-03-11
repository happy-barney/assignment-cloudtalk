-- Deploy sqitch:init-table-product-review to pg

BEGIN;

CREATE TABLE product_review (
    product_id  int     NOT NULL
                        CONSTRAINT product_review_pk PRIMARY KEY
                        CONSTRAINT product_review_product_id_fk REFERENCES product
                        ,
    average     float   NOT NULL,
    count       int     NOT NULL
);

COMMIT;
