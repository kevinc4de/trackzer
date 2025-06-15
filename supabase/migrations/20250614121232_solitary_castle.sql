/*
  # Create phones table for Echo Finder

  1. New Tables
    - `phones`
      - `id` (uuid, primary key)
      - `imei` (text, unique, not null) - Phone IMEI number
      - `brand` (text, not null) - Phone brand
      - `model` (text, not null) - Phone model
      - `color` (text) - Phone color
      - `status` (enum) - lost, stolen, or found
      - `description` (text, not null) - Description of incident
      - `reward` (integer) - Reward amount in FCFA
      - `owner_name` (text, not null) - Owner's name
      - `owner_phone` (text, not null) - Owner's phone
      - `owner_email` (text, not null) - Owner's email
      - `location_address` (text, not null) - Last known address
      - `location_lat` (float, not null) - Latitude
      - `location_lng` (float, not null) - Longitude
      - `reported_date` (timestamptz, default now()) - When reported
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `phones` table
    - Add policy for public read access (for search functionality)
    - Add policy for public insert access (for reporting)
*/

-- Create enum for phone status
CREATE TYPE phone_status AS ENUM ('lost', 'stolen', 'found');

-- Create phones table
CREATE TABLE IF NOT EXISTS phones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  imei text UNIQUE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  color text,
  status phone_status NOT NULL DEFAULT 'lost',
  description text NOT NULL,
  reward integer,
  owner_name text NOT NULL,
  owner_phone text NOT NULL,
  owner_email text NOT NULL,
  location_address text NOT NULL,
  location_lat float NOT NULL,
  location_lng float NOT NULL,
  reported_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON phones
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON phones
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_phones_imei ON phones(imei);
CREATE INDEX IF NOT EXISTS idx_phones_status ON phones(status);
CREATE INDEX IF NOT EXISTS idx_phones_reported_date ON phones(reported_date DESC);
CREATE INDEX IF NOT EXISTS idx_phones_location ON phones(location_lat, location_lng);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_phones_updated_at
  BEFORE UPDATE ON phones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();