#!/usr/bin/env bun
import { Command } from "commander";
import pkg from "../../../package.json";
import { registerAdd } from "./commands/add.ts";
import { registerEdit } from "./commands/edit.ts";
import { registerExport } from "./commands/export.ts";
import { registerImport } from "./commands/import.ts";
import { registerInbox } from "./commands/inbox.ts";
import { registerList } from "./commands/list.ts";
import { registerOnboard } from "./commands/onboard.ts";
import { registerRemove } from "./commands/remove.ts";
import { registerRestore } from "./commands/restore.ts";
import { registerResume } from "./commands/resume.ts";
import { registerRun } from "./commands/run.ts";
import { registerRuns } from "./commands/runs.ts";
import { registerStart } from "./commands/start.ts";
import { registerStop } from "./commands/stop.ts";
import { registerWebhook } from "./commands/webhook.ts";

const program = new Command()
	.name("9to5")
	.description("Schedule Claude Code tasks")
	.version(pkg.version);

registerAdd(program);
registerEdit(program);
registerExport(program);
registerImport(program);
registerList(program);
registerOnboard(program);
registerRemove(program);
registerRestore(program);
registerResume(program);
registerRun(program);
registerRuns(program);
registerInbox(program);
registerStart(program);
registerStop(program);
registerWebhook(program);

program
	.command("ui")
	.description("Launch interactive TUI dashboard")
	.action(async () => {
		const { spawnSync } = await import("bun");
		const { existsSync } = await import("node:fs");
		const bundledTui = new URL("./tui/index.js", import.meta.url).pathname;
		const sourceTui = new URL("../../tui/src/index.tsx", import.meta.url)
			.pathname;
		const tui = existsSync(bundledTui) ? bundledTui : sourceTui;
		spawnSync(["bun", "run", tui], {
			stdio: ["inherit", "inherit", "inherit"],
		});
	});

program.parse();
