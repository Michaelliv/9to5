import type { Database } from "bun:sqlite";
import { buildClaudeArgs } from "./claude.ts";
import type { Automation } from "./types.ts";

export interface RunResult {
	runId: string;
	sessionId: string;
	status: "completed" | "failed";
	summary?: string;
	error?: string;
}

export async function executeRun(
	automation: Automation,
	runId: string,
	sessionId: string,
	db: Database,
	generateId: () => string,
): Promise<RunResult> {
	const now = Date.now();

	db.run(
		"INSERT INTO runs (id, automation_id, status, session_id, started_at, created_at) VALUES (?, ?, 'running', ?, ?, ?)",
		[runId, automation.id, sessionId, now, now],
	);

	const args = buildClaudeArgs(automation, sessionId);

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

			let summary = output.slice(0, 500);
			try {
				const parsed = JSON.parse(output);
				if (parsed.result) {
					summary = String(parsed.result).slice(0, 500);
				}
			} catch {
				// not JSON, use raw
			}

			db.run(
				"INSERT INTO inbox (id, title, summary, run_id, created_at) VALUES (?, ?, ?, ?, ?)",
				[
					generateId(),
					`${automation.name} completed`,
					summary,
					runId,
					Date.now(),
				],
			);

			return { runId, sessionId, status: "completed", summary };
		}

		const stderr = await new Response(proc.stderr).text();
		db.run(
			"UPDATE runs SET status = 'failed', error = ?, completed_at = ? WHERE id = ?",
			[stderr, Date.now(), runId],
		);
		return { runId, sessionId, status: "failed", error: stderr };
	} catch (err) {
		const error = String(err);
		db.run(
			"UPDATE runs SET status = 'failed', error = ?, completed_at = ? WHERE id = ?",
			[error, Date.now(), runId],
		);
		return { runId, sessionId, status: "failed", error };
	}
}
