CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS airports (
  iata_code CHAR(3) PRIMARY KEY,
  icao_code CHAR(4),
  name TEXT NOT NULL,
  city TEXT,
  country_code CHAR(2),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  timezone TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_iata CHAR(3) NOT NULL REFERENCES airports(iata_code),
  destination_iata CHAR(3) NOT NULL REFERENCES airports(iata_code),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (origin_iata, destination_iata)
);

CREATE TABLE IF NOT EXISTS saved_flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id),
  offer_id TEXT,
  offer_snapshot JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS airfare_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id),
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_amount NUMERIC(12,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  cabin_class TEXT,
  provider TEXT NOT NULL,
  provider_offer_id TEXT,
  raw_data JSONB,
  is_test_data BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS index_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  period TEXT NOT NULL,
  index_value NUMERIC(12,4) NOT NULL,
  baseline_value NUMERIC(12,4),
  methodology_version TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id),
  target_amount NUMERIC(12,2),
  currency CHAR(3),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS aircraft_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  callsign TEXT,
  icao24 CHAR(6),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  altitude_m DOUBLE PRECISION,
  velocity_mps DOUBLE PRECISION,
  heading_deg DOUBLE PRECISION,
  on_ground BOOLEAN,
  source TEXT NOT NULL,
  is_demonstration BOOLEAN NOT NULL DEFAULT false,
  raw_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_airfare_route_time ON airfare_observations(route_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_aircraft_time ON aircraft_observations(observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active) WHERE is_active;
