import { useKeyboard } from "@opentui/react";
import { useCallback, useRef } from "react";

const DEBOUNCE_MS = 400;

export function useDoubleTap(
	targetKey: string,
	onDoubleTap: () => void,
): void {
	const lastTapRef = useRef(0);

	useKeyboard(
		useCallback(
			(key: { name: string }) => {
				if (key.name !== targetKey) return;

				const now = Date.now();
				if (now - lastTapRef.current < DEBOUNCE_MS) {
					lastTapRef.current = 0;
					onDoubleTap();
				} else {
					lastTapRef.current = now;
				}
			},
			[targetKey, onDoubleTap],
		),
	);
}
