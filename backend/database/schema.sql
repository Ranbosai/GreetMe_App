-- GreetMe Database Schema
-- PostgreSQL Database Setup Script

-- Create database (run this manually if needed)
-- CREATE DATABASE greetme;

-- Connect to the greetme database before running the rest

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    telephone VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_telephone ON users(telephone);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- INSERT INTO users (name, telephone, email, nickname, password_hash, is_verified) 
-- VALUES 
--     ('Test User', '1234567890', 'test@example.com', 'testuser', '$2b$12$sample_hash', true);

-- Verify table creation
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Show indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'users';

COMMENT ON TABLE users IS 'User accounts for GreetMe social media platform';
COMMENT ON COLUMN users.id IS 'Unique user identifier';
COMMENT ON COLUMN users.name IS 'Full name of the user';
COMMENT ON COLUMN users.telephone IS 'Unique telephone number';
COMMENT ON COLUMN users.email IS 'Unique email address';
COMMENT ON COLUMN users.nickname IS 'Display name/username';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.is_verified IS 'Email verification status';
COMMENT ON COLUMN users.verification_token IS 'Token for email verification';
COMMENT ON COLUMN users.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN users.updated_at IS 'Last update timestamp';
