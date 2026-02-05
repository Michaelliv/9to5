import { type Automation, getDb } from "@9to5/core";
import { Box, Text } from "ink";
import { useEffect, useState } from "react";

export function AutomationList() {
	const [automations, setAutomations] = useState<Automation[]>([]);

	useEffect(() => {
		const db = getDb();
		const rows = db
			.query("SELECT * FROM automations ORDER BY created_at DESC")
			.all() as Automation[];
		setAutomations(rows);
	}, []);

	if (automations.length === 0) {
		return <Text dimColor>No automations. Use `9to5 add` to create one.</Text>;
	}

	return (
		<Box flexDirection="column">
			{automations.map((a) => (
				<Box key={a.id} gap={2}>
					<Text color={a.status === "active" ? "green" : "yellow"}>
						[{a.status}]
					</Text>
					<Text bold>{a.name}</Text>
					<Text dimColor>{a.id}</Text>
					<Text>model={a.model}</Text>
					<Text dimColor>
						next=
						{a.next_run_at ? new Date(a.next_run_at).toLocaleString() : "—"}
					</Text>
				</Box>
			))}
		</Box>
	);
}
