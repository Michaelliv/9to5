import type { ReactNode } from "react";
import { t } from "../theme.ts";

export function Section({
	title,
	children,
}: { title: string; children: ReactNode }) {
	return (
		<box flexDirection="column" marginTop={1}>
			<text>
				<span fg={t.detailAccent}>
					<strong>{title}</strong>
				</span>
			</text>
			<box flexDirection="column" paddingLeft={1}>
				{children}
			</box>
		</box>
	);
}
