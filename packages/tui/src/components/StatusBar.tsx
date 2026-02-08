export function StatusBar({
	hints,
}: { hints: { k: string; label: string }[] }) {
	return (
		<box height={1} flexDirection="row" gap={2}>
			{hints.map((h) => (
				<text key={h.k}>
					<span fg="cyan">
						<strong>{h.k}</strong>
					</span>
					<span fg="#666"> {h.label}</span>
				</text>
			))}
			<text>
				<span fg="cyan">
					<strong>q</strong>
				</span>
				<span fg="#666"> quit</span>
			</text>
		</box>
	);
}
