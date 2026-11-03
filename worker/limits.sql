-- Production tester accounting only. No research text or research database.
CREATE TABLE IF NOT EXISTS spend(id TEXT PRIMARY KEY,state TEXT,reserved REAL,actual REAL,input_tokens INTEGER,output_tokens INTEGER,created_at TEXT,billing_mode TEXT NOT NULL DEFAULT 'paid',reserved_tokens INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS request_limits(key TEXT PRIMARY KEY,count INTEGER);
