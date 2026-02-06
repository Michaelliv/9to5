import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const DATA_DIR = join(homedir(), ".9to5");
export const DB_PATH = join(DATA_DIR, "db.sqlite");
export const PID_FILE = join(DATA_DIR, "daemon.pid");
export const DAEMON_POLL_INTERVAL_MS = 30_000;

export function ensureDataDir(): void {
	mkdirSync(DATA_DIR, { recursive: true });
}

export function isDaemonRunning(): boolean {
	if (!existsSync(PID_FILE)) return false;
	try {
		const pid = Number.parseInt(readFileSync(PID_FILE, "utf-8").trim(), 10);
		if (Number.isNaN(pid)) return false;
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}
