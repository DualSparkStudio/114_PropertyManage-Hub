-- Migration: Add additional_price_per_extra_guest to room_types table
-- Run this in Supabase SQL Editor

-- Add the new column to room_types table
ALTER TABLE room_types 
ADD COLUMN IF NOT EXISTS additional_price_per_extra_guest DECIMAL(10, 2) DEFAULT 0;

-- Update existing rows to have a default value of 0 if they are NULL
UPDATE room_types 
SET additional_price_per_extra_guest = 0 
WHERE additional_price_per_extra_guest IS NULL;

