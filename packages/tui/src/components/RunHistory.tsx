import { type Run, getDb } from "@9to5/core";
import { Box, Text, useInput } from "ink";
import { useDbQuery } from "../hooks/useDbQuery.ts";
import { useListNav } from "../hooks/useListNav.ts";
import { ListItem } from "./ListItem.tsx";
import { StatusBar } from "./StatusBar.tsx";

const STATUS_STYLE: Record<string, { symbol: string; color: string }> = {
	pending: { symbol: "◦", color: "yellow" },
	running: { symbol: "⟳", color: "blue" },
	completed: { symbol: "✓", color: "green" },
	failed: { symbol: "✗", color: "red" },
};

function formatTime(ts: number | null): string {
	if (!ts) return "—";
	return new Date(ts).toLocaleString();
}

function formatDuration(ms: number | null): string {
	if (!ms) return "";
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function formatCost(usd: number | null): string {
	if (usd == null) return "";
	return `$${usd.toFixed(4)}`;
}

type RunRow = Run & { automation_name: string | null };

export function RunHistory({
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

	const { data: runs } = useDbQuery<RunRow[]>(
		() =>
			db
				.query(
					`SELECT r.*, a.name as automation_name
					 FROM runs r
					 LEFT JOIN automations a ON r.automation_id = a.id
					 ORDER BY r.created_at DESC LIMIT 50`,
				)
				.all() as RunRow[],
	);

	const { selectedIndex } = useListNav(runs.length, isActive);

	const selected = runs[selectedIndex] as RunRow | undefined;

	useInput(
		(_input, key) => {
			if (!selected) return;
			if (key.return) {
				onOpenDetail({
					type: "run",
					run: selected,
					automationName: selected.automation_name ?? undefined,
				});
			}
		},
		{ isActive },
	);

	if (runs.length === 0) {
		return (
			<Text dimColor>
				{"  No runs yet. Trigger one with "}
				<Text color="cyan">r</Text>
				{" from the Automations tab."}
			</Text>
		);
	}

	return (
		<Box flexDirection="column">
			{runs.map((r, i) => {
				const st = STATUS_STYLE[r.status] ?? STATUS_STYLE.pending;
				const sel = i === selectedIndex;
				const dur = formatDuration(r.duration_ms);
				const cost = formatCost(r.cost_usd);
				return (
					<ListItem key={r.id} selected={sel}>
						<Box flexDirection="column">
							<Box gap={1}>
								<Text color={st.color}>{st.symbol}</Text>
								<Text bold color={sel ? "cyan" : undefined}>
									{r.automation_name ?? r.automation_id}
								</Text>
								<Text dimColor>{r.status}</Text>
								{dur && <Text dimColor>{dur}</Text>}
								{cost && <Text color="green">{cost}</Text>}
							</Box>
							<Box gap={1} paddingLeft={2}>
								<Text dimColor>{formatTime(r.started_at)}</Text>
								{r.num_turns != null && (
									<Text dimColor>· {r.num_turns} turns</Text>
								)}
							</Box>
						</Box>
					</ListItem>
				);
			})}
			<StatusBar
				hints={[
					{ k: "↑↓", label: "navigate" },
					{ k: "↵", label: "view output" },
				]}
			/>
		</Box>
	);
}
