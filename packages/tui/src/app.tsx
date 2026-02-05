import type { Automation, Run } from "@9to5/core";
import { getDb } from "@9to5/core";
import { useKeyboard, useRenderer } from "@opentui/react";
import { useState } from "react";
import { AutomationDetail } from "./components/AutomationDetail.tsx";
import { AutomationList } from "./components/AutomationList.tsx";
import { RunDetail } from "./components/RunDetail.tsx";
import { RunList } from "./components/RunList.tsx";
import { StatusBar } from "./components/StatusBar.tsx";
import { useDbQuery } from "./hooks/useDbQuery.ts";
import { useNotification } from "./hooks/useNotification.ts";

type View = "automations" | "runs";

function formatCountdown(ts: number | null): string | null {
	if (ts == null) return null;
	const diff = ts - Date.now();
	if (diff <= 0) return "now";
	if (diff < 60000) return `${Math.ceil(diff / 1000)}s`;
	if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
	return `${Math.floor(diff / 86400000)}d`;
}

const RUNS_HINTS = [
	{ k: "←", label: "back" },
	{ k: "↑↓", label: "navigate" },
	{ k: "m", label: "toggle read" },
	{ k: "dd", label: "delete" },
];

export function App() {
	const renderer = useRenderer();
	const db = getDb();
	const [view, setView] = useState<View>("automations");
	const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
	const [selectedRun, setSelectedRun] = useState<Run | null>(null);
	const { message: notification, notify } = useNotification();

	const { data: stats } = useDbQuery(() => {
		const { count: running } = db
			.query("SELECT COUNT(*) as count FROM runs WHERE status IN ('running','pending')")
			.get() as { count: number };
		const { count: failed } = db
			.query(
				`SELECT COUNT(*) as count FROM runs r
				 JOIN inbox i ON i.run_id = r.id
				 WHERE r.status = 'failed' AND i.read_at IS NULL`,
			)
			.get() as { count: number };
		const { next: nextRunAt } = db
			.query(
				"SELECT MIN(next_run_at) as next FROM automations WHERE status = 'active' AND next_run_at IS NOT NULL",
			)
			.get() as { next: number | null };
		return { running, failed, nextRunAt };
	});

	const statParts: string[] = [];
	if (stats.running > 0) statParts.push(`${stats.running} running`);
	if (stats.failed > 0) statParts.push(`${stats.failed} failed`);
	const nextIn = formatCountdown(stats.nextRunAt);
	if (nextIn) statParts.push(`next in ${nextIn}`);

	useKeyboard((key) => {
		if (key.name === "q") renderer.destroy();
	});

	const handleDrillDown = () => {
		if (selectedAutomation) {
			setSelectedRun(null);
			setView("runs");
		}
	};

	const handleBack = () => {
		setView("automations");
		setSelectedRun(null);
	};

	const leftTitle =
		view === "automations" ? (
			<span fg="cyan"><strong>Automations</strong></span>
		) : (
			<>
				<span fg="cyan">{"← "}</span>
				<span fg="cyan"><strong>{selectedAutomation?.name ?? ""}</strong></span>
			</>
		);

	return (
		<box
			flexDirection="column"
			width="100%"
			height="100%"
			position="relative"
		>
		<box
			flexDirection="column"
			flexGrow={1}
			border
			borderStyle="rounded"
			borderColor="#444"
		>
			{/* Header */}
			<box height={1} flexDirection="row" paddingLeft={1} paddingRight={1}>
				<text>
					<span fg="#c084fc">
						<strong>{"◆ 9to5"}</strong>
					</span>
				</text>
				<box flexGrow={1} />
				{statParts.length > 0 ? (
					<text>
						<span fg="#666">{statParts.join(" · ")}</span>
					</text>
				) : null}
			</box>

			{/* 2-Column Content */}
			<box flexDirection="row" flexGrow={1}>
				{/* Left Panel */}
				<box
					flexDirection="column"
					width={28}
					overflow="hidden"
				>
					<box height={1} paddingLeft={1}>
						<text>{leftTitle}</text>
					</box>
					{view === "automations" ? (
						<AutomationList
							focused={true}
							onSelect={setSelectedAutomation}
							onNotify={notify}
							onDrillDown={handleDrillDown}
						/>
					) : selectedAutomation ? (
						<RunList
							key={selectedAutomation.id}
							automationId={selectedAutomation.id}
							focused={true}
							onSelect={setSelectedRun}
							onNotify={notify}
							onBack={handleBack}
						/>
					) : null}
				</box>

				{/* Separator */}
				<box width={1} backgroundColor="#444" />

				{/* Right Panel - Detail */}
				<box flexDirection="column" flexGrow={1} paddingLeft={1}>
					{view === "automations" && selectedAutomation ? (
						<AutomationDetail automation={selectedAutomation} />
					) : view === "runs" && selectedRun ? (
						<RunDetail
							run={selectedRun}
							automationName={selectedAutomation?.name}
						/>
					) : (
						<box
							flexGrow={1}
							justifyContent="center"
							alignItems="center"
						>
							<text>
								<span fg="#666">Select an item to view details</span>
							</text>
						</box>
					)}
				</box>
			</box>

			{/* Status Bar */}
			<StatusBar hints={view === "runs" ? RUNS_HINTS : [
				{ k: "↑↓", label: "navigate" },
				{ k: "→/⏎", label: "runs" },
				{ k: "r", label: "run" },
				{ k: "p", label: selectedAutomation?.status === "active" ? "pause" : "resume" },
				{ k: "dd", label: "delete" },
			]} notification={notification} />
		</box>

		</box>
	);
}
