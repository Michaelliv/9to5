import { existsSync, unlinkSync } from "node:fs";
import { readFileSync } from "node:fs";
import { PID_FILE } from "@9to5/core";
import type { Command } from "commander";

export function registerStop(program: Command): void {
	program
		.command("stop")
		.description("Stop the background daemon")
		.action(() => {
			if (!existsSync(PID_FILE)) {
				console.log("Daemon is not running (no PID file).");
				return;
			}

			const pid = Number.parseInt(readFileSync(PID_FILE, "utf-8").trim(), 10);

			try {
				process.kill(pid, "SIGTERM");
				console.log(`Daemon stopped (PID ${pid})`);
			} catch {
				console.log("Daemon process not found (stale PID file).");
			}

			unlinkSync(PID_FILE);
		});
}
