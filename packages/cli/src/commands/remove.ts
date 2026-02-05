import { getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerRemove(program: Command): void {
	program
		.command("remove <id>")
		.description("Remove an automation")
		.action((id: string) => {
			const db = getDb();
			db.run(
				"DELETE FROM inbox WHERE run_id IN (SELECT id FROM runs WHERE automation_id = ?)",
				[id],
			);
			db.run("DELETE FROM runs WHERE automation_id = ?", [id]);
			const result = db.run("DELETE FROM automations WHERE id = ?", [id]);

			if (result.changes === 0) {
				console.error(`Automation ${id} not found.`);
				process.exit(1);
			}

			console.log(`Removed automation ${id}`);
		});
}
