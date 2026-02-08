import {
	type Automation,
	DEFAULT_WEBHOOK_PORT,
	disableWebhook,
	enableWebhook,
	getDb,
	getNtfyUrl,
	getWebhookConfig,
	isDaemonRunning,
	signPayload,
} from "@9to5/core";
import type { Command } from "commander";

export function registerWebhook(program: Command): void {
	const webhook = program
		.command("webhook")
		.description("Manage webhook triggers for automations");

	webhook
		.command("enable")
		.description("Enable webhook triggers")
		.option(
			"-p, --port <port>",
			"Local webhook server port",
			String(DEFAULT_WEBHOOK_PORT),
		)
		.action((opts: { port: string }) => {
			const port = Number.parseInt(opts.port, 10);
			if (Number.isNaN(port) || port < 1 || port > 65535) {
				console.error("Invalid port number.");
				process.exit(1);
			}
			const config = enableWebhook(
				port !== DEFAULT_WEBHOOK_PORT ? port : undefined,
			);
			console.log("Webhook triggers enabled.\n");
			console.log(`Secret:    ${config.secret}`);
			console.log(
				`Local URL: http://localhost:${config.port}/trigger/<automation-id>`,
			);
			console.log(`Ntfy URL:  ${getNtfyUrl(config.secret)}`);
			if (isDaemonRunning()) {
				console.log(
					"\nRestart the daemon for changes to take effect: 9to5 stop && 9to5 start",
				);
			}
		});

	webhook
		.command("disable")
		.description("Disable webhook triggers")
		.action(() => {
			disableWebhook();
			console.log("Webhook triggers disabled.");
			if (isDaemonRunning()) {
				console.log(
					"\nRestart the daemon for changes to take effect: 9to5 stop && 9to5 start",
				);
			}
		});

	webhook
		.command("status")
		.description("Show webhook trigger status")
		.action(() => {
			const config = getWebhookConfig();
			if (!config) {
				console.log("Webhooks: disabled");
				console.log("\nRun `9to5 webhook enable` to set up webhook triggers.");
				return;
			}
			console.log("Webhooks: enabled");
			console.log(
				`Local URL: http://localhost:${config.port}/trigger/<automation-id>`,
			);
			console.log(`Ntfy URL:  ${getNtfyUrl(config.secret)}`);
		});

	webhook
		.command("url <automation-id>")
		.description("Print trigger commands for an automation")
		.action((automationId: string) => {
			const config = getWebhookConfig();
			if (!config) {
				console.error("Webhooks not enabled. Run `9to5 webhook enable` first.");
				process.exit(1);
			}

			const db = getDb();
			const automation = db
				.query("SELECT * FROM automations WHERE id = ? AND deleted_at IS NULL")
				.get(automationId) as Automation | null;

			if (!automation) {
				console.error(`Automation ${automationId} not found.`);
				process.exit(1);
			}

			const localUrl = `http://localhost:${config.port}/trigger/${automationId}`;
			const ntfyUrl = getNtfyUrl(config.secret);

			const payload = JSON.stringify({
				automation_id: automationId,
				ts: Date.now(),
			});
			const sig = signPayload(config.secret, payload);

			console.log(`Automation: ${automation.name} (${automationId})\n`);

			console.log("--- Local trigger ---");
			console.log(`BODY='${payload}'`);
			console.log(`curl -X POST ${localUrl} \\`);
			console.log(`  -H "Content-Type: application/json" \\`);
			console.log(`  -H "X-Signature: ${sig}" \\`);
			console.log(`  -d "\$BODY"\n`);

			console.log("--- Remote trigger (ntfy.sh) ---");
			const ntfyMessage = JSON.stringify({ payload, sig });
			console.log(`curl -X POST ${ntfyUrl} \\`);
			console.log(`  -H "Content-Type: application/json" \\`);
			console.log(`  -d '${ntfyMessage}'\n`);

			console.log("--- Scripted (compute signature dynamically) ---");
			console.log("SECRET='<your-webhook-secret>'");
			console.log(
				`BODY='{"automation_id":"${automationId}","ts":'$(date +%s000)'}'`,
			);
			console.log(
				'SIG=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | sed \'s/^.* //\')',
			);
			console.log(`curl -X POST ${localUrl} \\`);
			console.log(`  -H "Content-Type: application/json" \\`);
			console.log(`  -H "X-Signature: \$SIG" \\`);
			console.log(`  -d "\$BODY"`);
		});
}
