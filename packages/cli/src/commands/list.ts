import { type Automation, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerList(program: Command): void {
	program
		.command("list")
		.description("List all automations")
		.action(() => {
			const db = getDb();
			const rows = db
				.query("SELECT * FROM automations ORDER BY created_at DESC")
				.all() as Automation[];

			if (rows.length === 0) {
				console.log("No automations found.");
				return;
			}

			for (const row of rows) {
				const nextRun = row.next_run_at
					? new Date(row.next_run_at).toISOString()
					: "—";
				console.log(
					`[${row.status}] ${row.id}  ${row.name}  model=${row.model}  next=${nextRun}`,
				);
			}
		});
}
