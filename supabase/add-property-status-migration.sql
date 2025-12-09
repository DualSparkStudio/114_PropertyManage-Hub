-- Migration: Add status field to properties table
-- Run this in Supabase SQL Editor

-- Add the status column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Update existing rows to have a default value of 'active' if they are NULL
UPDATE properties 
SET status = 'active' 
WHERE status IS NULL;

