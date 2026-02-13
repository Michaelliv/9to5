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
import { t } from "../theme.ts";
import { ListItem } from "./ListItem.tsx";
import { ShimmerText } from "./ShimmerText.tsx";

const STATUS_ICON: Record<string, { symbol: string; color: string }> = {
	active: { symbol: "●", color: t.success },
	paused: { symbol: "◦", color: t.textMuted },
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
	initialIndex = 0,
	onSelect,
	onNotify,
	onDismissNotify,
	onDrillDown,
}: {
	focused: boolean;
	initialIndex?: number;
	onSelect: (automation: Automation, index: number) => void;
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
					 FROM automations a WHERE a.deleted_at IS NULL AND a.hidden_at IS NULL ORDER BY a.name ASC`,
				)
				.all() as AutomationRow[],
	);

	const { selectedIndex, setSelectedIndex } = useListNav(
		automations.length,
		focused,
		initialIndex,
	);
	const hasRunning = automations.some((a) => a.running_count > 0);
	const spinnerFrame = useSpinner(hasRunning);

	const selected = automations[selectedIndex] as AutomationRow | undefined;

	// Notify parent about selected item for detail panel
	useEffect(() => {
		if (selected) {
			onSelect(selected, selectedIndex);
		}
	}, [selected, selectedIndex, onSelect]);

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
				`Deleted "${name}" · u to undo · 9to5 agent restore ${id}`,
				UNDO_DURATION_MS,
			);
		}, [focused, selected, db, refresh, onNotify]),
	);

	if (automations.length === 0) {
		return (
			<box flexDirection="column">
				<box padding={1} gap={1} flexDirection="column">
					<text>
						<span fg={t.textMuted}>No agents yet.</span>
					</text>
					<text>
						<span fg={t.textMuted}>{"Run "}</span>
						<span fg={t.listAccent}>
							<strong>9to5 agent add</strong>
						</span>
						<span fg={t.textMuted}>{" to create one."}</span>
					</text>
				</box>
			</box>
		);
	}

	return (
		<box flexDirection="column">
			{automations.map((a, i) => {
				const isRunning = a.running_count > 0;
				const isPaused = a.status === "paused";
				const s = isRunning
					? { symbol: spinnerFrame, color: t.running }
					: (STATUS_ICON[a.status] ?? STATUS_ICON.active);
				const sel = i === selectedIndex;
				const nameColor = sel
					? t.listAccent
					: isRunning
						? t.text
						: isPaused
							? t.textMuted
							: t.text;
				const suffixLen =
					a.unread_count > 0 ? ` (${a.unread_count})`.length : 0;
				const nameMax = MAX_NAME_LEN - suffixLen;
				const displayName = truncate(a.name, nameMax);

				return (
					<ListItem
						key={a.id}
						selected={sel}
						onClick={() => setSelectedIndex(i)}
					>
						<text>
							<span fg={s.color}>{s.symbol} </span>
							{isRunning ? (
								<ShimmerText
									text={displayName}
									dim={t.listAccentDim}
									bright={t.running}
									active
									bold
								/>
							) : (
								<span fg={nameColor}>
									<strong>{displayName}</strong>
								</span>
							)}
							{a.unread_count > 0 ? (
								<span fg={t.listAccent}>{` (${a.unread_count})`}</span>
							) : null}
						</text>
					</ListItem>
				);
			})}
		</box>
	);
}
