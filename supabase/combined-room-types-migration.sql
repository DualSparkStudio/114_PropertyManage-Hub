-- Combined Migration: Add additional_price_per_extra_guest and number_of_rooms to room_types table
-- Run this in Supabase SQL Editor

-- Add additional_price_per_extra_guest column
ALTER TABLE room_types 
ADD COLUMN IF NOT EXISTS additional_price_per_extra_guest DECIMAL(10, 2) DEFAULT 0;

-- Update existing rows to have a default value of 0 if they are NULL
UPDATE room_types 
SET additional_price_per_extra_guest = 0 
WHERE additional_price_per_extra_guest IS NULL;

-- Add number_of_rooms column
ALTER TABLE room_types 
ADD COLUMN IF NOT EXISTS number_of_rooms INTEGER DEFAULT 1;

-- Update existing rows to have a default value of 1 if they are NULL
UPDATE room_types 
SET number_of_rooms = 1 
WHERE number_of_rooms IS NULL;

-- Note: After running this migration, Supabase's schema cache should automatically refresh.
-- If you still see errors, wait a few seconds and try again, or refresh your Supabase dashboard.

