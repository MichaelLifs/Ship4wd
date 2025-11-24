-- Income transactions table schema
-- This table stores payments from customers to shops
CREATE TABLE IF NOT EXISTS income_transactions (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on shop_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_income_transactions_shop_id ON income_transactions(shop_id);

-- Create index on transaction_date for date range queries
CREATE INDEX IF NOT EXISTS idx_income_transactions_date ON income_transactions(transaction_date);

-- Create index on deleted for soft delete queries
CREATE INDEX IF NOT EXISTS idx_income_transactions_deleted ON income_transactions(deleted);

