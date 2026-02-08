import type { Database } from "bun:sqlite";
import type { Automation } from "@9to5/core";
import {
	type WebhookConfig,
	validateTimestamp,
	verifyPayload,
} from "@9to5/core";
import type { Server } from "bun";

export interface WebhookServer {
	stop(): void;
}

export function startWebhookServer(
	config: WebhookConfig,
	db: Database,
	runAutomation: (automation: Automation) => Promise<void>,
): WebhookServer {
	const server: Server = Bun.serve({
		port: config.port,
		hostname: "localhost",
		async fetch(req) {
			const url = new URL(req.url);
			const match = url.pathname.match(/^\/trigger\/(.+)$/);

			if (!match || req.method !== "POST") {
				return new Response("Not found", { status: 404 });
			}

			const automationId = match[1];
			const signature = req.headers.get("x-signature");

			if (!signature) {
				return new Response("Missing X-Signature header", { status: 401 });
			}

			let body: string;
			try {
				body = await req.text();
			} catch {
				return new Response("Bad request", { status: 400 });
			}

			if (!verifyPayload(config.secret, body, signature)) {
				return new Response("Invalid signature", { status: 403 });
			}

			try {
				const parsed = JSON.parse(body);
				if (typeof parsed.ts === "number" && !validateTimestamp(parsed.ts)) {
					return new Response("Timestamp expired", { status: 403 });
				}
			} catch {
				return new Response("Invalid JSON body", { status: 400 });
			}

			const automation = db
				.query("SELECT * FROM automations WHERE id = ? AND deleted_at IS NULL")
				.get(automationId) as Automation | null;

			if (!automation) {
				return new Response("Automation not found", { status: 404 });
			}

			runAutomation(automation).catch((err) => {
				console.error(`Webhook run failed for ${automationId}:`, err);
			});

			return new Response(
				JSON.stringify({ status: "accepted", automation_id: automationId }),
				{ status: 202, headers: { "Content-Type": "application/json" } },
			);
		},
	});

	console.log(`Webhook server listening on http://localhost:${config.port}`);

	return {
		stop() {
			server.stop(true);
		},
	};
}
