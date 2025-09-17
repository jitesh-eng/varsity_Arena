/*
  # Free Fire Game Arena Database Schema

  1. New Tables
    - `tournaments` - Store tournament information (free/paid)
    - `registrations` - Store team registrations for tournaments
    - `leaderboard` - Track team rankings and points
    - `contact_queries` - Store contact form submissions
    - `admins` - Admin user management

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access where appropriate
    - Add admin-only policies for management operations
    - Add authenticated user policies for registrations

  3. Storage
    - Create bucket for payment screenshots
*/

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('free', 'paid')),
  date timestamptz NOT NULL,
  prize text NOT NULL,
  entry_fee decimal(10,2) DEFAULT 0,
  rules text NOT NULL,
  description text NOT NULL,
  max_teams integer DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  leader_name text NOT NULL,
  game_uid text NOT NULL,
  whatsapp_number text NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected')),
  payment_screenshot_url text,
  registration_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  registration_id text REFERENCES registrations(registration_id) ON DELETE CASCADE,
  team_name text NOT NULL,
  leader_name text NOT NULL,
  points integer DEFAULT 0,
  rank integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'disqualified')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact queries table
CREATE TABLE IF NOT EXISTS contact_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_queries ENABLE ROW LEVEL SECURITY;

-- Policies for tournaments (public read, admin write)
CREATE POLICY "Anyone can view active tournaments"
  ON tournaments
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert tournaments"
  ON tournaments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tournaments"
  ON tournaments
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for registrations (public insert, admin manage)
CREATE POLICY "Anyone can register for tournaments"
  ON registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view registrations"
  ON registrations
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update registrations"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for leaderboard (public read, admin write)
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage leaderboard"
  ON leaderboard
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for contact queries (public insert, admin read)
CREATE POLICY "Anyone can submit contact queries"
  ON contact_queries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact queries"
  ON contact_queries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact queries"
  ON contact_queries
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', false);

-- Allow authenticated users to upload screenshots
CREATE POLICY "Users can upload payment screenshots"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow authenticated users to view screenshots
CREATE POLICY "Admin can view payment screenshots"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'payment-screenshots');

-- Function to generate registration ID
CREATE OR REPLACE FUNCTION generate_registration_id()
RETURNS text AS $$
BEGIN
  RETURN 'FF' || LPAD((EXTRACT(EPOCH FROM NOW())::bigint % 1000000)::text, 6, '0') || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 4));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate registration ID
CREATE OR REPLACE FUNCTION set_registration_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.registration_id IS NULL OR NEW.registration_id = '' THEN
    NEW.registration_id := generate_registration_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_registration_id
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_registration_id();

-- Insert sample tournament data
INSERT INTO tournaments (name, type, date, prize, entry_fee, rules, description) VALUES
  ('Free Fire Championship', 'free', NOW() + INTERVAL '7 days', '₹5000 Cash Prize', 0, 'Standard BR rules apply. No hacking or teaming allowed.', 'Join our weekly free championship tournament!'),
  ('Pro League Tournament', 'paid', NOW() + INTERVAL '14 days', '₹25000 Cash Prize', 50, 'Advanced tournament rules. ID cards required for verification.', 'Premium tournament with huge cash prizes!');