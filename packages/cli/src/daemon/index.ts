import {
	type Automation,
	DAEMON_POLL_INTERVAL_MS,
	PID_FILE,
	RRule,
	generateId,
	getDb,
} from "@9to5/core";

// Write PID file for this daemon process
Bun.write(PID_FILE, String(process.pid));

const db = getDb();

async function runAutomation(automation: Automation): Promise<void> {
	const runId = generateId();
	const now = Date.now();

	db.run(
		"INSERT INTO runs (id, automation_id, status, started_at, created_at) VALUES (?, ?, 'running', ?, ?)",
		[runId, automation.id, now, now],
	);

	const args = [
		"claude",
		"-p",
		"--output-format",
		"json",
		"--model",
		automation.model,
		...(automation.max_budget_usd
			? ["--max-budget-usd", String(automation.max_budget_usd)]
			: []),
		automation.prompt,
	];

	try {
		const proc = Bun.spawn(args, {
			cwd: automation.cwd,
			stdout: "pipe",
			stderr: "pipe",
		});

		const output = await new Response(proc.stdout).text();
		const exitCode = await proc.exited;

		if (exitCode === 0) {
			db.run(
				"UPDATE runs SET status = 'completed', output = ?, completed_at = ? WHERE id = ?",
				[output, Date.now(), runId],
			);

			// Create inbox item
			const title = `${automation.name} completed`;
			let summary = output.slice(0, 500);
			try {
				const parsed = JSON.parse(output);
				if (parsed.result) {
					summary = parsed.result.slice(0, 500);
				}
			} catch {
				// Output wasn't JSON, use raw
			}

			db.run(
				"INSERT INTO inbox (id, title, summary, run_id, created_at) VALUES (?, ?, ?, ?, ?)",
				[generateId(), title, summary, runId, Date.now()],
			);
		} else {
			const stderr = await new Response(proc.stderr).text();
			db.run(
				"UPDATE runs SET status = 'failed', error = ?, completed_at = ? WHERE id = ?",
				[stderr, Date.now(), runId],
			);
		}
	} catch (err) {
		db.run(
			"UPDATE runs SET status = 'failed', error = ?, completed_at = ? WHERE id = ?",
			[String(err), Date.now(), runId],
		);
	}

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
