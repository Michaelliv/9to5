import { type Automation, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerList(program: Command): void {
	program
		.command("list")
		.description("List all automations")
		.option("--deleted", "Show only soft-deleted automations")
		.option("--hidden", "Show only hidden automations")
		.action((opts: { deleted?: boolean; hidden?: boolean }) => {
			const db = getDb();

			let rows: Automation[];
			if (opts.deleted) {
				rows = db
					.query(
						"SELECT * FROM automations WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC",
					)
					.all() as Automation[];
			} else if (opts.hidden) {
				rows = db
					.query(
						"SELECT * FROM automations WHERE hidden_at IS NOT NULL AND deleted_at IS NULL ORDER BY hidden_at DESC",
					)
					.all() as Automation[];
			} else {
				rows = db
					.query(
						"SELECT * FROM automations WHERE deleted_at IS NULL AND hidden_at IS NULL ORDER BY created_at DESC",
					)
					.all() as Automation[];
			}

			if (rows.length === 0) {
				console.log(
					opts.deleted
						? "No deleted automations."
						: opts.hidden
							? "No hidden automations."
							: "No automations found.",
				);
			} else {
				for (const row of rows) {
					if (opts.deleted) {
						const deletedAt = row.deleted_at
							? new Date(row.deleted_at).toISOString()
							: "—";
						console.log(
							`[deleted] ${row.id}  ${row.name}  deleted=${deletedAt}`,
						);
					} else if (opts.hidden) {
						const hiddenAt = row.hidden_at
							? new Date(row.hidden_at).toISOString()
							: "—";
						console.log(`[hidden] ${row.id}  ${row.name}  hidden=${hiddenAt}`);
					} else {
						const nextRun = row.next_run_at
							? new Date(row.next_run_at).toISOString()
							: "—";
						console.log(
							`[${row.status}] ${row.id}  ${row.name}  model=${row.model}  next=${nextRun}`,
						);
					}
				}
			}

			// Show counts of hidden/deleted automations
			if (!opts.deleted && !opts.hidden) {
				const { count: hiddenCount } = db
					.query(
						"SELECT COUNT(*) as count FROM automations WHERE hidden_at IS NOT NULL AND deleted_at IS NULL",
					)
					.get() as { count: number };
				const { count: deletedCount } = db
					.query(
						"SELECT COUNT(*) as count FROM automations WHERE deleted_at IS NOT NULL",
					)
					.get() as { count: number };
				const parts: string[] = [];
				if (hiddenCount > 0) parts.push(`${hiddenCount} hidden`);
				if (deletedCount > 0) parts.push(`${deletedCount} deleted`);
				if (parts.length > 0) {
					console.log(`(${parts.join(", ")})`);
				}
			}
		});
}
