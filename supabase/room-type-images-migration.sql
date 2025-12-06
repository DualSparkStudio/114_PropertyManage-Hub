-- Migration: Add support for multiple images per room type
-- Run this in Supabase SQL Editor after the main schema

-- Create room_type_images table (similar to property_images)
CREATE TABLE IF NOT EXISTS room_type_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_room_type_images_room_type_id ON room_type_images(room_type_id);

-- Enable RLS
ALTER TABLE room_type_images ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view room type images
CREATE POLICY "Public can view room type images" ON room_type_images
  FOR SELECT USING (true);

-- RLS Policy: Admins can manage room type images
CREATE POLICY "Admins can manage room type images" ON room_type_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

