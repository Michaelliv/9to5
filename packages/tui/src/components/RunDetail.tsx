import type { Run } from "@9to5/core";
import { useSpinner } from "../hooks/useSpinner.ts";
import { Field } from "./Field.tsx";
import { LinkedText } from "./LinkedText.tsx";
import { Section } from "./Section.tsx";

const STATUS_STYLE: Record<string, { symbol: string; color: string }> = {
	pending: { symbol: "◦", color: "yellow" },
	completed: { symbol: "✓", color: "green" },
	failed: { symbol: "✗", color: "red" },
};

function prettyText(raw: string): string {
	try {
		const parsed = JSON.parse(raw);
		return JSON.stringify(parsed, null, 2);
	} catch {
		return raw;
	}
}

function formatDuration(ms: number | null): string {
	if (ms == null) return "—";
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

export function RunDetail({
	run,
	automationName,
}: { run: Run; automationName?: string }) {
	const spinnerFrame = useSpinner(run.status === "running");
	const st =
		run.status === "running"
			? { symbol: spinnerFrame, color: "#5599ff" }
			: (STATUS_STYLE[run.status] ?? STATUS_STYLE.pending);

	return (
		<scrollbox flexGrow={1}>
			<box flexDirection="column">
				{/* Header */}
				<text>
					<span fg={st.color}>{st.symbol} </span>
					<strong>{automationName ?? run.automation_id}</strong>
					<span fg="#666"> ({run.status})</span>
				</text>

				{/* Metadata */}
				<Section title="Details">
					<Field label="Run ID" value={run.id} />
					<Field label="Session ID" value={run.session_id} />
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
				{run.cost_usd != null || run.duration_ms != null ? (
					<Section title="Stats">
						<Field
							label="Cost"
							value={
								run.cost_usd != null ? `$${run.cost_usd.toFixed(4)}` : null
							}
						/>
						<Field label="Duration" value={formatDuration(run.duration_ms)} />
						<Field
							label="Turns"
							value={run.num_turns != null ? String(run.num_turns) : null}
						/>
					</Section>
				) : null}

				{/* Result or Output */}
				{run.result ? (
					<Section title="Result">
						<LinkedText>{prettyText(run.result)}</LinkedText>
					</Section>
				) : run.output ? (
					<Section title="Output">
						<LinkedText>{prettyText(run.output)}</LinkedText>
					</Section>
				) : null}

				{/* Error */}
				{run.error ? (
					<Section title="Error">
						<LinkedText fg="red">{run.error}</LinkedText>
					</Section>
				) : null}

				{!run.output && !run.error ? (
					<box marginTop={1}>
						<text>
							<span fg="#666">No output yet.</span>
						</text>
					</box>
				) : null}
			</box>
		</scrollbox>
	);
}
