import {
	type Automation,
	DAEMON_POLL_INTERVAL_MS,
	PID_FILE,
	RRule,
	executeRun,
	generateId,
	getDb,
} from "@9to5/core";

// Write PID file for this daemon process
Bun.write(PID_FILE, String(process.pid));

const db = getDb();

async function runAutomation(automation: Automation): Promise<void> {
	const runId = generateId();
	const sessionId = crypto.randomUUID();

	await executeRun(automation, runId, sessionId, db, generateId);

	// Update automation: set last_run_at and compute next_run_at
	const updateTime = Date.now();
	let nextRunAt: number | null = null;

	if (automation.rrule) {
		const rule = RRule.fromString(`RRULE:${automation.rrule}`);
		const next = rule.after(new Date());
		nextRunAt = next ? next.getTime() : null;
	}

	db.run(
		"UPDATE automations SET last_run_at = ?, next_run_at = ?, updated_at = ? WHERE id = ?",
		[updateTime, nextRunAt, updateTime, automation.id],
	);
}

function tick(): void {
	const now = Date.now();
	const due = db
		.query(
			"SELECT * FROM automations WHERE status = 'active' AND next_run_at IS NOT NULL AND next_run_at <= ?",
		)
		.all(now) as Automation[];

	for (const automation of due) {
		runAutomation(automation);
	}
}

console.log("9to5 daemon started");
tick();
setInterval(tick, DAEMON_POLL_INTERVAL_MS);
