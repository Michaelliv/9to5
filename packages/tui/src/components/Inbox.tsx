import { type InboxItem, getDb } from "@9to5/core";
import { Box, Text } from "ink";
import { useEffect, useState } from "react";

export function Inbox() {
	const [items, setItems] = useState<InboxItem[]>([]);

	useEffect(() => {
		const db = getDb();
		const rows = db
			.query("SELECT * FROM inbox ORDER BY created_at DESC LIMIT 50")
			.all() as InboxItem[];
		setItems(rows);
	}, []);

	if (items.length === 0) {
		return <Text dimColor>Inbox is empty.</Text>;
	}

	return (
		<Box flexDirection="column">
			{items.map((item) => (
				<Box key={item.id} flexDirection="column" marginBottom={1}>
					<Box gap={2}>
						<Text color={item.read_at ? "white" : "cyan"}>
							{item.read_at ? "  " : "● "}
						</Text>
						<Text bold>{item.title ?? "(no title)"}</Text>
						<Text dimColor>{new Date(item.created_at).toLocaleString()}</Text>
					</Box>
					{item.summary && <Text dimColor> {item.summary}</Text>}
				</Box>
			))}
		</Box>
	);
}
