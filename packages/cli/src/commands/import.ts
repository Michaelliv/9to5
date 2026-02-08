import { type Automation, RRule, generateId, getDb } from "@9to5/core";
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

function updateOne(def: AutomationDef, cwdOverride?: string): boolean {
	const db = getDb();

	const row = db
		.query("SELECT * FROM automations WHERE name = ? AND deleted_at IS NULL")
		.get(def.name) as Automation | null;

	if (!row) {
		console.error(`Automation "${def.name}" not found.`);
		process.exit(1);
	}

	const sets: string[] = [];
	const values: unknown[] = [];

	if (def.prompt != null && def.prompt !== row.prompt) {
		sets.push("prompt = ?");
		values.push(def.prompt);
	}

	const cwd = cwdOverride ?? def.cwd;
	if (cwd != null && cwd !== row.cwd) {
		sets.push("cwd = ?");
		values.push(cwd);
	}

	if (def.rrule !== undefined && def.rrule !== row.rrule) {
		sets.push("rrule = ?");
		values.push(def.rrule);
		if (def.rrule) {
			try {
				const rule = RRule.fromString(`RRULE:${def.rrule}`);
				const next = rule.after(new Date());
				sets.push("next_run_at = ?");
				values.push(next ? next.getTime() : null);
			} catch (err) {
				console.error(
					`Invalid rrule "${def.rrule}": ${err instanceof Error ? err.message : err}`,
				);
				process.exit(1);
			}
		} else {
			sets.push("next_run_at = ?");
			values.push(null);
		}
	}

	if (def.model != null && def.model !== row.model) {
		sets.push("model = ?");
		values.push(def.model);
	}

	if (
		def.max_budget_usd !== undefined &&
		def.max_budget_usd !== row.max_budget_usd
	) {
		sets.push("max_budget_usd = ?");
		values.push(def.max_budget_usd);
	}

	if (
		def.allowed_tools !== undefined &&
		def.allowed_tools !== row.allowed_tools
	) {
		sets.push("allowed_tools = ?");
		values.push(def.allowed_tools);
	}

	if (
		def.system_prompt !== undefined &&
		def.system_prompt !== row.system_prompt
	) {
		sets.push("system_prompt = ?");
		values.push(def.system_prompt);
	}

	if (def.status != null && def.status !== row.status) {
		if (def.status !== "active" && def.status !== "paused") {
			console.error("Status must be 'active' or 'paused'.");
			process.exit(1);
		}
		sets.push("status = ?");
		values.push(def.status);

		// Recalculate next_run_at when resuming with an rrule
		const rrule = def.rrule !== undefined ? def.rrule : row.rrule;
		if (def.status === "active" && rrule) {
			const rule = RRule.fromString(`RRULE:${rrule}`);
			const next = rule.after(new Date());
			sets.push("next_run_at = ?");
			values.push(next ? next.getTime() : null);
		}
	}

	if (sets.length === 0) {
		return false;
	}

	sets.push("updated_at = ?");
	values.push(Date.now());
	values.push(row.id);

	db.run(`UPDATE automations SET ${sets.join(", ")} WHERE id = ?`, values);
	return true;
}

export function registerImport(program: Command): void {
	program
		.command("import <file>")
		.description("Import automation(s) from a JSON file")
		.option(
			"--cwd <dir>",
			"Override working directory for imported automations",
		)
		.option("--update", "Update existing automations matched by name")
		.action(async (file: string, opts) => {
			const text = await Bun.file(file).text();
			const data = JSON.parse(text);

			const defs: AutomationDef[] = Array.isArray(data) ? data : [data];

			for (const def of defs) {
				if (opts.update) {
					const changed = updateOne(def, opts.cwd);
					if (changed) {
						console.log(`Updated "${def.name}"`);
					} else {
						console.log(`No changes for "${def.name}"`);
					}
				} else {
					const id = importOne(def, opts.cwd);
					console.log(`Imported ${id} (${def.name})`);
				}
			}
		});
}
