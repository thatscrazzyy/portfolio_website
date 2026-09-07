ALTER TABLE constellation_stars ADD COLUMN message TEXT NOT NULL DEFAULT '';
ALTER TABLE constellation_stars ADD COLUMN callsign TEXT NOT NULL DEFAULT '';
ALTER TABLE constellation_stars ADD COLUMN visitor_key TEXT;
CREATE UNIQUE INDEX constellation_visitor_key ON constellation_stars(visitor_key);
