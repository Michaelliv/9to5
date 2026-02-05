import { type InboxItem, type Run, getDb } from "@9to5/core";
import { Box, Text, useInput } from "ink";
import { useDbQuery } from "../hooks/useDbQuery.ts";
import { useListNav } from "../hooks/useListNav.ts";
import { ListItem } from "./ListItem.tsx";
import { StatusBar } from "./StatusBar.tsx";

function timeAgo(ts: number): string {
	const diff = Date.now() - ts;
	if (diff < 60000) return "just now";
	if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
	return `${Math.floor(diff / 86400000)}d ago`;
}

export function Inbox({
	isActive,
	onOpenDetail,
}: {
	isActive: boolean;
	onOpenDetail: (detail: {
		type: "run";
		run: Run;
		automationName?: string;
	}) => void;
}) {
	const db = getDb();

	const { data: items, refresh } = useDbQuery<InboxItem[]>(
		() =>
			db
				.query("SELECT * FROM inbox ORDER BY created_at DESC LIMIT 50")
				.all() as InboxItem[],
	);

	const { selectedIndex } = useListNav(items.length, isActive);

	const selected = items[selectedIndex] as InboxItem | undefined;

	useInput(
		(input, key) => {
			if (!selected) return;

			if (input === "m") {
				const newReadAt = selected.read_at ? null : Date.now();
				db.run("UPDATE inbox SET read_at = ? WHERE id = ?", [
					newReadAt,
					selected.id,
				]);
				refresh();
			}

			if (key.return && selected.run_id) {
				if (!selected.read_at) {
					db.run("UPDATE inbox SET read_at = ? WHERE id = ?", [
						Date.now(),
						selected.id,
					]);
					refresh();
				}

				const run = db
					.query("SELECT * FROM runs WHERE id = ?")
					.get(selected.run_id) as Run | null;

				if (run) {
					const automation = db
						.query("SELECT name FROM automations WHERE id = ?")
						.get(run.automation_id) as { name: string } | null;

					onOpenDetail({
						type: "run",
						run,
						automationName: automation?.name,
					});
				}
			}
		},
		{ isActive },
	);

	if (items.length === 0) {
		return <Text dimColor>{"  Inbox is empty."}</Text>;
	}

	return (
		<Box flexDirection="column">
			{items.map((item, i) => {
				const unread = !item.read_at;
				const sel = i === selectedIndex;
				return (
					<ListItem key={item.id} selected={sel}>
						<Box flexDirection="column">
							<Box gap={1}>
								<Text color={unread ? "cyan" : "gray"}>
									{unread ? "●" : "○"}
								</Text>
								<Text
									bold={unread}
									color={sel ? "cyan" : undefined}
									dimColor={!unread && !sel}
								>
									{item.title ?? "(no title)"}
								</Text>
								<Text dimColor>{timeAgo(item.created_at)}</Text>
							</Box>
							{item.summary && (
								<Box paddingLeft={2}>
									<Text dimColor wrap="truncate-end">
										{item.summary}
									</Text>
								</Box>
							)}
						</Box>
					</ListItem>
				);
			})}
			<StatusBar
				hints={[
					{ k: "↑↓", label: "navigate" },
					{ k: "↵", label: "view run" },
					{ k: "m", label: "toggle read" },
				]}
			/>
		</Box>
	);
}
