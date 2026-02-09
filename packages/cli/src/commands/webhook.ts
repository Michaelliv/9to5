import {
	type Automation,
	disableWebhook,
	enableWebhook,
	getDb,
	getNtfyUrl,
	getWebhookConfig,
	isDaemonRunning,
	isWebhookDisabled,
	signPayload,
} from "@9to5/core";
import type { Command } from "commander";

export function registerWebhook(program: Command): void {
	const webhook = program
		.command("webhook")
		.description("Manage webhook triggers");

	webhook
		.command("enable")
		.description("Enable webhook triggers")
		.action(() => {
			const config = enableWebhook();
			console.log("Webhook triggers enabled.\n");
			console.log(`Secret:    ${config.secret}`);
			console.log(
				`Local URL: http://localhost:${config.port}/trigger/<agent-id>`,
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
		.command("info")
		.description("Show webhook configuration")
		.action(() => {
			const config = getWebhookConfig();
			if (!config) {
				if (isWebhookDisabled()) {
					console.log("Webhooks: disabled");
					console.log("\nRun `9to5 webhook enable` to re-enable.");
				} else {
					console.log("No webhook secret found.");
					console.log(
						"\nThe daemon auto-generates a secret on first start. Run `9to5 start` to initialize.",
					);
				}
				return;
			}
			console.log(`Secret:    ${config.secret}`);
			console.log(
				`Local URL: http://localhost:${config.port}/trigger/<agent-id>`,
			);
			console.log(`Ntfy URL:  ${getNtfyUrl(config.secret)}`);
		});

	webhook
		.command("refresh")
		.description("Regenerate the webhook secret")
		.action(() => {
			disableWebhook();
			const config = enableWebhook();
			console.log("Webhook secret regenerated.\n");
			console.log(`Secret:    ${config.secret}`);
			console.log(
				`Local URL: http://localhost:${config.port}/trigger/<agent-id>`,
			);
			console.log(`Ntfy URL:  ${getNtfyUrl(config.secret)}`);
			console.log(
				"\nExisting integrations will need to be updated with the new secret.",
			);
			if (isDaemonRunning()) {
				console.log(
					"Restart the daemon for changes to take effect: 9to5 stop && 9to5 start",
				);
			}
		});

	webhook
		.command("url <agent-id>")
		.description("Print trigger commands for an agent")
		.action((automationId: string) => {
			const config = getWebhookConfig();
			if (!config) {
				console.error(
					"No webhook secret found. Start the daemon first: 9to5 start",
				);
				process.exit(1);
			}

			const db = getDb();
			const automation = db
				.query("SELECT * FROM automations WHERE id = ? AND deleted_at IS NULL")
				.get(automationId) as Automation | null;

			if (!automation) {
				console.error(`Agent ${automationId} not found.`);
				process.exit(1);
			}

			const localUrl = `http://localhost:${config.port}/trigger/${automationId}`;
			const ntfyUrl = getNtfyUrl(config.secret);

			const payload = JSON.stringify({
				automation_id: automationId,
				ts: Date.now(),
			});
			const sig = signPayload(config.secret, payload);

			console.log(`Agent: ${automation.name} (${automationId})\n`);

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
