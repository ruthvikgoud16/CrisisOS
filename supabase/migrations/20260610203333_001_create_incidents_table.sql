CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Monitoring', 'Resolved')),
  people_affected INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  triage_analysis JSONB
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "incidents_select_policy" ON incidents FOR SELECT
  TO authenticated, anon USING (true);

CREATE POLICY "incidents_insert_policy" ON incidents FOR INSERT
  TO authenticated, anon WITH CHECK (true);

CREATE POLICY "incidents_update_policy" ON incidents FOR UPDATE
  TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "incidents_delete_policy" ON incidents FOR DELETE
  TO authenticated, anon USING (true);

INSERT INTO incidents (title, location, description, severity, status, people_affected, latitude, longitude) VALUES
('Earthquake detected', 'San Francisco, CA', 'Magnitude 6.2 earthquake reported near the Bay Area. Multiple buildings damaged.', 'Critical', 'Active', 850, 37.7749, -122.4194),
('Flooding warning', 'New Orleans, LA', 'Severe flooding in downtown area. Evacuations in progress.', 'Critical', 'Active', 1200, 29.9511, -90.0715),
('Wildfire outbreak', 'Los Angeles, CA', 'Fast-moving wildfire threatening residential areas.', 'High', 'Monitoring', 340, 34.0522, -118.2437),
('Hurricane approaching', 'Miami, FL', 'Category 4 hurricane expected to make landfall within 24 hours.', 'Critical', 'Active', 15000, 25.7617, -80.1918),
('Chemical spill', 'Houston, TX', 'Industrial accident causing hazardous material release.', 'High', 'Active', 180, 29.7604, -95.3698),
('Building collapse', 'New York, NY', 'Partial building collapse in Manhattan. Search and rescue ongoing.', 'Critical', 'Active', 95, 40.7128, -74.0060),
('Tornado touchdown', 'Oklahoma City, OK', 'Multiple tornadoes reported. Significant structural damage.', 'Critical', 'Monitoring', 420, 35.4676, -97.5164),
('Power grid failure', 'Detroit, MI', 'Major power outage affecting downtown district.', 'Medium', 'Active', 12000, 42.3314, -83.0458),
('Mass casualty incident', 'Phoenix, AZ', 'Multi-vehicle accident on interstate highway.', 'High', 'Active', 27, 33.4484, -112.0740),
('Water contamination', 'Flint, MI', 'Boil water advisory issued for entire city.', 'Medium', 'Resolved', 45000, 43.0125, -83.6875);
