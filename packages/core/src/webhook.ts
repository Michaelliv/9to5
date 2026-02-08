import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR, ensureDataDir } from "./config.ts";

export const WEBHOOK_SECRET_FILE = join(DATA_DIR, "webhook.secret");
export const WEBHOOK_PORT_FILE = join(DATA_DIR, "webhook.port");
export const WEBHOOK_DISABLED_FILE = join(DATA_DIR, "webhook.disabled");
export const DEFAULT_WEBHOOK_PORT = 9505;
export const TIMESTAMP_MAX_AGE_MS = 5 * 60 * 1000;

export interface WebhookConfig {
	secret: string;
	topic: string;
	port: number;
}

export function deriveTopic(secret: string): string {
	return createHmac("sha256", "9to5-topic")
		.update(secret)
		.digest("hex")
		.slice(0, 32);
}

export function getNtfyUrl(secret: string): string {
	return `https://ntfy.sh/9to5-${deriveTopic(secret)}`;
}

export function getWebhookConfig(): WebhookConfig | null {
	if (!existsSync(WEBHOOK_SECRET_FILE)) return null;
	try {
		const secret = readFileSync(WEBHOOK_SECRET_FILE, "utf-8").trim();
		if (!secret) return null;
		let port = DEFAULT_WEBHOOK_PORT;
		if (existsSync(WEBHOOK_PORT_FILE)) {
			const p = Number.parseInt(
				readFileSync(WEBHOOK_PORT_FILE, "utf-8").trim(),
				10,
			);
			if (!Number.isNaN(p)) port = p;
		}
		return { secret, topic: deriveTopic(secret), port };
	} catch {
		return null;
	}
}

export function isWebhookDisabled(): boolean {
	return existsSync(WEBHOOK_DISABLED_FILE);
}

export function enableWebhook(port?: number): WebhookConfig {
	ensureDataDir();
	if (existsSync(WEBHOOK_DISABLED_FILE)) unlinkSync(WEBHOOK_DISABLED_FILE);
	const secret = randomBytes(32).toString("hex");
	writeFileSync(WEBHOOK_SECRET_FILE, secret, { mode: 0o600 });
	const actualPort = port ?? DEFAULT_WEBHOOK_PORT;
	if (port !== undefined) {
		writeFileSync(WEBHOOK_PORT_FILE, String(actualPort), { mode: 0o600 });
	}
	return { secret, topic: deriveTopic(secret), port: actualPort };
}

export function disableWebhook(): void {
	ensureDataDir();
	writeFileSync(WEBHOOK_DISABLED_FILE, "", { mode: 0o600 });
	if (existsSync(WEBHOOK_SECRET_FILE)) unlinkSync(WEBHOOK_SECRET_FILE);
	if (existsSync(WEBHOOK_PORT_FILE)) unlinkSync(WEBHOOK_PORT_FILE);
}

export function signPayload(secret: string, body: string): string {
	return createHmac("sha256", secret).update(body).digest("hex");
}

export function verifyPayload(
	secret: string,
	body: string,
	signature: string,
): boolean {
	const expected = signPayload(secret, body);
	if (expected.length !== signature.length) return false;
	return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function validateTimestamp(ts: number): boolean {
	const age = Math.abs(Date.now() - ts);
	return age <= TIMESTAMP_MAX_AGE_MS;
}
