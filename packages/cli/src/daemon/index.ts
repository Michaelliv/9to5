import { unlinkSync } from "node:fs";
import {
	type Automation,
	DAEMON_POLL_INTERVAL_MS,
	PID_FILE,
	RRule,
	executeRun,
	generateId,
	getDb,
	getWebhookConfig,
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

async function tick(): Promise<void> {
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

// --- Start webhook triggers if enabled ---
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
