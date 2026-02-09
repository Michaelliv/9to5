import { type InboxItem, getDb } from "@9to5/core";
import type { Command } from "commander";

export function registerInbox(program: Command): void {
	program
		.command("inbox")
		.description("Check your inbox")
		.action(() => {
			const db = getDb();
			const rows = db
				.query("SELECT * FROM inbox ORDER BY created_at DESC LIMIT 50")
				.all() as InboxItem[];

			if (rows.length === 0) {
				console.log("Inbox is empty.");
				return;
			}

			for (const row of rows) {
				const read = row.read_at ? "read" : "unread";
				const date = new Date(row.created_at).toISOString();
				console.log(
					`[${read}] ${row.id}  ${row.title ?? "(no title)"}  ${date}`,
				);
				if (row.summary) {
					console.log(`       ${row.summary}`);
				}
			}
		});
}
