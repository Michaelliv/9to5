import { useCallback, useEffect, useRef, useState } from "react";

const DISPLAY_MS = 2500;

export function useNotification(): {
	message: string | null;
	notify: (msg: string) => void;
} {
	const [message, setMessage] = useState<string | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const notify = useCallback((msg: string) => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setMessage(msg);
		timerRef.current = setTimeout(() => {
			setMessage(null);
			timerRef.current = null;
		}, DISPLAY_MS);
	}, []);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	return { message, notify };
}
