-- PostgreSQL Schema for HydroPros / Aquafound
-- Run this in your Neon database console

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  notes TEXT,
  source_path VARCHAR(500),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  start_utc TIMESTAMPTZ NOT NULL,
  end_utc TIMESTAMPTZ NOT NULL,
  timezone VARCHAR(100) DEFAULT 'America/New_York',
  status VARCHAR(50) DEFAULT 'scheduled',
  reschedule_token VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability rules (which days/times are bookable)
CREATE TABLE IF NOT EXISTS availability_rules (
  id SERIAL PRIMARY KEY,
  weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  start_local VARCHAR(5) NOT NULL,
  end_local VARCHAR(5) NOT NULL,
  slot_minutes INTEGER DEFAULT 60,
  active BOOLEAN DEFAULT true,
  UNIQUE(weekday)
);

-- Blackout dates (holidays, vacations, etc.)
CREATE TABLE IF NOT EXISTS blackout_dates (
  id SERIAL PRIMARY KEY,
  date_local DATE NOT NULL UNIQUE,
  reason VARCHAR(255)
);

-- Insert default availability (Mon-Fri 9am-5pm)
INSERT INTO availability_rules (weekday, start_local, end_local, slot_minutes, active)
VALUES
  (1, '09:00', '17:00', 60, true),  -- Monday
  (2, '09:00', '17:00', 60, true),  -- Tuesday
  (3, '09:00', '17:00', 60, true),  -- Wednesday
  (4, '09:00', '17:00', 60, true),  -- Thursday
  (5, '09:00', '17:00', 60, true)   -- Friday
ON CONFLICT (weekday) DO NOTHING;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_start_utc ON appointments(start_utc);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
