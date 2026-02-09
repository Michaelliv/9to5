import { type Automation, RRule, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerEdit(program: Command): void {
	program
		.command("edit <id>")
		.description("Edit an existing agent")
		.option("--name <name>", "Rename the agent")
		.option("--prompt <prompt>", "Update the prompt")
		.option("--cwd <dir>", "Update working directory")
		.option("--rrule <rule>", "Update recurrence rule")
		.option("--model <model>", "Update model (sonnet, opus, haiku)")
		.option(
			"--max-budget-usd <amount>",
			"Update max budget in USD",
			Number.parseFloat,
		)
		.option("--allowed-tools <tools>", "Update allowed tools (comma-separated)")
		.option("--system-prompt <prompt>", "Update system prompt")
		.option("--status <status>", "Set status (active, paused)")
		.action((id: string, opts) => {
			const db = getDb();

			const row = db
				.query("SELECT * FROM automations WHERE id = ? AND deleted_at IS NULL")
				.get(id) as Automation | null;
			if (!row) {
				console.error(`Agent ${id} not found.`);
				process.exit(1);
			}

			const sets: string[] = [];
			const values: unknown[] = [];

			if (opts.name != null) {
				sets.push("name = ?");
				values.push(opts.name);
			}

			if (opts.prompt != null) {
				sets.push("prompt = ?");
				values.push(opts.prompt);
			}

			if (opts.cwd != null) {
				sets.push("cwd = ?");
				values.push(opts.cwd);
			}

			if (opts.rrule != null) {
				sets.push("rrule = ?");
				values.push(opts.rrule);
				const rule = RRule.fromString(`RRULE:${opts.rrule}`);
				const next = rule.after(new Date());
				sets.push("next_run_at = ?");
				values.push(next ? next.getTime() : null);
			}

			if (opts.model != null) {
				sets.push("model = ?");
				values.push(opts.model);
			}

			if (opts.maxBudgetUsd != null) {
				sets.push("max_budget_usd = ?");
				values.push(opts.maxBudgetUsd);
			}

			if (opts.allowedTools != null) {
				sets.push("allowed_tools = ?");
				values.push(
					JSON.stringify(
						opts.allowedTools.split(",").map((t: string) => t.trim()),
					),
				);
			}

			if (opts.systemPrompt != null) {
				sets.push("system_prompt = ?");
				values.push(opts.systemPrompt);
			}

			if (opts.status != null) {
				if (opts.status !== "active" && opts.status !== "paused") {
					console.error("Status must be 'active' or 'paused'.");
					process.exit(1);
				}
				sets.push("status = ?");
				values.push(opts.status);

				// Recalculate next_run_at when resuming an automation with an rrule
				const rrule = opts.rrule ?? row.rrule;
				if (opts.status === "active" && rrule) {
					const rule = RRule.fromString(`RRULE:${rrule}`);
					const next = rule.after(new Date());
					sets.push("next_run_at = ?");
					values.push(next ? next.getTime() : null);
				}
			}

			if (sets.length === 0) {
				console.error(
					"No fields to update. Use --name, --prompt, --model, etc.",
				);
				process.exit(1);
			}

			sets.push("updated_at = ?");
			values.push(Date.now());
			values.push(id);

			db.run(`UPDATE automations SET ${sets.join(", ")} WHERE id = ?`, values);

			console.log(`Updated agent ${id} (${opts.name ?? row.name})`);
		});
}
