import { useCallback, useEffect, useRef, useState } from "react";

const POLL_INTERVAL = 3000;

export function useDbQuery<T>(queryFn: () => T): {
	data: T;
	refresh: () => void;
} {
	const [data, setData] = useState<T>(() => queryFn());
	const queryFnRef = useRef(queryFn);
	queryFnRef.current = queryFn;

	const refresh = useCallback(() => {
		setData(queryFnRef.current());
	}, []);

	useEffect(() => {
		const id = setInterval(refresh, POLL_INTERVAL);
		return () => clearInterval(id);
	}, [refresh]);

	return { data, refresh };
}
