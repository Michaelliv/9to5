import { useInput } from "ink";
import { useEffect, useState } from "react";

export function useListNav(
	listLength: number,
	isActive: boolean,
): { selectedIndex: number; setSelectedIndex: (i: number) => void } {
	const [selectedIndex, setSelectedIndex] = useState(0);

	// Clamp when list shrinks
	useEffect(() => {
		if (listLength === 0) {
			setSelectedIndex(0);
		} else if (selectedIndex >= listLength) {
			setSelectedIndex(listLength - 1);
		}
	}, [listLength, selectedIndex]);

	useInput(
		(input, key) => {
			if (key.upArrow || input === "k") {
				setSelectedIndex((i) => Math.max(0, i - 1));
			}
			if (key.downArrow || input === "j") {
				setSelectedIndex((i) => Math.min(listLength - 1, i + 1));
			}
		},
		{ isActive: isActive && listLength > 0 },
	);

	return { selectedIndex, setSelectedIndex };
}
