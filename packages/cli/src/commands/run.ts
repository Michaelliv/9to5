import { type Automation, executeRun, generateId, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerRun(program: Command): void {
	program
		.command("run <id>")
		.description("Trigger an automation immediately")
		.action(async (id: string) => {
			const db = getDb();
			const automation = db
				.query("SELECT * FROM automations WHERE id = ?")
				.get(id) as Automation | null;

			if (!automation) {
				console.error(`Automation ${id} not found.`);
				process.exit(1);
			}

			const runId = generateId();
			const sessionId = crypto.randomUUID();

			console.log(`Running ${automation.name} (run ${runId})...`);

			const result = await executeRun(
				automation,
				runId,
				sessionId,
				db,
				generateId,
			);

			if (result.status === "completed") {
				console.log("Completed.");
				console.log(result.summary);
			} else {
				console.error("Failed:", result.error);
				process.exit(1);
			}
		});
}
