import type { ReactNode } from "react";

export function ListItem({
	selected,
	children,
	onClick,
}: { selected: boolean; children: ReactNode; onClick?: () => void }) {
	return (
		<box
			paddingLeft={1}
			backgroundColor={selected ? "#0a2830" : undefined}
			onMouseDown={onClick}
		>
			{children}
		</box>
	);
}
