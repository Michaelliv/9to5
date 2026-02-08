import { useKeyboard } from "@opentui/react";
import { useEffect, useState } from "react";

export function useListNav(
	listLength: number,
	active = true,
	initialIndex = 0,
): {
	selectedIndex: number;
	setSelectedIndex: (i: number) => void;
	scrollOffset: number;
	getVisibleRange: (viewportHeight: number) => { start: number; end: number };
} {
	const [selectedIndex, setSelectedIndex] = useState(initialIndex);
	const [scrollOffset, setScrollOffset] = useState(0);

	// Clamp when list shrinks
	useEffect(() => {
		if (listLength === 0) {
			setSelectedIndex(0);
			setScrollOffset(0);
		} else if (selectedIndex >= listLength) {
			setSelectedIndex(listLength - 1);
		}
	}, [listLength, selectedIndex]);

	useKeyboard((key) => {
		if (!active) return;
		if (listLength === 0) return;

		if (key.name === "up" || key.name === "k") {
			setSelectedIndex((i) => Math.max(0, i - 1));
		}
		if (key.name === "down" || key.name === "j") {
			setSelectedIndex((i) => Math.min(listLength - 1, i + 1));
		}
	});

	const getVisibleRange = (viewportHeight: number) => {
		const itemHeight = 2; // each list item takes ~2 rows
		const maxVisible = Math.max(1, Math.floor(viewportHeight / itemHeight));

		let start = scrollOffset;
		let end = start + maxVisible;

		// Keep selected item in view
		if (selectedIndex < start) {
			start = selectedIndex;
		} else if (selectedIndex >= end) {
			start = selectedIndex - maxVisible + 1;
		}

		start = Math.max(0, start);
		end = Math.min(listLength, start + maxVisible);

		// Update scroll offset if it changed
		if (start !== scrollOffset) {
			setScrollOffset(start);
		}

		return { start, end };
	};

	return { selectedIndex, setSelectedIndex, scrollOffset, getVisibleRange };
}
