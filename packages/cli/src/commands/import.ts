import { RRule, generateId, getDb } from "@9to5/core";
import type { Command } from "commander";

interface AutomationDef {
	name: string;
	prompt: string;
	status?: string;
	cwd?: string;
	rrule?: string | null;
	model?: string;
	max_budget_usd?: number | null;
	allowed_tools?: string | null;
	system_prompt?: string | null;
}

function importOne(def: AutomationDef, cwdOverride?: string): string {
	const db = getDb();
	const now = Date.now();
	const id = generateId();
	const cwd = cwdOverride ?? def.cwd ?? process.cwd();

	let nextRunAt: number | null = null;
	if (def.rrule) {
		const rule = RRule.fromString(`RRULE:${def.rrule}`);
		const next = rule.after(new Date());
		nextRunAt = next ? next.getTime() : null;
	}

	db.run(
		`INSERT INTO automations (id, name, prompt, status, next_run_at, cwd, rrule, model, max_budget_usd, allowed_tools, system_prompt, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			id,
			def.name,
			def.prompt,
			def.status ?? "active",
			nextRunAt,
			cwd,
			def.rrule ?? null,
			def.model ?? "sonnet",
			def.max_budget_usd ?? null,
			def.allowed_tools ?? null,
			def.system_prompt ?? null,
			now,
			now,
		],
	);

	return id;
}

export function registerImport(program: Command): void {
	program
		.command("import <file>")
		.description("Import automation(s) from a JSON file")
		.option(
			"--cwd <dir>",
			"Override working directory for imported automations",
		)
		.action(async (file: string, opts) => {
			const text = await Bun.file(file).text();
			const data = JSON.parse(text);

			const defs: AutomationDef[] = Array.isArray(data) ? data : [data];

			for (const def of defs) {
				const id = importOne(def, opts.cwd);
				console.log(`Imported ${id} (${def.name})`);
			}
		});
}
