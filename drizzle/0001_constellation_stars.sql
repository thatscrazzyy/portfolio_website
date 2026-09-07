CREATE TABLE IF NOT EXISTS constellation_stars (
  id TEXT PRIMARY KEY NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  size REAL NOT NULL,
  color TEXT NOT NULL,
  glow REAL NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS constellation_stars_created_at_idx
  ON constellation_stars(created_at ASC);
