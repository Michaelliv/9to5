import { RRule, generateId, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerAdd(program: Command): void {
	program
		.command("add <name>")
		.description("Add a new automation")
		.requiredOption("--prompt <prompt>", "Prompt to send to Claude")
		.option("--cwd <dir>", "Working directory", process.cwd())
		.option("--rrule <rule>", "RFC 5545 recurrence rule (e.g. FREQ=DAILY)")
		.option("--model <model>", "Claude model to use", "sonnet")
		.option("--max-budget-usd <amount>", "Max budget in USD", Number.parseFloat)
		.option("--allowed-tools <tools>", "Comma-separated list of allowed tools")
		.action((name: string, opts) => {
			const db = getDb();
			const now = Date.now();
			const id = generateId();

			let nextRunAt: number | null = null;
			if (opts.rrule) {
				const rule = RRule.fromString(`RRULE:${opts.rrule}`);
				const next = rule.after(new Date());
				nextRunAt = next ? next.getTime() : null;
			}

			const allowedTools = opts.allowedTools
				? JSON.stringify(
						opts.allowedTools.split(",").map((t: string) => t.trim()),
					)
				: null;

			db.run(
				`INSERT INTO automations (id, name, prompt, status, next_run_at, cwd, rrule, model, max_budget_usd, allowed_tools, created_at, updated_at)
				 VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					id,
					name,
					opts.prompt,
					nextRunAt,
					opts.cwd,
					opts.rrule ?? null,
					opts.model,
					opts.maxBudgetUsd ?? null,
					allowedTools,
					now,
					now,
				],
			);

			console.log(`Created automation ${id} (${name})`);
		});
}
