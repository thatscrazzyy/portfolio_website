CREATE TABLE IF NOT EXISTS visitor_stamps (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  color TEXT NOT NULL,
  symbol TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS visitor_stamps_created_at_idx
  ON visitor_stamps(created_at DESC);
