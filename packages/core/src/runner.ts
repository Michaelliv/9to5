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
			let summary = output.slice(0, 500);
			let result: string | null = null;
			let costUsd: number | null = null;
			let durationMs: number | null = null;
			let numTurns: number | null = null;

			try {
				const parsed = JSON.parse(output);
				if (parsed.result) {
					result = String(parsed.result);
					summary = result.slice(0, 500);
				}
				if (typeof parsed.total_cost_usd === "number")
					costUsd = parsed.total_cost_usd;
				if (typeof parsed.duration_ms === "number")
					durationMs = parsed.duration_ms;
				if (typeof parsed.num_turns === "number") numTurns = parsed.num_turns;
			} catch {
				// not JSON, use raw
			}

			db.run(
				"UPDATE runs SET status = 'completed', output = ?, result = ?, cost_usd = ?, duration_ms = ?, num_turns = ?, completed_at = ? WHERE id = ?",
				[output, result, costUsd, durationMs, numTurns, Date.now(), runId],
			);

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
