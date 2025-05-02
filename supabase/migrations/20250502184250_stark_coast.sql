/*
  # Create initial schema for motorcycle route generator

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `route_priority` (text)
      - `motorcycle_type` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `saved_routes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `summary` (text)
      - `route_data` (jsonb)
      - `input_params` (jsonb)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_priority text,
  motorcycle_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz,
  UNIQUE(user_id)
);

-- Create saved_routes table
CREATE TABLE IF NOT EXISTS saved_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text NOT NULL,
  route_data jsonb NOT NULL,
  input_params jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_routes ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for saved_routes
CREATE POLICY "Users can view their own saved routes"
  ON saved_routes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved routes"
  ON saved_routes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved routes"
  ON saved_routes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved routes"
  ON saved_routes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);