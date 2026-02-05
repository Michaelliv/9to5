import type { Database } from "bun:sqlite";

export function initSchema(db: Database): void {
	db.run("PRAGMA journal_mode = WAL");
	db.run("PRAGMA foreign_keys = ON");

	db.run(`
    CREATE TABLE IF NOT EXISTS automations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      prompt TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      next_run_at INTEGER,
      last_run_at INTEGER,
      cwd TEXT NOT NULL,
      rrule TEXT,
      model TEXT DEFAULT 'sonnet',
      max_budget_usd REAL,
      allowed_tools TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

	db.run(`
    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      automation_id TEXT NOT NULL REFERENCES automations(id),
      status TEXT NOT NULL DEFAULT 'pending',
      session_id TEXT,
      output TEXT,
      error TEXT,
      started_at INTEGER,
      completed_at INTEGER,
      created_at INTEGER NOT NULL
    )
  `);

	db.run(`
    CREATE TABLE IF NOT EXISTS inbox (
      id TEXT PRIMARY KEY,
      title TEXT,
      summary TEXT,
      run_id TEXT REFERENCES runs(id),
      read_at INTEGER,
      created_at INTEGER NOT NULL
    )
  `);
}
