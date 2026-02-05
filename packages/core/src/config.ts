import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const DATA_DIR = join(homedir(), ".9to5");
export const DB_PATH = join(DATA_DIR, "db.sqlite");
export const PID_FILE = join(DATA_DIR, "daemon.pid");
export const DAEMON_POLL_INTERVAL_MS = 30_000;

export function ensureDataDir(): void {
	mkdirSync(DATA_DIR, { recursive: true });
}
