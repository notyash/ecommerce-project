-- Add migration script here
ALTER TABLE orders
ALTER COLUMN stripe_id
SET NOT NULL