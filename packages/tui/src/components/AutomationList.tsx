import { type Automation, executeRun, generateId, getDb } from "@9to5/core";
import { Box, Text, useInput } from "ink";
import { useConfirm } from "../hooks/useConfirm.ts";
import { useDbQuery } from "../hooks/useDbQuery.ts";
import { useListNav } from "../hooks/useListNav.ts";
import { ListItem } from "./ListItem.tsx";
import { StatusBar } from "./StatusBar.tsx";

const STATUS_ICON: Record<string, { symbol: string; color: string }> = {
	active: { symbol: "●", color: "green" },
	paused: { symbol: "○", color: "yellow" },
};

function formatNext(ts: number | null): string {
	if (!ts) return "not scheduled";
	const d = new Date(ts);
	const now = new Date();
	const diff = ts - now.getTime();
	if (diff < 0) return "overdue";
	if (diff < 3600000) return `in ${Math.ceil(diff / 60000)}m`;
	if (diff < 86400000) return `in ${Math.ceil(diff / 3600000)}h`;
	return d.toLocaleDateString();
}

export function AutomationList({
	isActive,
	onOpenDetail,
}: {
	isActive: boolean;
	onOpenDetail: (detail: {
		type: "automation";
		automation: Automation;
	}) => void;
}) {
	const db = getDb();

	const { data: automations, refresh } = useDbQuery<Automation[]>(
		() =>
			db
				.query("SELECT * FROM automations ORDER BY created_at DESC")
				.all() as Automation[],
	);

	const { pending, message, confirm } = useConfirm(isActive);
	const { selectedIndex } = useListNav(
		automations.length,
		isActive && !pending,
	);

	const selected = automations[selectedIndex] as Automation | undefined;

	useInput(
		(input, key) => {
			if (!selected || pending) return;

			if (key.return) {
				onOpenDetail({ type: "automation", automation: selected });
			}

			if (input === "r") {
				const runId = generateId();
				const sessionId = generateId();
				executeRun(selected, runId, sessionId, db, generateId);
				refresh();
			}

			if (input === "p") {
				const newStatus = selected.status === "active" ? "paused" : "active";
				db.run(
					"UPDATE automations SET status = ?, updated_at = ? WHERE id = ?",
					[newStatus, Date.now(), selected.id],
				);
				refresh();
			}

			if (input === "d") {
				confirm(`Delete "${selected.name}"?`).then((yes) => {
					if (yes) {
						db.run(
							"DELETE FROM inbox WHERE run_id IN (SELECT id FROM runs WHERE automation_id = ?)",
							[selected.id],
						);
						db.run("DELETE FROM runs WHERE automation_id = ?", [selected.id]);
						db.run("DELETE FROM automations WHERE id = ?", [selected.id]);
						refresh();
					}
				});
			}
		},
		{ isActive },
	);

	if (automations.length === 0) {
		return (
			<Box flexDirection="column" paddingY={1}>
				<Text dimColor>{"  No automations yet."}</Text>
				<Text dimColor>
					{"  Run "}
					<Text color="cyan">9to5 add</Text>
					{" to create one."}
				</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			{automations.map((a, i) => {
				const s = STATUS_ICON[a.status] ?? STATUS_ICON.active;
				const sel = i === selectedIndex;
				return (
					<ListItem key={a.id} selected={sel}>
						<Box flexDirection="column">
							<Box gap={1}>
								<Text color={s.color}>{s.symbol}</Text>
								<Text bold color={sel ? "cyan" : undefined}>
									{a.name}
								</Text>
								<Text dimColor>({a.model})</Text>
							</Box>
							<Box gap={1} paddingLeft={2}>
								<Text dimColor>
									{a.rrule ?? "manual"} · next: {formatNext(a.next_run_at)}
								</Text>
							</Box>
						</Box>
					</ListItem>
				);
			})}
			<StatusBar
				hints={[
					{ k: "↑↓", label: "navigate" },
					{ k: "↵", label: "detail" },
					{ k: "r", label: "run" },
					{ k: "p", label: "pause" },
					{ k: "d", label: "delete" },
				]}
				confirmMessage={pending ? message : undefined}
			/>
		</Box>
	);
}
