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
      system_prompt TEXT,
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

	// Migrations for existing databases
	const migrate = (sql: string) => {
		try {
			db.run(sql);
		} catch {
			// column already exists
		}
	};
	migrate("ALTER TABLE automations ADD COLUMN system_prompt TEXT");
	migrate("ALTER TABLE runs ADD COLUMN cost_usd REAL");
	migrate("ALTER TABLE runs ADD COLUMN duration_ms INTEGER");
	migrate("ALTER TABLE runs ADD COLUMN num_turns INTEGER");
	migrate("ALTER TABLE runs ADD COLUMN result TEXT");
	migrate("ALTER TABLE runs ADD COLUMN pid INTEGER");
	migrate("ALTER TABLE automations ADD COLUMN deleted_at INTEGER");
	migrate(
		"CREATE UNIQUE INDEX IF NOT EXISTS idx_automations_name ON automations(name)",
	);
	// Replace unique name index to only enforce uniqueness for non-deleted automations
	migrate("DROP INDEX IF EXISTS idx_automations_name");
	migrate(
		"CREATE UNIQUE INDEX IF NOT EXISTS idx_automations_name ON automations(name) WHERE deleted_at IS NULL",
	);

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
