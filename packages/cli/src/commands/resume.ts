import type { Automation, Run } from "@9to5/core";
import { getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerResume(program: Command): void {
	program
		.command("resume <run-id>")
		.description("Resume the Claude Code session from a run")
		.action((runId: string) => {
			const db = getDb();
			const run = db
				.query("SELECT * FROM runs WHERE id = ?")
				.get(runId) as Run | null;

			if (!run) {
				console.error(`Run ${runId} not found.`);
				process.exit(1);
			}

			if (!run.session_id) {
				console.error(`Run ${runId} has no session to resume.`);
				process.exit(1);
			}

			const automation = db
				.query("SELECT * FROM automations WHERE id = ?")
				.get(run.automation_id) as Automation | null;

			const cwd = automation?.cwd ?? process.cwd();

			const proc = Bun.spawnSync(["claude", "-r", run.session_id], {
				cwd,
				stdio: ["inherit", "inherit", "inherit"],
			});

			process.exit(proc.exitCode ?? 0);
		});
}
