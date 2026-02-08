import { useCallback, useEffect, useRef, useState } from "react";

const DISPLAY_MS = 2500;

export function useNotification(): {
	message: string | null;
	notify: (msg: string, durationMs?: number) => void;
	dismiss: () => void;
} {
	const [message, setMessage] = useState<string | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const dismiss = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		setMessage(null);
	}, []);

	const notify = useCallback((msg: string, durationMs?: number) => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setMessage(msg);
		timerRef.current = setTimeout(() => {
			setMessage(null);
			timerRef.current = null;
		}, durationMs ?? DISPLAY_MS);
	}, []);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	return { message, notify, dismiss };
}
