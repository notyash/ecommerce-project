-- Add migration script here
CREATE TYPE selected_currency AS ENUM ('inr', 'usd');

ALTER TABLE orders
ADD COLUMN currency selected_currency NOT NULL