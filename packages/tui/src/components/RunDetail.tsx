import type { Run } from "@9to5/core";
import { Box, Text } from "ink";

const LABEL_WIDTH = 14;

const STATUS_STYLE: Record<string, { symbol: string; color: string }> = {
	pending: { symbol: "◦", color: "yellow" },
	running: { symbol: "⟳", color: "blue" },
	completed: { symbol: "✓", color: "green" },
	failed: { symbol: "✗", color: "red" },
};

function Field({ label, value }: { label: string; value: string | null }) {
	const padded = `${label}:`.padEnd(LABEL_WIDTH);
	return (
		<Box>
			<Text dimColor>{padded}</Text>
			<Text>{value ?? "—"}</Text>
		</Box>
	);
}

function Section({
	title,
	children,
}: { title: string; children: React.ReactNode }) {
	return (
		<Box flexDirection="column" marginTop={1}>
			<Text bold color="cyan">
				{title}
			</Text>
			<Box flexDirection="column" paddingLeft={1} marginTop={0}>
				{children}
			</Box>
		</Box>
	);
}

function formatDuration(ms: number | null): string {
	if (!ms) return "—";
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

export function RunDetail({
	run,
	automationName,
}: { run: Run; automationName?: string }) {
	const st = STATUS_STYLE[run.status] ?? STATUS_STYLE.pending;

	return (
		<Box flexDirection="column">
			{/* Header */}
			<Box gap={1}>
				<Text color={st.color}>{st.symbol}</Text>
				<Text bold>{automationName ?? run.automation_id}</Text>
				<Text dimColor>({run.status})</Text>
			</Box>
			<Text dimColor>{"─".repeat(60)}</Text>

			{/* Metadata */}
			<Section title="Details">
				<Field label="Run ID" value={run.id} />
				<Field label="Session ID" value={run.session_id} />
				<Field label="Automation" value={automationName ?? run.automation_id} />
				<Field
					label="Started"
					value={
						run.started_at ? new Date(run.started_at).toLocaleString() : null
					}
				/>
				<Field
					label="Completed"
					value={
						run.completed_at
							? new Date(run.completed_at).toLocaleString()
							: null
					}
				/>
			</Section>

			{/* Stats */}
			{(run.cost_usd != null || run.duration_ms != null) && (
				<Section title="Stats">
					<Field
						label="Cost"
						value={run.cost_usd != null ? `$${run.cost_usd.toFixed(4)}` : null}
					/>
					<Field label="Duration" value={formatDuration(run.duration_ms)} />
					<Field
						label="Turns"
						value={run.num_turns != null ? String(run.num_turns) : null}
					/>
				</Section>
			)}

			{/* Result (parsed) or raw output */}
			{run.result ? (
				<Section title="Result">
					<Text>{run.result}</Text>
				</Section>
			) : run.output ? (
				<Section title="Output">
					<Text>{run.output}</Text>
				</Section>
			) : null}

			{/* Error */}
			{run.error && (
				<Section title="Error">
					<Text color="red">{run.error}</Text>
				</Section>
			)}

			{!run.output && !run.error && (
				<Box marginTop={1}>
					<Text dimColor>No output yet.</Text>
				</Box>
			)}

			{/* Footer */}
			<Box marginTop={1}>
				<Text dimColor>{"─".repeat(60)}</Text>
			</Box>
			<Box paddingX={1}>
				<Text>
					<Text color="cyan" bold>
						esc
					</Text>
					<Text dimColor> back</Text>
				</Text>
			</Box>
		</Box>
	);
}
