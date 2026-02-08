import { type Automation, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerList(program: Command): void {
	program
		.command("list")
		.description("List all automations")
		.option("--deleted", "Show only soft-deleted automations")
		.action((opts: { deleted?: boolean }) => {
			const db = getDb();

			const rows = opts.deleted
				? (db
						.query(
							"SELECT * FROM automations WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC",
						)
						.all() as Automation[])
				: (db
						.query(
							"SELECT * FROM automations WHERE deleted_at IS NULL ORDER BY created_at DESC",
						)
						.all() as Automation[]);

			if (rows.length === 0) {
				console.log(
					opts.deleted ? "No deleted automations." : "No automations found.",
				);
				return;
			}

			for (const row of rows) {
				if (opts.deleted) {
					const deletedAt = row.deleted_at
						? new Date(row.deleted_at).toISOString()
						: "—";
					console.log(`[deleted] ${row.id}  ${row.name}  deleted=${deletedAt}`);
				} else {
					const nextRun = row.next_run_at
						? new Date(row.next_run_at).toISOString()
						: "—";
					console.log(
						`[${row.status}] ${row.id}  ${row.name}  model=${row.model}  next=${nextRun}`,
					);
				}
			}
		});
}
