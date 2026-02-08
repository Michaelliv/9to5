import { existsSync, mkdirSync, readFileSync, unlinkSync } from "node:fs";
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

export function stopDaemon(): boolean {
	if (!existsSync(PID_FILE)) return false;
	const pid = Number.parseInt(readFileSync(PID_FILE, "utf-8").trim(), 10);
	try {
		process.kill(pid, "SIGTERM");
	} catch {
		// process already gone
	}
	unlinkSync(PID_FILE);
	return true;
}

export function startDaemon(): number {
	const daemonScript = process.env.NINE_TO_FIVE_DAEMON_SCRIPT;
	if (!daemonScript) throw new Error("NINE_TO_FIVE_DAEMON_SCRIPT not set");
	ensureDataDir();
	const child = Bun.spawn(["bun", "run", daemonScript], {
		stdio: ["ignore", "ignore", "ignore"],
	});
	child.unref();
	Bun.write(PID_FILE, String(child.pid));
	return child.pid;
}
