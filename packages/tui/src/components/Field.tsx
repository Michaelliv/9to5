const LABEL_WIDTH = 14;

export function Field({
	label,
	value,
}: { label: string; value: string | null }) {
	const padded = `${label}:`.padEnd(LABEL_WIDTH);
	return (
		<box flexDirection="row">
			<text>
				<span fg="#666">{padded}</span>
			</text>
			<text>{value ?? "—"}</text>
		</box>
	);
}
