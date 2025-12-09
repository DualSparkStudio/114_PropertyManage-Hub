-- Migration: Add number_of_rooms to room_types table
-- Run this in Supabase SQL Editor

-- Add the new column to room_types table
ALTER TABLE room_types 
ADD COLUMN IF NOT EXISTS number_of_rooms INTEGER DEFAULT 1;

-- Update existing rows to have a default value of 1 if they are NULL
UPDATE room_types 
SET number_of_rooms = 1 
WHERE number_of_rooms IS NULL;

