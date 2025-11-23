CREATE TABLE IF NOT EXISTS shops (
    id SERIAL PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL,
    user_id INTEGER,
    description TEXT,
    address VARCHAR(500),
    phone VARCHAR(50),
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_shops_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_deleted ON shops(deleted);
CREATE INDEX IF NOT EXISTS idx_shops_shop_name ON shops(shop_name);

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

