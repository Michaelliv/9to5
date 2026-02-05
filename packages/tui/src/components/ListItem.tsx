import type { ReactNode } from "react";

export function ListItem({
	selected,
	children,
	onClick,
}: { selected: boolean; children: ReactNode; onClick?: () => void }) {
	return (
		<box
			paddingLeft={1}
			paddingRight={1}
			backgroundColor={selected ? "#1a2a3a" : undefined}
			onMouseDown={onClick}
		>
			{children}
		</box>
	);
}
