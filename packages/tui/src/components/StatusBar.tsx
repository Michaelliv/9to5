export function StatusBar({
	hints,
	notification,
}: { hints: { k: string; label: string }[]; notification?: string | null }) {
	return (
		<box height={1} flexDirection="row" paddingLeft={1} paddingRight={1} gap={2}>
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
			{notification ? (
				<>
					<box flexGrow={1} />
					<text>
						<span fg="#888">{"› "}</span>
						<span fg="#ccc">{notification}</span>
					</text>
				</>
			) : null}
		</box>
	);
}
