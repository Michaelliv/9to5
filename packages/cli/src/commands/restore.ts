import { type Automation, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerRestore(program: Command): void {
	program
		.command("restore <id>")
		.description("Restore a deleted agent")
		.action((id: string) => {
			const db = getDb();

			const automation = db
				.query(
					"SELECT * FROM automations WHERE id = ? AND deleted_at IS NOT NULL",
				)
				.get(id) as Automation | null;

			if (!automation) {
				console.error(`Deleted agent ${id} not found.`);
				process.exit(1);
			}

			const conflict = db
				.query(
					"SELECT id FROM automations WHERE name = ? AND deleted_at IS NULL",
				)
				.get(automation.name);

			if (conflict) {
				console.error(
					`Cannot restore: an agent named "${automation.name}" already exists.`,
				);
				process.exit(1);
			}

			db.run(
				"UPDATE automations SET deleted_at = NULL, status = 'paused', updated_at = ? WHERE id = ?",
				[Date.now(), id],
			);

			console.log(`Restored agent ${id} (${automation.name}) as paused`);
		});
}
