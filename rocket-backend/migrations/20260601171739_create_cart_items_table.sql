-- Add migration script here
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL DEFAULT 1,
    current_price NUMERIC(10, 2) NOT NULL,
    UNIQUE(cart_id, product_id)
);