-- Expenses table schema
-- This table stores shop expenses/outcomes
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    expense_date DATE NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on shop_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_expenses_shop_id ON expenses(shop_id);

-- Create index on expense_date for date range queries
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- Create index on deleted for soft delete queries
CREATE INDEX IF NOT EXISTS idx_expenses_deleted ON expenses(deleted);

