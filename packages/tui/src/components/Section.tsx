import type { ReactNode } from "react";

export function Section({
	title,
	children,
}: { title: string; children: ReactNode }) {
	return (
		<box flexDirection="column" marginTop={1}>
			<text>
				<span fg="cyan">
					<strong>{title}</strong>
				</span>
			</text>
			<box flexDirection="column" paddingLeft={1}>{children}</box>
		</box>
	);
}
