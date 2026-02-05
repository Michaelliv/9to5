#!/usr/bin/env bun
import { Command } from "commander";
import { registerAdd } from "./commands/add.ts";
import { registerInbox } from "./commands/inbox.ts";
import { registerList } from "./commands/list.ts";
import { registerRemove } from "./commands/remove.ts";
import { registerRuns } from "./commands/runs.ts";
import { registerStart } from "./commands/start.ts";
import { registerStop } from "./commands/stop.ts";

const program = new Command()
	.name("9to5")
	.description("Schedule Claude Code tasks")
	.version("0.0.1");

registerAdd(program);
registerList(program);
registerRemove(program);
registerRuns(program);
registerInbox(program);
registerStart(program);
registerStop(program);

program
	.command("ui")
	.description("Launch interactive TUI dashboard")
	.action(async () => {
		const { spawnSync } = await import("bun");
		const tui = new URL("../../tui/src/index.tsx", import.meta.url).pathname;
		spawnSync(["bun", "run", tui], {
			stdio: ["inherit", "inherit", "inherit"],
		});
	});

program.parse();
