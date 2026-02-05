import { existsSync, readFileSync } from "node:fs";
import { PID_FILE, ensureDataDir } from "@9to5/core";
import type { Command } from "commander";

export function registerStart(program: Command): void {
	program
		.command("start")
		.description("Start the background daemon")
		.action(() => {
			if (existsSync(PID_FILE)) {
				const existingPid = Number.parseInt(
					readFileSync(PID_FILE, "utf-8").trim(),
					10,
				);
				try {
					process.kill(existingPid, 0);
					console.log(`Daemon already running (PID ${existingPid})`);
					return;
				} catch {
					// PID file is stale, continue
				}
			}

			ensureDataDir();

			const daemonScript = new URL("../daemon/index.ts", import.meta.url)
				.pathname;
			const child = Bun.spawn(["bun", "run", daemonScript], {
				stdio: ["ignore", "ignore", "ignore"],
			});

			// Unref so parent can exit
			child.unref();

			Bun.write(PID_FILE, String(child.pid));
			console.log(`Daemon started (PID ${child.pid})`);
		});
}
