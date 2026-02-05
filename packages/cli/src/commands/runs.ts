import { type Run, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerRuns(program: Command): void {
	program
		.command("runs [automation-id]")
		.description("View run history")
		.action((automationId?: string) => {
			const db = getDb();

			let rows: Run[];
			if (automationId) {
				rows = db
					.query(
						"SELECT * FROM runs WHERE automation_id = ? ORDER BY created_at DESC",
					)
					.all(automationId) as Run[];
			} else {
				rows = db
					.query("SELECT * FROM runs ORDER BY created_at DESC LIMIT 50")
					.all() as Run[];
			}

			if (rows.length === 0) {
				console.log("No runs found.");
				return;
			}

			for (const row of rows) {
				const started = row.started_at
					? new Date(row.started_at).toISOString()
					: "—";
				console.log(
					`[${row.status}] ${row.id}  automation=${row.automation_id}  started=${started}`,
				);
			}
		});
}
