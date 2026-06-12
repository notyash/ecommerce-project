-- Add migration script here
DROP TYPE order_status;
CREATE TYPE order_status as ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');