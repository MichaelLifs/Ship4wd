-- Shops table schema
CREATE TABLE IF NOT EXISTS shops (
    id SERIAL PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL,
    user_id INTEGER[],
    description TEXT,
    address VARCHAR(500),
    phone VARCHAR(50),
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on deleted for soft delete queries
CREATE INDEX IF NOT EXISTS idx_shops_deleted ON shops(deleted);

-- Create index on shop_name for faster searches
CREATE INDEX IF NOT EXISTS idx_shops_shop_name ON shops(shop_name);

