import type { Automation, Run } from "@9to5/core";
import { getDb, isDaemonRunning, startDaemon } from "@9to5/core";
import { useKeyboard, useRenderer } from "@opentui/react";
import { useEffect, useState } from "react";
import { AutomationDetail } from "./components/AutomationDetail.tsx";
import { AutomationList } from "./components/AutomationList.tsx";
import { RunDetail } from "./components/RunDetail.tsx";
import { RunList } from "./components/RunList.tsx";
import { StatusBar } from "./components/StatusBar.tsx";
import { useDbQuery } from "./hooks/useDbQuery.ts";
import { useNotification } from "./hooks/useNotification.ts";
import { t } from "./theme.ts";

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
	{ k: "s", label: "resume" },
	{ k: "c", label: "copy output" },
	{ k: "⏎", label: "toggle read" },
	{ k: "dd", label: "delete" },
];

export function App() {
	const renderer = useRenderer();
	const db = getDb();
	const [view, setView] = useState<View>("automations");
	const [selectedAutomation, setSelectedAutomation] =
		useState<Automation | null>(null);
	const [selectedRun, setSelectedRun] = useState<Run | null>(null);
	const { message: notification, notify, dismiss } = useNotification();

	const { data: stats } = useDbQuery(() => {
		const { count: running } = db
			.query(
				"SELECT COUNT(*) as count FROM runs WHERE status IN ('running','pending')",
			)
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
				"SELECT MIN(next_run_at) as next FROM automations WHERE status = 'active' AND deleted_at IS NULL AND next_run_at IS NOT NULL AND next_run_at > ?",
			)
			.get(Date.now()) as { next: number | null };
		if (!isDaemonRunning()) {
			startDaemon();
		}
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

	useEffect(() => {
		const onSelection = (sel: { getSelectedText: () => string }) => {
			const text = sel.getSelectedText();
			if (!text || text.length === 0) return;
			renderer.copyToClipboardOSC52(text);
			Bun.spawn(["pbcopy"], { stdin: new Blob([text]) });
			notify("Copied to clipboard");
		};
		renderer.on("selection", onSelection);
		return () => {
			renderer.off("selection", onSelection);
		};
	}, [renderer, notify]);

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
		view === "automations"
			? "Automations"
			: `← ${selectedAutomation?.name ?? ""}`;

	const detailTitle =
		view === "automations"
			? "Details"
			: selectedRun
				? `Run ${selectedRun.id.slice(0, 8)}`
				: "Details";

	return (
		<box flexDirection="column" width="100%" height="100%">
			{/* 2-Column Content */}
			<box flexDirection="row" flexGrow={1}>
				{/* Left Panel */}
				<box
					flexDirection="column"
					width={28}
					overflow="hidden"
					border
					borderStyle="rounded"
					borderColor={t.border}
					title={leftTitle}
				>
					{view === "automations" ? (
						<AutomationList
							focused={true}
							onSelect={setSelectedAutomation}
							onNotify={notify}
							onDismissNotify={dismiss}
							onDrillDown={handleDrillDown}
						/>
					) : selectedAutomation ? (
						<RunList
							key={selectedAutomation.id}
							automationId={selectedAutomation.id}
							automationCwd={selectedAutomation.cwd}
							renderer={renderer}
							focused={true}
							onSelect={setSelectedRun}
							onNotify={notify}
							onBack={handleBack}
						/>
					) : null}
				</box>

				{/* Right Panel - Detail */}
				<box
					flexDirection="column"
					flexGrow={1}
					border
					borderStyle="rounded"
					borderColor={t.border}
					title={detailTitle}
					paddingLeft={1}
				>
					{view === "automations" && selectedAutomation ? (
						<AutomationDetail
							key={selectedAutomation.id}
							automation={selectedAutomation}
						/>
					) : view === "runs" && selectedRun ? (
						<RunDetail
							run={selectedRun}
							automationName={selectedAutomation?.name}
						/>
					) : (
						<box flexGrow={1} justifyContent="center" alignItems="center">
							<text>
								<span fg={t.textMuted}>Select an item to view details</span>
							</text>
						</box>
					)}
				</box>
			</box>

			{/* Status Bar */}
			<box
				height={4}
				flexDirection="column"
				border
				borderStyle="rounded"
				borderColor={t.border}
				title="9to5"
				paddingLeft={1}
				paddingRight={1}
			>
				{/* Row 1: Shortcuts */}
				<StatusBar
					hints={
						view === "runs"
							? RUNS_HINTS
							: [
									{ k: "↑↓", label: "navigate" },
									{ k: "→/⏎", label: "runs" },
									{ k: "r", label: "run" },
									{
										k: "p",
										label:
											selectedAutomation?.status === "active"
												? "pause"
												: "resume",
									},
									{ k: "dd", label: "delete" },
								]
					}
				/>
				{/* Row 2: Status + Notification */}
				<box height={1} flexDirection="row">
					<text>
						<span fg={t.dot}>{"◆"}</span>
						{statParts.length > 0 ? (
							<span fg={t.textMuted}>
								{" · "}
								{statParts.join(" · ")}
							</span>
						) : null}
					</text>
					<box flexGrow={1} />
					{notification ? (
						<text>
							<span fg={t.text}>{notification}</span>
						</text>
					) : null}
				</box>
			</box>
		</box>
	);
}
