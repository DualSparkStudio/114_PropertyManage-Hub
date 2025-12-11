-- Migration: Add map_embed_url to property_contact table
-- Run this in your Supabase SQL Editor

ALTER TABLE property_contact
ADD COLUMN IF NOT EXISTS map_embed_url TEXT;

