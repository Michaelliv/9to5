import { type Run, getDb } from "@9to5/core";
import { Box, Text } from "ink";
import { useEffect, useState } from "react";

const STATUS_COLORS: Record<string, string> = {
	pending: "yellow",
	running: "blue",
	completed: "green",
	failed: "red",
};

export function RunHistory() {
	const [runs, setRuns] = useState<Run[]>([]);

	useEffect(() => {
		const db = getDb();
		const rows = db
			.query("SELECT * FROM runs ORDER BY created_at DESC LIMIT 50")
			.all() as Run[];
		setRuns(rows);
	}, []);

	if (runs.length === 0) {
		return <Text dimColor>No runs yet.</Text>;
	}

	return (
		<Box flexDirection="column">
			{runs.map((r) => (
				<Box key={r.id} gap={2}>
					<Text color={STATUS_COLORS[r.status] ?? "white"}>[{r.status}]</Text>
					<Text dimColor>{r.id}</Text>
					<Text>automation={r.automation_id}</Text>
					<Text dimColor>
						{r.started_at ? new Date(r.started_at).toLocaleString() : "—"}
					</Text>
				</Box>
			))}
		</Box>
	);
}
