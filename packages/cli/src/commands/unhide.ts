import { getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerUnhide(program: Command): void {
	program
		.command("unhide <id>")
		.description("Unhide a hidden automation")
		.action((id: string) => {
			const db = getDb();

			const result = db.run(
				"UPDATE automations SET hidden_at = NULL, updated_at = ? WHERE id = ? AND deleted_at IS NULL AND hidden_at IS NOT NULL",
				[Date.now(), id],
			);

			if (result.changes === 0) {
				console.error(`Hidden automation ${id} not found.`);
				process.exit(1);
			}

			console.log(`Unhidden automation ${id}`);
		});
}
