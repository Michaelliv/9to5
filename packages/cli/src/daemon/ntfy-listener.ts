import type { Database } from "bun:sqlite";
import type { Automation } from "@9to5/core";
import {
	type WebhookConfig,
	getNtfyUrl,
	validateTimestamp,
	verifyPayload,
} from "@9to5/core";

export interface NtfyListener {
	stop(): void;
}

const MIN_RECONNECT_MS = 5_000;
const MAX_RECONNECT_MS = 60_000;

export function startNtfyListener(
	config: WebhookConfig,
	db: Database,
	runAutomation: (automation: Automation) => Promise<void>,
): NtfyListener {
	let stopped = false;
	let abortController = new AbortController();
	let reconnectMs = MIN_RECONNECT_MS;

	const sseUrl = `${getNtfyUrl(config.secret)}/sse`;
	console.log(`Ntfy listener connected to ${getNtfyUrl(config.secret)}`);

	async function connect(): Promise<void> {
		while (!stopped) {
			try {
				abortController = new AbortController();
				const res = await fetch(sseUrl, {
					signal: abortController.signal,
					headers: { Accept: "text/event-stream" },
				});

				if (!res.ok || !res.body) {
					throw new Error(`Ntfy returned ${res.status}`);
				}

				reconnectMs = MIN_RECONNECT_MS;

				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let buffer = "";

				while (!stopped) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split("\n");
					buffer = lines.pop() ?? "";

					let eventData = "";
					for (const line of lines) {
						if (line.startsWith("data: ")) {
							eventData += line.slice(6);
						} else if (line === "" && eventData) {
							handleEvent(eventData, config, db, runAutomation);
							eventData = "";
						}
					}
				}
			} catch (err) {
				if (stopped) return;
				console.error(
					`Ntfy connection error, reconnecting in ${reconnectMs / 1000}s:`,
					err instanceof Error ? err.message : err,
				);
			}

			if (stopped) return;
			await new Promise((r) => setTimeout(r, reconnectMs));
			reconnectMs = Math.min(reconnectMs * 2, MAX_RECONNECT_MS);
		}
	}

	connect();

	return {
		stop() {
			stopped = true;
			abortController.abort();
		},
	};
}

function handleEvent(
	data: string,
	config: WebhookConfig,
	db: Database,
	runAutomation: (automation: Automation) => Promise<void>,
): void {
	try {
		const event = JSON.parse(data);

		// ntfy wraps the event — the actual message is in event.message
		const messageStr = event.message ?? event.data ?? data;
		if (typeof messageStr !== "string") return;

		let message: { payload: string; sig: string };
		try {
			message = JSON.parse(messageStr);
		} catch {
			return;
		}

		if (!message.payload || !message.sig) return;

		if (!verifyPayload(config.secret, message.payload, message.sig)) {
			console.error("Ntfy: rejected message with invalid signature");
			return;
		}

		const payload = JSON.parse(message.payload);

		if (typeof payload.ts === "number" && !validateTimestamp(payload.ts)) {
			console.error("Ntfy: rejected message with expired timestamp");
			return;
		}

		const automationId = payload.automation_id;
		if (!automationId) return;

		const automation = db
			.query("SELECT * FROM automations WHERE id = ? AND deleted_at IS NULL")
			.get(automationId) as Automation | null;

		if (!automation) {
			console.error(`Ntfy: automation ${automationId} not found`);
			return;
		}

		runAutomation(automation).catch((err) => {
			console.error(`Ntfy run failed for ${automationId}:`, err);
		});
	} catch (err) {
		console.error("Ntfy: failed to process event:", err);
	}
}
