import { getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerRemove(program: Command): void {
	program
		.command("remove <id>")
		.description("Remove an agent (soft-delete by default)")
		.option("--force", "Permanently delete agent and all related data")
		.action((id: string, opts: { force?: boolean }) => {
			const db = getDb();

			if (opts.force) {
				db.run(
					"DELETE FROM inbox WHERE run_id IN (SELECT id FROM runs WHERE automation_id = ?)",
					[id],
				);
				db.run("DELETE FROM runs WHERE automation_id = ?", [id]);
				const result = db.run("DELETE FROM automations WHERE id = ?", [id]);

				if (result.changes === 0) {
					console.error(`Agent ${id} not found.`);
					process.exit(1);
				}

				console.log(`Permanently deleted agent ${id}`);
			} else {
				const result = db.run(
					"UPDATE automations SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL",
					[Date.now(), Date.now(), id],
				);

				if (result.changes === 0) {
					console.error(`Agent ${id} not found.`);
					process.exit(1);
				}

				console.log(
					`Removed agent ${id} (use --force to delete permanently)`,
				);
			}
		});
}
