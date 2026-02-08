import { useEffect, useRef, useState } from "react";

const INTERVAL_MS = 100;

export function useShimmer(active: boolean, length: number): number {
	const [pos, setPos] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const total = length + 3;

	useEffect(() => {
		if (active) {
			intervalRef.current = setInterval(() => {
				setPos((p) => (p + 1) % total);
			}, INTERVAL_MS);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			setPos(0);
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [active, total]);

	return pos;
}
