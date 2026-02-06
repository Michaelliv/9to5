import type { Run } from "@9to5/core";
import { getDb } from "@9to5/core";
import { useKeyboard } from "@opentui/react";
import { useCallback, useEffect } from "react";
import { useDoubleTap } from "../hooks/useConfirm.ts";
import { useDbQuery } from "../hooks/useDbQuery.ts";
import { useListNav } from "../hooks/useListNav.ts";
import { useSpinner } from "../hooks/useSpinner.ts";
import { ListItem } from "./ListItem.tsx";

const STATUS_STYLE: Record<string, { symbol: string; color: string }> = {
	pending: { symbol: "◦", color: "yellow" },
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

type RunRow = Run & {
	inbox_id: string | null;
	inbox_read_at: number | null;
};

export function RunList({
	automationId,
	focused,
	onSelect,
	onNotify,
	onBack,
}: {
	automationId: string;
	focused: boolean;
	onSelect: (run: Run) => void;
	onNotify: (message: string) => void;
	onBack: () => void;
}) {
	const db = getDb();

	const { data: rows, refresh } = useDbQuery<RunRow[]>(
		() =>
			db
				.query(
					`SELECT r.*, i.id as inbox_id, i.read_at as inbox_read_at
					 FROM runs r
					 LEFT JOIN inbox i ON i.run_id = r.id
					 WHERE r.automation_id = ?
					 ORDER BY
					   CASE r.status WHEN 'running' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END,
					   r.created_at DESC
					 LIMIT 50`,
				)
				.all(automationId) as RunRow[],
	);

	const { selectedIndex, setSelectedIndex } = useListNav(rows.length, focused);
	const hasRunning = rows.some((r) => r.status === "running");
	const spinnerFrame = useSpinner(hasRunning);

	const selected = rows[selectedIndex] as RunRow | undefined;

	useEffect(() => {
		if (selected) {
			onSelect(selected);
		}
	}, [selected, onSelect]);

	useDoubleTap(
		"d",
		useCallback(() => {
			if (!focused || !selected) return;
			db.run("DELETE FROM inbox WHERE run_id = ?", [selected.id]);
			db.run("DELETE FROM runs WHERE id = ?", [selected.id]);
			refresh();
			onNotify("Deleted run");
		}, [focused, selected, db, refresh, onNotify]),
	);

	useKeyboard((key) => {
		if (!focused) return;

		if (key.name === "left" || key.name === "escape") {
			onBack();
			return;
		}

		if (!selected) return;

		if (key.name === "c") {
			const lines: string[] = [];
			lines.push(`Run: ${selected.id}`);
			lines.push(`Status: ${selected.status}`);
			if (selected.session_id) lines.push(`Session: ${selected.session_id}`);
			if (selected.started_at) lines.push(`Started: ${new Date(selected.started_at).toLocaleString()}`);
			if (selected.completed_at) lines.push(`Completed: ${new Date(selected.completed_at).toLocaleString()}`);
			if (selected.cost_usd != null) lines.push(`Cost: $${selected.cost_usd.toFixed(4)}`);
			if (selected.duration_ms != null) lines.push(`Duration: ${selected.duration_ms}ms`);
			if (selected.num_turns != null) lines.push(`Turns: ${selected.num_turns}`);
			if (selected.result) { lines.push(""); lines.push("--- Result ---"); lines.push(selected.result); }
			if (selected.output) { lines.push(""); lines.push("--- Output ---"); lines.push(selected.output); }
			if (selected.error) { lines.push(""); lines.push("--- Error ---"); lines.push(selected.error); }
			const content = lines.join("\n");
			Bun.spawn(["pbcopy"], { stdin: new Blob([content]) });
			onNotify("Copied run details to clipboard");
			return;
		}

		if (key.name === "m" && selected.inbox_id) {
			const newReadAt = selected.inbox_read_at ? null : Date.now();
			db.run("UPDATE inbox SET read_at = ? WHERE id = ?", [
				newReadAt,
				selected.inbox_id,
			]);
			refresh();
		}
	});

	if (rows.length === 0) {
		return (
			<box flexDirection="column" padding={1}>
				<text>
					<span fg="#555">No runs yet.</span>
				</text>
			</box>
		);
	}

	return (
		<box flexDirection="column">
			{rows.map((r, i) => {
				const st = r.status === "running"
					? { symbol: spinnerFrame, color: "#5599ff" }
					: (STATUS_STYLE[r.status] ?? STATUS_STYLE.pending);
				const sel = i === selectedIndex;
				const unread = r.inbox_id != null && r.inbox_read_at == null;
				const nameColor = sel
					? "cyan"
					: r.status === "failed"
						? "#c55"
						: unread
							? "#ddd"
							: "#aaa";

				return (
					<ListItem key={r.id} selected={sel} onClick={() => setSelectedIndex(i)}>
						<text>
							<span fg={sel ? "cyan" : "#333"}>{sel ? "▸ " : "  "}</span>
							<span fg={st.color}>{st.symbol} </span>
							{unread ? <span fg="cyan">{"● "}</span> : null}
							<span fg={nameColor}>{timeAgo(r.created_at)}</span>
						</text>
					</ListItem>
				);
			})}
		</box>
	);
}
