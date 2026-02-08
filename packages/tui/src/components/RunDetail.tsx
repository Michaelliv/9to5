import type { Run } from "@9to5/core";
import { useSpinner } from "../hooks/useSpinner.ts";
import { getMdStyle, t } from "../theme.ts";
import { Field } from "./Field.tsx";
import { LinkedText } from "./LinkedText.tsx";
import { Section } from "./Section.tsx";

const STATUS_STYLE: Record<string, { symbol: string; color: string }> = {
	pending: { symbol: "◦", color: t.warning },
	completed: { symbol: "✓", color: t.success },
	failed: { symbol: "✗", color: t.error },
};

function isJson(raw: string): boolean {
	try {
		JSON.parse(raw);
		return true;
	} catch {
		return false;
	}
}

function prettyJson(raw: string): string {
	return JSON.stringify(JSON.parse(raw), null, 2);
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
			? { symbol: spinnerFrame, color: t.running }
			: (STATUS_STYLE[run.status] ?? STATUS_STYLE.pending);

	return (
		<scrollbox flexGrow={1}>
			<box flexDirection="column">
				{/* Header */}
				<text>
					<span fg={st.color}>{st.symbol} </span>
					<strong>{automationName ?? run.automation_id}</strong>
					<span fg={t.textMuted}> ({run.status})</span>
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
						{isJson(run.result) ? (
							<LinkedText>{prettyJson(run.result)}</LinkedText>
						) : (
							<markdown
								content={run.result}
								syntaxStyle={getMdStyle()}
								conceal
							/>
						)}
					</Section>
				) : run.output ? (
					<Section title="Output">
						{isJson(run.output) ? (
							<LinkedText>{prettyJson(run.output)}</LinkedText>
						) : (
							<markdown
								content={run.output}
								syntaxStyle={getMdStyle()}
								conceal
							/>
						)}
					</Section>
				) : null}

				{/* Error */}
				{run.error ? (
					<Section title="Error">
						<LinkedText fg={t.error}>{run.error}</LinkedText>
					</Section>
				) : null}

				{!run.output && !run.error ? (
					<box marginTop={1}>
						<text>
							<span fg={t.textMuted}>No output yet.</span>
						</text>
					</box>
				) : null}
			</box>
		</scrollbox>
	);
}
