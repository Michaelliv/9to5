import { getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerHide(program: Command): void {
	program
		.command("hide <id>")
		.description("Hide an agent from list and TUI views")
		.action((id: string) => {
			const db = getDb();

			const result = db.run(
				"UPDATE automations SET hidden_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL AND hidden_at IS NULL",
				[Date.now(), Date.now(), id],
			);

			if (result.changes === 0) {
				console.error(`Agent ${id} not found or already hidden.`);
				process.exit(1);
			}

			console.log(
				`Hidden agent ${id} (use 9to5 unhide ${id} to show again)`,
			);
		});
}
