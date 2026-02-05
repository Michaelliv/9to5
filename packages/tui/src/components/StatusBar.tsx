import { Box, Text } from "ink";

function Key({ k }: { k: string }) {
	return (
		<Text color="cyan" bold>
			{k}
		</Text>
	);
}

function Hint({ k, label }: { k: string; label: string }) {
	return (
		<Text>
			<Key k={k} />
			<Text dimColor> {label}</Text>
		</Text>
	);
}

export function StatusBar({
	hints,
	confirmMessage,
}: { hints: { k: string; label: string }[]; confirmMessage?: string }) {
	return (
		<Box flexDirection="column" marginTop={1}>
			<Text dimColor>{"─".repeat(60)}</Text>
			{confirmMessage ? (
				<Box paddingX={1}>
					<Text color="yellow" bold>
						{"⚠ "}
						{confirmMessage}
					</Text>
					<Text>
						{"  "}
						<Key k="y" />
						<Text dimColor> confirm </Text>
						<Key k="n" />
						<Text dimColor> cancel</Text>
					</Text>
				</Box>
			) : (
				<Box paddingX={1} gap={2}>
					{hints.map((h) => (
						<Hint key={h.k} k={h.k} label={h.label} />
					))}
					<Hint k="q" label="quit" />
				</Box>
			)}
		</Box>
	);
}
