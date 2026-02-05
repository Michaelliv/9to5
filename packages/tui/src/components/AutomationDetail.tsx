import type { Automation } from "@9to5/core";
import { Box, Text } from "ink";

const LABEL_WIDTH = 14;

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

export function AutomationDetail({ automation }: { automation: Automation }) {
	const a = automation;

	const statusColor = a.status === "active" ? "green" : "yellow";
	const statusSymbol = a.status === "active" ? "●" : "○";

	return (
		<Box flexDirection="column">
			{/* Header */}
			<Box gap={1}>
				<Text color={statusColor}>{statusSymbol}</Text>
				<Text bold>{a.name}</Text>
				<Text dimColor>({a.status})</Text>
			</Box>
			<Text dimColor>{"─".repeat(60)}</Text>

			{/* Config */}
			<Section title="Configuration">
				<Field label="ID" value={a.id} />
				<Field label="Model" value={a.model} />
				<Field label="Working Dir" value={a.cwd} />
				<Field label="Schedule" value={a.rrule} />
				<Field
					label="Budget"
					value={a.max_budget_usd != null ? `$${a.max_budget_usd}` : null}
				/>
				<Field
					label="Next Run"
					value={
						a.next_run_at ? new Date(a.next_run_at).toLocaleString() : null
					}
				/>
				<Field
					label="Last Run"
					value={
						a.last_run_at ? new Date(a.last_run_at).toLocaleString() : null
					}
				/>
			</Section>

			{/* Prompt */}
			<Section title="Prompt">
				<Text>{a.prompt}</Text>
			</Section>

			{/* System Prompt */}
			{a.system_prompt && (
				<Section title="System Prompt">
					<Text>{a.system_prompt}</Text>
				</Section>
			)}

			{/* Allowed Tools */}
			{a.allowed_tools && (
				<Section title="Allowed Tools">
					<Text>{a.allowed_tools}</Text>
				</Section>
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
