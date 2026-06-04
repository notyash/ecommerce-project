-- Add migration script here
ALTER TABLE cart_items
ADD CONSTRAINT cart_items_quantity_positive
CHECK (quantity > 0);