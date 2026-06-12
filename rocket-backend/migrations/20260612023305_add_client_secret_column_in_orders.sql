-- Add migration script here
ALTER TABLE orders
ADD COLUMN client_secret TEXT NOT NULL