-- Deploy sqitch:init-table-product to pg

BEGIN;

CREATE TABLE product (
    id          serial  NOT NULL
                        CONSTRAINT product_pk_id PRIMARY KEY
                        ,
    public_id   uuid    NOT NULL
                        CONSTRAINT product_unique_public_id UNIQUE
                        DEFAULT public.uuid_generate_v4()
                        ,
    name        text    NOT NULL
                        CONSTRAINT product_unique_name UNIQUE
                        UNIQUE
                        ,
    description text,
    price       float   NOT NULL
);

CREATE FUNCTION product_public_id (_id int)
    RETURNS text
    STABLE
    LANGUAGE 'sql'
    AS $$ SELECT public_id FROM product WHERE id = _id $$
;

COMMIT;
