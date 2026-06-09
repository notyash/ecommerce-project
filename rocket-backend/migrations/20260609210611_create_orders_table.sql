-- Add migration script here
CREATE TYPE order_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    stripe_id TEXT,
    user_id INT NOT NULL REFERENCES users(id),
    cart_id INT NOT NULL REFERENCES carts(id),
    status order_status NOT NULL,
    total_amount INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);