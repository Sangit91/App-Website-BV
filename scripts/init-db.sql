-- Initialize BVDH Database
-- This script runs automatically when PostgreSQL container starts

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Note: Tables are created via Prisma migrate
-- This script is for any additional initialization

-- Create indexes for better performance
-- These will be created by Prisma migration, but keeping as reference

-- Set timezone
SET TimeZone = 'Asia/Ho_Chi_Minh';

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'BVDH Database initialized successfully';
END $$;