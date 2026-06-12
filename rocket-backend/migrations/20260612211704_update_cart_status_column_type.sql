-- Add migration script here
ALTER TABLE orders
ALTER COLUMN status TYPE order_status
USING status::order_status;
