import {
	type Automation,
	RRule,
	executeRun,
	generateId,
	getDb,
} from "@9to5/core";
import { useKeyboard } from "@opentui/react";
import { useCallback, useEffect, useRef } from "react";
import { useDoubleTap } from "../hooks/useConfirm.ts";
import { useDbQuery } from "../hooks/useDbQuery.ts";
import { useListNav } from "../hooks/useListNav.ts";
import { useSpinner } from "../hooks/useSpinner.ts";
import { ListItem } from "./ListItem.tsx";

const STATUS_ICON: Record<string, { symbol: string; color: string }> = {
	active: { symbol: "●", color: "green" },
	paused: { symbol: "◦", color: "#666" },
};

const MAX_NAME_LEN = 20;
const UNDO_DURATION_MS = 15_000;

function truncate(str: string, max: number): string {
	return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

type AutomationRow = Automation & {
	running_count: number;
	unread_count: number;
};

export function AutomationList({
	focused,
	onSelect,
	onNotify,
	onDismissNotify,
	onDrillDown,
}: {
	focused: boolean;
	onSelect: (automation: Automation) => void;
	onNotify: (message: string, durationMs?: number) => void;
	onDismissNotify: () => void;
	onDrillDown: () => void;
}) {
	const db = getDb();
	const lastDeletedRef = useRef<{ id: string; name: string } | null>(null);

	const { data: automations, refresh } = useDbQuery<AutomationRow[]>(
		() =>
			db
				.query(
					`SELECT a.*,
						(SELECT COUNT(*) FROM runs r WHERE r.automation_id = a.id
						 AND r.status IN ('running','pending')) as running_count,
						(SELECT COUNT(*) FROM inbox i JOIN runs r ON i.run_id = r.id
						 WHERE r.automation_id = a.id AND i.read_at IS NULL) as unread_count
					 FROM automations a WHERE a.deleted_at IS NULL ORDER BY created_at DESC`,
				)
				.all() as AutomationRow[],
	);

	const { selectedIndex, setSelectedIndex } = useListNav(
		automations.length,
		focused,
	);
	const hasRunning = automations.some((a) => a.running_count > 0);
	const spinnerFrame = useSpinner(hasRunning);

	const selected = automations[selectedIndex] as AutomationRow | undefined;

	// Notify parent about selected item for detail panel
	useEffect(() => {
		if (selected) {
			onSelect(selected);
		}
	}, [selected, onSelect]);

	useKeyboard((key) => {
		if (!focused) return;

		if (key.name === "u" && lastDeletedRef.current) {
			const { id, name } = lastDeletedRef.current;
			db.run(
				"UPDATE automations SET deleted_at = NULL, status = 'paused', updated_at = ? WHERE id = ?",
				[Date.now(), id],
			);
			lastDeletedRef.current = null;
			refresh();
			onDismissNotify();
			onNotify(`Restored "${name}" as paused`);
			return;
		}

		if (!selected) return;

		if (key.name === "return" || key.name === "right") {
			onDrillDown();
			return;
		}

		if (key.name === "r") {
			const runId = generateId();
			const sessionId = crypto.randomUUID();
			executeRun(selected, runId, sessionId, db, generateId);
			refresh();
			onNotify(`Started run for "${selected.name}"`);
		}

		if (key.name === "p") {
			const newStatus = selected.status === "active" ? "paused" : "active";
			if (newStatus === "active" && selected.rrule) {
				const rule = RRule.fromString(`RRULE:${selected.rrule}`);
				const next = rule.after(new Date());
				db.run(
					"UPDATE automations SET status = ?, next_run_at = ?, updated_at = ? WHERE id = ?",
					[newStatus, next ? next.getTime() : null, Date.now(), selected.id],
				);
			} else {
				db.run(
					"UPDATE automations SET status = ?, updated_at = ? WHERE id = ?",
					[newStatus, Date.now(), selected.id],
				);
			}
			refresh();
			onNotify(
				newStatus === "paused"
					? `Paused "${selected.name}"`
					: `Resumed "${selected.name}"`,
			);
		}
	});

	useDoubleTap(
		"d",
		useCallback(() => {
			if (!focused || !selected) return;
			const { id, name } = selected;
			db.run(
				"UPDATE automations SET deleted_at = ?, updated_at = ? WHERE id = ?",
				[Date.now(), Date.now(), id],
			);
			lastDeletedRef.current = { id, name };
			refresh();
			onNotify(
				`Deleted "${name}" · u to undo · 9to5 restore ${id}`,
				UNDO_DURATION_MS,
			);
		}, [focused, selected, db, refresh, onNotify]),
	);

	if (automations.length === 0) {
		return (
			<box flexDirection="column" padding={1} gap={1}>
				<text>
					<span fg="#555">No automations yet.</span>
				</text>
				<text>
					<span fg="#555">{"Run "}</span>
					<span fg="cyan">
						<strong>9to5 add</strong>
					</span>
					<span fg="#555">{" to create one."}</span>
				</text>
			</box>
		);
	}

	return (
		<box flexDirection="column">
			{automations.map((a, i) => {
				const isRunning = a.running_count > 0;
				const isPaused = a.status === "paused";
				const s = isRunning
					? { symbol: spinnerFrame, color: "#5599ff" }
					: (STATUS_ICON[a.status] ?? STATUS_ICON.active);
				const sel = i === selectedIndex;
				const nameColor = sel
					? "cyan"
					: isRunning
						? "#ccc"
						: isPaused
							? "#777"
							: "#ddd";
				const suffixLen =
					(a.unread_count > 0 ? ` (${a.unread_count})`.length : 0) +
					(isRunning ? " running…".length : 0);
				const nameMax = MAX_NAME_LEN - suffixLen;

				return (
					<ListItem
						key={a.id}
						selected={sel}
						onClick={() => setSelectedIndex(i)}
					>
						<text>
							<span fg={sel ? "cyan" : "#333"}>{sel ? "▸ " : "  "}</span>
							<span fg={s.color}>{s.symbol} </span>
							<span fg={nameColor}>
								<strong>{truncate(a.name, nameMax)}</strong>
							</span>
							{a.unread_count > 0 ? (
								<span fg="cyan">{` (${a.unread_count})`}</span>
							) : null}
							{isRunning ? <span fg="#5599ff"> running…</span> : null}
						</text>
					</ListItem>
				);
			})}
		</box>
	);
}
