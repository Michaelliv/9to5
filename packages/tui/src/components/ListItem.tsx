import { Box, Text } from "ink";
import type { ReactNode } from "react";

export function ListItem({
	selected,
	children,
}: { selected: boolean; children: ReactNode }) {
	return (
		<Box paddingLeft={1}>
			<Text color="cyan">{selected ? "▸ " : "  "}</Text>
			<Box>{children}</Box>
		</Box>
	);
}
