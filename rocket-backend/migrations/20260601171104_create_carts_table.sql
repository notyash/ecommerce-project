-- Add migration script here
CREATE TYPE cart_status AS ENUM ('ACTIVE', 'CHECKED_OUT', 'ABANDONED', 'DELETED');

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    status cart_status NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);