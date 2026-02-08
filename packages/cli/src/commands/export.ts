import { getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerExport(program: Command): void {
	program
		.command("export [id]")
		.description("Export automation(s) as JSON (pipe to file to save)")
		.action((id?: string) => {
			const db = getDb();

			const rows = id
				? db
						.query(
							"SELECT * FROM automations WHERE id = ? AND deleted_at IS NULL",
						)
						.all(id)
				: db
						.query(
							"SELECT * FROM automations WHERE deleted_at IS NULL ORDER BY created_at DESC",
						)
						.all();

			if (rows.length === 0) {
				console.error(id ? `Automation ${id} not found.` : "No automations.");
				process.exit(1);
			}

			const exported = (rows as Record<string, unknown>[]).map((a) => ({
				name: a.name,
				prompt: a.prompt,
				status: a.status,
				cwd: a.cwd,
				rrule: a.rrule,
				model: a.model,
				max_budget_usd: a.max_budget_usd,
				allowed_tools: a.allowed_tools,
				system_prompt: a.system_prompt,
			}));

			const out = id ? exported[0] : exported;
			console.log(JSON.stringify(out, null, 2));
		});
}
