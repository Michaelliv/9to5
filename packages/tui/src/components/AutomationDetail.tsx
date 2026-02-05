import type { Automation, Run } from "@9to5/core";
import { getDb } from "@9to5/core";
import { useDbQuery } from "../hooks/useDbQuery.ts";
import { Field } from "./Field.tsx";
import { Section } from "./Section.tsx";

const STATUS_STYLE: Record<string, { symbol: string; color: string }> = {
	pending: { symbol: "◦", color: "yellow" },
	running: { symbol: "⟳", color: "#5599ff" },
	completed: { symbol: "✓", color: "green" },
	failed: { symbol: "✗", color: "red" },
};

function timeAgo(ts: number): string {
	const diff = Date.now() - ts;
	if (diff < 60000) return "just now";
	if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
	return `${Math.floor(diff / 86400000)}d ago`;
}

function formatDuration(ms: number | null): string {
	if (ms == null) return "";
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

export function AutomationDetail({
	automation,
}: { automation: Automation }) {
	const a = automation;
	const db = getDb();

	const { data: recentRuns } = useDbQuery<Run[]>(
		() =>
			db
				.query(
					`SELECT * FROM runs
					 WHERE automation_id = ?
					 ORDER BY created_at DESC
					 LIMIT 5`,
				)
				.all(a.id) as Run[],
	);

	const statusColor = a.status === "active" ? "green" : "yellow";
	const statusSymbol = a.status === "active" ? "●" : "○";

	return (
		<scrollbox flexGrow={1}>
			<box flexDirection="column">
				{/* Header */}
				<text>
					<span fg={statusColor}>{statusSymbol} </span>
					<strong>{a.name}</strong>
					<span fg="#666"> ({a.status})</span>
				</text>

				{/* Config */}
				<Section title="Configuration">
					<Field label="ID" value={a.id} />
					<Field label="Model" value={a.model} />
					<Field label="Working Dir" value={a.cwd} />
					<Field label="Schedule" value={a.rrule} />
					<Field
						label="Budget"
						value={
							a.max_budget_usd != null ? `$${a.max_budget_usd}` : null
						}
					/>
					<Field
						label="Next Run"
						value={
							a.next_run_at
								? new Date(a.next_run_at).toLocaleString()
								: null
						}
					/>
					<Field
						label="Last Run"
						value={
							a.last_run_at
								? new Date(a.last_run_at).toLocaleString()
								: null
						}
					/>
				</Section>

				{/* Prompt */}
				<Section title="Prompt">
					<text>{a.prompt}</text>
				</Section>

				{/* System Prompt */}
				{a.system_prompt ? (
					<Section title="System Prompt">
						<text>{a.system_prompt}</text>
					</Section>
				) : null}

				{/* Allowed Tools */}
				{a.allowed_tools ? (
					<Section title="Allowed Tools">
						<text>{a.allowed_tools}</text>
					</Section>
				) : null}

				{/* Recent Runs */}
				{recentRuns.length > 0 ? (
					<Section title="Recent Runs">
						{recentRuns.map((run) => {
							const st = STATUS_STYLE[run.status] ?? STATUS_STYLE.pending;
							const duration = formatDuration(run.duration_ms);
							const cost = run.cost_usd != null ? `$${run.cost_usd.toFixed(4)}` : "";
							const parts = [timeAgo(run.created_at), duration, cost].filter(Boolean).join(" · ");

							return (
								<text key={run.id}>
									<span fg={st.color}>{st.symbol} </span>
									<span fg="#aaa">{parts}</span>
								</text>
							);
						})}
					</Section>
				) : null}
			</box>
		</scrollbox>
	);
}
