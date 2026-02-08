import { t } from "../theme.ts";

export function StatusBar({
	hints,
}: { hints: { k: string; label: string }[] }) {
	return (
		<box height={1} flexDirection="row" gap={2}>
			{hints.map((h) => (
				<text key={h.k}>
					<span fg={t.accent}>
						<strong>{h.k}</strong>
					</span>
					<span fg={t.textMuted}> {h.label}</span>
				</text>
			))}
			<text>
				<span fg={t.accent}>
					<strong>q</strong>
				</span>
				<span fg={t.textMuted}> quit</span>
			</text>
		</box>
	);
}
