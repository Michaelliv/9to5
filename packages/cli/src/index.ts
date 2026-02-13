#!/usr/bin/env bun
import { Command } from "commander";
import pkg from "../../../package.json";
import { registerAdd } from "./commands/add.ts";
import { registerEdit } from "./commands/edit.ts";
import { registerExport } from "./commands/export.ts";
import { registerHide } from "./commands/hide.ts";
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
import { registerUnhide } from "./commands/unhide.ts";
import { registerWebhook } from "./commands/webhook.ts";

const program = new Command()
	.name("9to5")
	.description("Automated agents for Claude Code")
	.version(pkg.version);

const agent = program.command("agent").description("Manage agents");
registerAdd(agent);
registerEdit(agent);
registerExport(agent);
registerHide(agent);
registerImport(agent);
registerList(agent);
registerRemove(agent);
registerRestore(agent);
registerRun(agent);
registerUnhide(agent);

const daemon = program
	.command("daemon")
	.description("Manage the background daemon");
registerStart(daemon);
registerStop(daemon);

registerWebhook(program);
registerRuns(program);
registerInbox(program);
registerResume(program);
registerOnboard(program);

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
		const daemonScript = new URL("./daemon/index.ts", import.meta.url).pathname;
		spawnSync(["bun", "run", tui], {
			stdio: ["inherit", "inherit", "inherit"],
			env: { ...process.env, NINE_TO_FIVE_DAEMON_SCRIPT: daemonScript },
		});
	});

program.parse();
