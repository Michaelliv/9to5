import { unlinkSync } from "node:fs";
import {
	type Automation,
	DAEMON_POLL_INTERVAL_MS,
	PID_FILE,
	RRule,
	enableWebhook,
	executeRun,
	generateId,
	getDb,
	getWebhookConfig,
	isWebhookDisabled,
} from "@9to5/core";
import { type NtfyListener, startNtfyListener } from "./ntfy-listener.ts";
import { type WebhookServer, startWebhookServer } from "./webhook-server.ts";

// Write PID file for this daemon process
Bun.write(PID_FILE, String(process.pid));

const db = getDb();

async function runAutomation(automation: Automation): Promise<void> {
	// Compute next_run_at BEFORE executing so the TUI/daemon see the future timestamp immediately
	let nextRunAt: number | null = null;
	if (automation.rrule) {
		const rule = RRule.fromString(`RRULE:${automation.rrule}`);
		const next = rule.after(new Date());
		nextRunAt = next ? next.getTime() : null;
	}

	db.run(
		"UPDATE automations SET next_run_at = ?, updated_at = ? WHERE id = ?",
		[nextRunAt, Date.now(), automation.id],
	);

	const runId = generateId();
	const sessionId = crypto.randomUUID();

	await executeRun(automation, runId, sessionId, db, generateId);

	db.run(
		"UPDATE automations SET last_run_at = ?, updated_at = ? WHERE id = ?",
		[Date.now(), Date.now(), automation.id],
	);
}

function isProcessAlive(pid: number): boolean {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}

function reapStaleRuns(): void {
	const running = db
		.query("SELECT id, pid FROM runs WHERE status = 'running'")
		.all() as { id: string; pid: number | null }[];

	for (const run of running) {
		if (run.pid != null && isProcessAlive(run.pid)) continue;
		db.run(
			"UPDATE runs SET status = 'failed', error = 'Process exited unexpectedly', completed_at = ? WHERE id = ?",
			[Date.now(), run.id],
		);
		console.log(`Reaped stale run ${run.id}`);
	}
}

async function tick(): Promise<void> {
	reapStaleRuns();

	const now = Date.now();
	const due = db
		.query(
			"SELECT * FROM automations WHERE status = 'active' AND deleted_at IS NULL AND next_run_at IS NOT NULL AND next_run_at <= ?",
		)
		.all(now) as Automation[];

	for (const automation of due) {
		await runAutomation(automation);
	}
}

// --- Auto-generate webhook secret if missing and not explicitly disabled ---
if (!getWebhookConfig() && !isWebhookDisabled()) {
	enableWebhook();
	console.log("Webhook secret auto-generated.");
}

// --- Start webhook triggers ---
let webhookServer: WebhookServer | null = null;
let ntfyListener: NtfyListener | null = null;

const webhookConfig = getWebhookConfig();
if (webhookConfig) {
	webhookServer = startWebhookServer(webhookConfig, db, runAutomation);
	ntfyListener = startNtfyListener(webhookConfig, db, runAutomation);
}

// --- Graceful shutdown ---
function shutdown() {
	console.log("9to5 daemon stopping...");
	if (webhookServer) webhookServer.stop();
	if (ntfyListener) ntfyListener.stop();
	try {
		unlinkSync(PID_FILE);
	} catch {}
	process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// --- Start poll loop ---
console.log("9to5 daemon started");
tick();
setInterval(tick, DAEMON_POLL_INTERVAL_MS);
